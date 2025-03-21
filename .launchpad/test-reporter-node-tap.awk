#-----------------------------------------------------------------------------------------------------------------------
# Initialization
#-----------------------------------------------------------------------------------------------------------------------

BEGIN {
    DIVIDER = "------------------------------------------------------------------------------------------------------------------------";
    section = "";
    indent = 0;
    foundStats = 0
    consoleLog = ""
    describe["length"] = 0
    qualifiedName = ""
    hasErrors = 0
}

#-----------------------------------------------------------------------------------------------------------------------
# Ignore everything before the first comment line (# ...)
#-----------------------------------------------------------------------------------------------------------------------
# TAP version 13
# # ...
#-----------------------------------------------------------------------------------------------------------------------

1 == NR, !/^[ \t]*#/ {
    next
}

#-----------------------------------------------------------------------------------------------------------------------
# Capture the stack of describe blocks
#-----------------------------------------------------------------------------------------------------------------------
#    # Subtest:
#-----------------------------------------------------------------------------------------------------------------------

/^[ \t]*# Subtest:/ {
    updateDescribe($0)
}

function updateDescribe(line,   leadingWhitespace, description, idx) {
    leadingWhitespace = line
    sub(/[^ \t].*$/, "", leadingWhitespace)
    leadingWhitespace = int(length(leadingWhitespace) / 4) #/
    description = line
    gsub(/^[ \t]*# Subtest:[ \t]*|[ \t]+$/, "", description)
    describe["length"] = leadingWhitespace + 1
    describe[describe["length"] - 1] = description
    qualifiedName = ""
    for (idx = 0; idx < describe["length"]; idx++) {
        if (describe[idx] != "") {
            qualifiedName = qualifiedName (qualifiedName ? " > " : "") describe[idx]
        }
    }
}


#-----------------------------------------------------------------------------------------------------------------------
# Collect counters (at the end of the input)
#-----------------------------------------------------------------------------------------------------------------------
# tests 8
# suites 6
# pass 8
# fail 0
# cancelled 0
# skipped 0
# todo 0
# duration_ms 126.8677
#-----------------------------------------------------------------------------------------------------------------------

/^# (tests|suites|pass|fail|cancelled|skipped|todo) [0-9]+$/ || /^# duration_ms [0-9]+(\.[0-9]*)*$/ {
    counters[$2] = $3 + 0;
    foundStats = 1
}

foundStats {
    next
}

#-----------------------------------------------------------------------------------------------------------------------
# console.log()
#-----------------------------------------------------------------------------------------------------------------------

!foundStats && /^[ \t]*#/ && !/^[ \t]*# ?Subtest:/ {
    sub(/^[ \t]*# ?/, "")
    consoleLog = consoleLog (consoleLog ? "\n" : "") $0
    next
}

#-----------------------------------------------------------------------------------------------------------------------
# Print failed test results
#-----------------------------------------------------------------------------------------------------------------------

/^[ \t]*not ok/ {
    sub(/[^ \t].*$/, "  " qualifiedName "\n" DIVIDER "\n")
    if (section) {
        print section;
        hasErrors = 1
    }
    section = "\n" DIVIDER;
    indent = match($0, /[^ ]/);
}

/^[ \t]*#/ {
    if (section) {
        print section;
        hasErrors = 1
    }
    section = "";
}

/^[ \t]*location: .*$/ {
    gsub(/\\\\?/, "/");
}

/^[ \t]*type: 'suite'[ \t]*$/ {
    section = ""; # suppress test suite failures
}

section && ! /^[ \t]*(---|duration_ms:.*|\.\.\.|[0-9]+\.\.\.?[0-9]+)[ \t]*$/{
    section = section "\n" substr($0, indent);
}

#-----------------------------------------------------------------------------------------------------------------------
# Create summary
#-----------------------------------------------------------------------------------------------------------------------

END {
    output = "";
    exitCode = 0;
    if (!(counters["fail"] + counters["cancelled"] + counters["skipped"] + counters["todo"] + counters["pass"])) {
        output = "🟥 No test cases found";
        exitCode = 1;
    } else if (counters["fail"] + counters["cancelled"]) {
        output = append(output, getFailed());
        output = append(output, getSkipped());
        output = append(output, getPassed());
        exitCode = 1;
    } else if (counters["skipped"] + counters["todo"]) {
        output = append(output, getPassed());
        output = append(output, getSkipped());
    } else {
        duration = counters["duration_ms"] ? sprintf(" in %.1fs", counters["duration_ms"] * 0.001 + 0.05) : "";
        output = "✓ " counters["pass"] " test" (1 == counters["pass"] ? "" : "s")  " passed" duration;
    }
    if (consoleLog) {
        print "\n" DIVIDER "\nstdout\n" DIVIDER "\n\n" consoleLog;
    }
    if (hasErrors || consoleLog) {
        print ""
    }
    print output;
    if (exitCode) {
        print "";
    }
    exit(exitCode);
}

function getFailed() {
    if (counters["fail"] && counters["cancelled"]) {
        return append(result, "🟥 " (counters["fail"] + counters["cancelled"]) " failed/cancelled");
    } else if (counters["fail"]) {
        return append(result, "🟥 " counters["fail"] " failed");
    } else if (counters["cancelled"]){
        return append(result, "🟥 " counters["cancelled"] " cancelled");
    }
    return "";
}

function getSkipped() {
    if (counters["skipped"] && counters["todo"]) {
        return append(result, "🟨 " (counters["skipped"] + counters["todo"]) " skipped/todo");
    } else if (counters["skipped"]) {
        return append(result, "🟨 " counters["skipped"] " skipped");
    } else {
        return append(result, "🟨 " counters["todo"] " todo");
    }
    return "";

}

function getPassed() {
    return counters["pass"] ? "🟩 " counters["pass"] " passed" : "";
}

function append(string1, string2) {
    if (string1 && string2) {
        return string1 " " string2;
    } else {
        return string1 ? string1 : string2;
    }
}

