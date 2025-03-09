import { isatty } from "node:tty";
import { applyRuleset } from "../rules/apply/apply-rules.js";
import { printRuleset } from "../rules/helpers/print-ruleset.js";
import { Config } from "../types/config.js";
import { Ruleset } from "../types/rules.js";
import { fail } from "../utils/fail.js";
import { normalizePath } from "./normalize-path.js";
import { stdin } from "./stdin.js";

const DIVIDER = (() => {
    const max = 120;
    const terminalWidth = isatty(1) && 1 < process.stdout.columns ? process.stdout.columns : max;
    return "".padEnd(terminalWidth, "-");
})();

//----------------------------------------------------------------------------------------------------------------------
// Run the application
//----------------------------------------------------------------------------------------------------------------------

export async function runApplication(config: Config, ruleset: Ruleset) {
    if (config.printRules) {
        printRuleset(ruleset);
    } else if (config.debug) {
        await runDebug(config, ruleset);
    } else {
        await runNonDebug(ruleset);
    }
}

//----------------------------------------------------------------------------------------------------------------------
// Run the application in non-debug mode
//----------------------------------------------------------------------------------------------------------------------

async function runNonDebug(ruleset: Ruleset) {
    await stdin.forEachNonBlankLine(line => {
        if (applyRuleset.withoutAuditTrail(ruleset, normalizePath(line)).includePath) {
            process.stdout.write(`${line}\n`); // don't use console.log to avoid "\r" on Windows
        }
    });
}

//----------------------------------------------------------------------------------------------------------------------
// Run the application in debug mode
//----------------------------------------------------------------------------------------------------------------------

async function runDebug(config: Config, ruleset: Ruleset) {
    if (stdin.isTTY) {
        if (config.files.length) {
            await runDebug.interactiveWithRuleset(ruleset);
        } else {
            await runDebug.interactiveWithoutRuleset(config);
        }
    } else if (config.files.length) {
        await runDebug.nonInteractive(ruleset);
    } else {
        fail("stdin must not be redirected when using --debug without any rule files");
    }
}

//----------------------------------------------------------------------------------------------------------------------
// Debug modes
//----------------------------------------------------------------------------------------------------------------------

namespace runDebug {
    //
    //------------------------------------------------------------------------------------------------------------------
    // Run in non-interactive debug mode
    //------------------------------------------------------------------------------------------------------------------

    export async function nonInteractive(ruleset: Ruleset) {
        await stdin.forEachNonBlankLine((line, index) => {
            if (index) {
                process.stdout.write(`${DIVIDER}\n`);
            }
            applyRulesetAndPrintResult(ruleset, line, { includeOriginalPath: true });
        });
    }

    //------------------------------------------------------------------------------------------------------------------
    // Run in interactive debug mode with a ruleset
    //------------------------------------------------------------------------------------------------------------------

    export async function interactiveWithRuleset(ruleset: Ruleset) {
        process.stderr.write("Path to evaluate: ");
        await stdin.forEachNonBlankLine(line => {
            applyRulesetAndPrintResult(ruleset, line, { includeOriginalPath: false });
            process.stderr.write(`\n${DIVIDER}\n\nPath to evaluate: `);
        });
    }

    //------------------------------------------------------------------------------------------------------------------
    // Run in interactive debug mode without a ruleset
    //------------------------------------------------------------------------------------------------------------------

    export async function interactiveWithoutRuleset(_config: Config) {
        fail("Interactive mode without a ruleset is not implemented yet (TODO)");
    }

    //------------------------------------------------------------------------------------------------------------------
    // Apply the ruleset and stringify the result
    //------------------------------------------------------------------------------------------------------------------

    function applyRulesetAndPrintResult(
        ruleset: Ruleset,
        path: string,
        options: { readonly includeOriginalPath: boolean }
    ) {
        const normalized = normalizePath(path);
        const result = applyRuleset.withAuditTrail(ruleset, normalized);
        const output = [
            ...(options.includeOriginalPath ? [`Path to evaluate: ${path}`] : []),
            `Normalized path:  ${normalized}`,
            "",
            ...stringifyAuditTrail(ruleset, result),
        ];
        process.stderr.write(`${output.join("\n")}\n`);
    }

    //------------------------------------------------------------------------------------------------------------------
    // Stringify the audit trail of evaluated rules
    //------------------------------------------------------------------------------------------------------------------

    function stringifyAuditTrail(_ruleset: Ruleset, result: ReturnType<typeof applyRuleset.withAuditTrail>) {
        const auditTrail = ["TODO: Stringify the audit trail"];
        const conclusion = [
            "=> Result:",
            result.includePath ? "🟩 The path was included" : "🟥 The path was excluded",
            result.isDefaultFallback ? " by default (because no rule matched)" : "",
        ];
        return [...auditTrail, "", conclusion.filter(text => text).join(" ")];
    }
}
