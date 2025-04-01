import { crash, expect, tf } from "@david-04/typefinity-cli";
import { fail } from "assert";
import { applyRuleset } from "../rules/apply/apply-rules.js";
import { loadRuleset } from "../rules/load/load-ruleset.js";
import { Config } from "../types/config.js";
import { Ruleset } from "../types/rules.js";

//----------------------------------------------------------------------------------------------------------------------
// Constants
//----------------------------------------------------------------------------------------------------------------------

const DEFAULT_FILENAME = "test.filter";

//----------------------------------------------------------------------------------------------------------------------
// Data types
//----------------------------------------------------------------------------------------------------------------------

export namespace it {
    export type Options = {
        readonly config?: Partial<Pick<Config, "caseSensitive" | "files" | "normalizeOutput">>;
        readonly ruleset: string;
    } & ({ readonly paths: string } | { readonly failsToInitialize: Error | string | RegExp } | {});
}

//----------------------------------------------------------------------------------------------------------------------
// Test the application
//----------------------------------------------------------------------------------------------------------------------

export function it(description: string, options: it.Options) {
    tf.it(description, () => {
        const { firstFileName, fixtures } = getTestFixtures(options.ruleset);
        const config: Config = {
            debug: false,
            caseSensitive: false,
            files: [firstFileName],
            printRules: false,
            testFixtures: fixtures,
            normalizeOutput: true,
            ...options.config,
        };
        if ("paths" in options) {
            assertMatchingBehavior(loadRuleset(config), options.paths);
        } else if ("failsToInitialize" in options) {
            const error =
                options.failsToInitialize instanceof RegExp
                    ? new RegExp(options.failsToInitialize.source, "is")
                    : options.failsToInitialize;
            expect(() => loadRuleset(config)).toThrow(error);
        } else {
            expect(() => loadRuleset(config)).not.toThrow();
        }
    });
}

//----------------------------------------------------------------------------------------------------------------------
// Split the test fixtures
//----------------------------------------------------------------------------------------------------------------------

function getTestFixtures(fixtures: string) {
    const result = new Map<string, string>();
    let firstFileName = "";
    let currentFileName = "";
    for (const line of fixtures.replace(/^([ \t]*\r?\n)*/, "").split(/\r?\n/)) {
        const trimmed = line.trim();
        if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
            currentFileName = trimmed.replace(/^\[/, "").replace(/\]$/, "").trim();
            if (!currentFileName) {
                return crash(`Invalid ruleset line: ${line}`);
            }
        } else {
            if (!currentFileName && trimmed) {
                currentFileName = DEFAULT_FILENAME;
            }
            firstFileName = firstFileName || currentFileName;
            const previousContent = result.get(currentFileName);
            result.set(currentFileName, previousContent ? `${previousContent}\n${line}` : line);
        }
    }
    return { firstFileName, fixtures: result as ReadonlyMap<string, string> };
}

//----------------------------------------------------------------------------------------------------------------------
// Assert that the correct paths match
//----------------------------------------------------------------------------------------------------------------------

function assertMatchingBehavior(ruleset: Ruleset, paths: string) {
    for (const { path, shouldMatch } of parsePaths(paths).flatMap(permutePaths)) {
        const result = applyRuleset.withoutAuditTrail(ruleset, path);
        if (result.includePath && !shouldMatch) {
            fail(`The ruleset unexpectedly matched path ${path}`);
        } else if (!result.includePath && shouldMatch) {
            fail(`The ruleset did not match path ${path}`);
        }
    }
}

//----------------------------------------------------------------------------------------------------------------------
// Create permutations of paths
//----------------------------------------------------------------------------------------------------------------------

function permutePaths({ path, shouldMatch }: { readonly path: string; readonly shouldMatch: boolean }) {
    const normalized = path.replaceAll("\\", "/").replace(/^\.?\//, "");
    return ["", "/", "./"].map(prefix => ({ path: prefix + normalized, shouldMatch }));
}

//----------------------------------------------------------------------------------------------------------------------
// Parse the paths to test
//----------------------------------------------------------------------------------------------------------------------

function parsePaths(paths: string) {
    return paths
        .split(/\r?\n/)
        .map(path => path.trim())
        .filter(path => path)
        .map(parsePath);
}

//----------------------------------------------------------------------------------------------------------------------
// Parse a path to test
//----------------------------------------------------------------------------------------------------------------------

function parsePath(path: string) {
    if (path.startsWith("✅")) {
        return { shouldMatch: true, path: path.substring(1).trim() } as const;
    } else if (path.startsWith("⛔")) {
        return { shouldMatch: false, path: path.substring(1).trim() } as const;
    } else {
        return crash(`Invalid path: ${path} (does not start with ✅ or ⛔)`);
    }
}
