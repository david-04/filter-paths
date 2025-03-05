import { Parameters } from "../../types/parameters.js";
import { Rule, Ruleset } from "../../types/rules.js";
import { fail } from "../../utils/fail.js";
import { parseRules } from "../parse/parse-rules.js";
import { validateIncludeExcludeNesting } from "../validate/validate-include-exclude-nesting.js";
import { loadFile } from "./load-file.js";

//----------------------------------------------------------------------------------------------------------------------
// Load the whole ruleset
//----------------------------------------------------------------------------------------------------------------------

export function loadRuleset(parameters: Parameters) {
    const ruleset: Ruleset = { rules: [], type: Rule.RULESET };
    parameters.files.forEach(file => ruleset.rules.push(createImportFileRule(parameters, ruleset, file)));
    const topLevelRuleType = getTopLevelRuleType(ruleset.rules);
    if (!topLevelRuleType) {
        fail("No filter rules have been defined");
    }
    validateIncludeExcludeNesting(ruleset, topLevelRuleType);
    return { ruleset, unmatchedPathAction: topLevelRuleType === Rule.EXCLUDE_GLOB ? "include" : "exclude" } as const;
}

//----------------------------------------------------------------------------------------------------------------------
// Load the rules from one file (wrapped into a single "import file" rule)
//----------------------------------------------------------------------------------------------------------------------

function createImportFileRule(parameters: Parameters, ruleset: Ruleset, file: string) {
    const rule: Rule.ImportFile = {
        atDirectory: undefined,
        children: [],
        file,
        parent: ruleset,
        source: { type: "argv", argv: file },
        type: Rule.IMPORT_FILE,
    };
    parseRules(parameters, rule, loadFile(rule, file));
    return rule;
}

//----------------------------------------------------------------------------------------------------------------------
// Find the first top-level glob role
//----------------------------------------------------------------------------------------------------------------------

function getTopLevelRuleType(rules: ReadonlyArray<Rule>): Rule.IncludeOrExclude | undefined {
    for (const rule of rules) {
        if (rule.type === Rule.EXCLUDE_GLOB || rule.type === Rule.INCLUDE_GLOB) {
            return rule.type;
        } else if (rule.type === Rule.AT_DIRECTORY && rule.secondaryAction) {
            return rule.secondaryAction;
        }
        const ruleType = getTopLevelRuleType(rule.children);
        if (ruleType) {
            return ruleType;
        }
    }
    return undefined;
}
