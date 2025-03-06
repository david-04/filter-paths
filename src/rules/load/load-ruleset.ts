import { Config } from "../../types/config.js";
import { Rule } from "../../types/rules.js";
import { fail } from "../../utils/fail.js";
import { parseRules } from "../parse/parse-rules.js";
import { assertIncludeExcludeConsistency } from "../validate/include-exclude-consistency.js";
import { loadFile } from "./load-file.js";

//----------------------------------------------------------------------------------------------------------------------
// Load the whole ruleset
//----------------------------------------------------------------------------------------------------------------------

export function loadRuleset(config: Config) {
    const rules = new Array<Rule>();
    config.files.forEach(file => rules.push(createImportFileRule(config, file)));
    const topLevelRuleType = getTopLevelRuleType(rules);
    if (!topLevelRuleType) {
        fail("No filter rules have been defined");
    }
    assertIncludeExcludeConsistency(rules, topLevelRuleType);
    return { rules, unmatchedPathAction: topLevelRuleType === Rule.EXCLUDE_GLOB ? "include" : "exclude" } as const;
}

//----------------------------------------------------------------------------------------------------------------------
// Load the rules from one file (wrapped into a single "import file" rule)
//----------------------------------------------------------------------------------------------------------------------

function createImportFileRule(config: Config, file: string) {
    const stack = new Array<Rule>();
    const rule: Rule.ImportFile = {
        directoryScope: undefined,
        children: [],
        file,
        parent: undefined,
        source: { type: "argv", argv: file },
        stack,
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
