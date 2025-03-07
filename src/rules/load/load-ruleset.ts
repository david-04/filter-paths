import { Config } from "../../types/config.js";
import { Rule } from "../../types/rules.js";
import { fail } from "../../utils/fail.js";
import { createFileDescriptor } from "../helpers/create-file-descriptor.js";
import { isDirectoryScope, isExcludeGlob, isIncludeOrExcludeGlob } from "../helpers/rule-type-guards.js";
import { parseImportFileRule } from "../parse/parse-import-file-rule.js";
import { assertIncludeExcludeConsistency } from "../validate/include-exclude-consistency.js";
import { assertNoRuleUnderImport } from "../validate/no-rule-under-import.js";

//----------------------------------------------------------------------------------------------------------------------
// Load the whole ruleset
//----------------------------------------------------------------------------------------------------------------------

export function loadRuleset(config: Config) {
    const rules = config.files.map(file => parseImportFileRule.fromArgv(config, createFileDescriptor(undefined, file)));

    const topLevelRuleType = getTopLevelRuleType(rules);
    if (!topLevelRuleType) {
        fail("No filter rules have been defined");
    }
    assertNoRuleUnderImport(rules);
    assertIncludeExcludeConsistency(rules, topLevelRuleType);
    return { rules, unmatchedPathAction: isExcludeGlob(topLevelRuleType) ? "include" : "exclude" } as const;
}

//----------------------------------------------------------------------------------------------------------------------
// Find the first top-level glob role
//----------------------------------------------------------------------------------------------------------------------

function getTopLevelRuleType(rules: ReadonlyArray<Rule>): Rule.IncludeOrExclude | undefined {
    for (const rule of rules) {
        if (isIncludeOrExcludeGlob(rule)) {
            return rule.type;
        } else if (isDirectoryScope(rule) && rule.secondaryAction) {
            return rule.secondaryAction;
        }
        const ruleType = getTopLevelRuleType(rule.children);
        if (ruleType) {
            return ruleType;
        }
    }
    return undefined;
}
