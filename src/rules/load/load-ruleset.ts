import { Config } from "../../types/config.js";
import { Rule } from "../../types/rules.js";
import { fail } from "../../utils/fail.js";
import { createFileDescriptor } from "../helpers/create-file-descriptor.js";
import { parseRules } from "../parse/parse-rules.js";
import { assertIncludeExcludeConsistency } from "../validate/include-exclude-consistency.js";
import { assertNoRuleUnderImport } from "../validate/no-rule-under-import.js";
import { loadFile } from "./load-file.js";

//----------------------------------------------------------------------------------------------------------------------
// Load the whole ruleset
//----------------------------------------------------------------------------------------------------------------------

export function loadRuleset(config: Config) {
    const rules = config.files.map(file => createImportFileRule(config, createFileDescriptor(undefined, file)));
    const topLevelRuleType = getTopLevelRuleType(rules);
    if (!topLevelRuleType) {
        fail("No filter rules have been defined");
    }
    assertNoRuleUnderImport(rules);
    assertIncludeExcludeConsistency(rules, topLevelRuleType);
    return { rules, unmatchedPathAction: topLevelRuleType === Rule.EXCLUDE_GLOB ? "include" : "exclude" } as const;
}

//----------------------------------------------------------------------------------------------------------------------
// Load the rules from one file (wrapped into a single "import file" rule)
//----------------------------------------------------------------------------------------------------------------------

function createImportFileRule(config: Config, file: Rule.Fragment.File) {
    const stack = new Array<Rule>();
    const rule: Rule.ImportFile = {
        directoryScope: undefined,
        children: [],
        file,
        parent: undefined,
        source: { type: "argv", argv: file },
        stack,
        stringified: getStringified(file),
        type: Rule.IMPORT_FILE,
    };
    stack.push(rule);
    parseRules(config, rule, loadFile(rule, file));
    return rule;
}

//----------------------------------------------------------------------------------------------------------------------
// Find the first top-level glob role
//----------------------------------------------------------------------------------------------------------------------

function getTopLevelRuleType(rules: ReadonlyArray<Rule>): Rule.IncludeOrExclude | undefined {
    for (const rule of rules) {
        if (rule.type === Rule.EXCLUDE_GLOB || rule.type === Rule.INCLUDE_GLOB) {
            return rule.type;
        } else if (rule.type === Rule.DIRECTORY_SCOPE && rule.secondaryAction) {
            return rule.secondaryAction;
        }
        const ruleType = getTopLevelRuleType(rule.children);
        if (ruleType) {
            return ruleType;
        }
    }
    return undefined;
}

//----------------------------------------------------------------------------------------------------------------------
// Get the stringified representation
//----------------------------------------------------------------------------------------------------------------------

function getStringified(file: Rule.Fragment.File) {
    return {
        original: `${file.original}`,
        effective: `${file.resolved}`,
    };
}
