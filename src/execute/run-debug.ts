import { applyRuleset } from "../rules/apply/apply-rules.js";
import { createGlobMatcher } from "../rules/helpers/create-glob.js";
import { normalizePath } from "../rules/helpers/normalize-path.js";
import { Config } from "../types/config.js";
import { Ruleset } from "../types/rules.js";
import { fail } from "../utils/fail.js";
import { stdin } from "../utils/stdin.js";
import { stderr, stdout } from "../utils/stdout-and-stderr.js";

//----------------------------------------------------------------------------------------------------------------------
// Run the application in debug mode
//----------------------------------------------------------------------------------------------------------------------

export async function runDebug(config: Config, ruleset: Ruleset) {
    if (stdin.isTTY) {
        config.files.length
            ? await runDebugInteractiveWithRuleset(ruleset)
            : await runDebugInteractiveWithoutRuleset(config);
    } else {
        config.files.length
            ? await runDebugWithPipedInput(ruleset)
            : fail("stdin must not be redirected when using --debug without any rule files");
    }
}

//----------------------------------------------------------------------------------------------------------------------
// Run in non-interactive debug mode
//----------------------------------------------------------------------------------------------------------------------

export async function runDebugWithPipedInput(ruleset: Ruleset) {
    await stdin.forEachNonBlankLine((line, index) => {
        if (index) {
            stdout.print(["", stdout.DIVIDER, ""]);
        }
        const output = applyRuleset.withAuditTrail(ruleset, line, { printOriginalPath: true, useColor: stdout.isTTY });
        stdout.print(output);
    });
}

//----------------------------------------------------------------------------------------------------------------------
// Run in interactive debug mode with a ruleset
//----------------------------------------------------------------------------------------------------------------------

export async function runDebugInteractiveWithRuleset(ruleset: Ruleset) {
    for (let path = await stdin.prompt("Path to evaluate: "); path; path = await stdin.prompt("Path to evaluate: ")) {
        const output = applyRuleset.withAuditTrail(ruleset, path, { printOriginalPath: false, useColor: stderr.isTTY });
        stderr.print(output);
        stderr.print(["", stderr.DIVIDER, ""]);
    }
}

//----------------------------------------------------------------------------------------------------------------------
// Run in interactive debug mode without a ruleset
//----------------------------------------------------------------------------------------------------------------------

export async function runDebugInteractiveWithoutRuleset(config: Config) {
    for (let data = await promptGlobAndPath(config); data; data = await promptGlobAndPath(config, data)) {
        const result = data.glob.matches(normalizePath(data.path)) ? "🟩 matches" : "🟥 does not match";
        stderr.print([`Result: ${result}`, "", stderr.DIVIDER, "", "Press return to re-use the previous input", ""]);
    }
}

//----------------------------------------------------------------------------------------------------------------------
// Prompt for the glob and the path
//----------------------------------------------------------------------------------------------------------------------

async function promptGlobAndPath(
    config: Config,
    previous?: { readonly glob: Awaited<ReturnType<typeof promptGlob>>; readonly path: string }
) {
    const glob = await promptGlob(config, "Glob:   ", previous?.glob?.glob);
    const path = await stdin.prompt("Path:   ", previous?.path);
    return { glob, path } as const;
}

//----------------------------------------------------------------------------------------------------------------------
// Prompt for a glob
//----------------------------------------------------------------------------------------------------------------------

export async function promptGlob(config: Config, prompt: string, previous?: string) {
    while (true) {
        const glob = await stdin.prompt(prompt, previous);
        try {
            return { glob, matches: createGlobMatcher(config, glob) } as const;
        } catch (error) {
            const message = ["ERROR:".padEnd(prompt.length), error].join("");
            stderr.print(["", message, ""]);
        }
    }
}
