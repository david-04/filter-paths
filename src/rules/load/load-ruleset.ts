import { Config } from "../../types/config.js";
import { Rule, Ruleset } from "../../types/rules.js";
import { fail } from "../../utils/fail.js";
import { createFileDescriptor } from "../helpers/create-file-descriptor.js";
import { invert, isDirectoryScope, isIncludeOrExcludeGlob } from "../helpers/rule-type-utils.js";
import { parseImportFileRule } from "../parse/parse-import-file-rule.js";
import { assertIncludeExcludeConsistency } from "../validate/include-exclude-consistency.js";
import { assertNoRuleUnderGoto } from "../validate/no-rule-under-goto.js";
import { assertNoRuleUnderImport } from "../validate/no-rule-under-import.js";

//----------------------------------------------------------------------------------------------------------------------
// Load the whole ruleset
//----------------------------------------------------------------------------------------------------------------------

export function loadRuleset(config: Config): Ruleset {
    const rules = config.files.map(file => parseImportFileRule.fromArgv(config, createFileDescriptor(undefined, file)));
    const firstFilterType = getFirstFilterType(rules);
    if (!firstFilterType) {
        fail("No filter rules (that include or exclude globs) have been defined");
    }
    const ruleset: Ruleset = { rules, unmatchedPathAction: invert(firstFilterType) };
    validateRuleset(ruleset);
    return ruleset;
}

//----------------------------------------------------------------------------------------------------------------------
// Find the first rule that includes or excludes globs
//----------------------------------------------------------------------------------------------------------------------

function getFirstFilterType(rules: ReadonlyArray<Rule>): Rule.Type.IncludeOrExclude | undefined {
    for (const rule of rules) {
        if (isIncludeOrExcludeGlob(rule)) {
            return rule.type;
        } else if (isDirectoryScope(rule) && rule.secondaryAction) {
            return rule.secondaryAction;
        }
        const ruleType = getFirstFilterType(rule.children);
        if (ruleType) {
            return ruleType;
        }
    }
    return undefined;
}

//----------------------------------------------------------------------------------------------------------------------
// Validate the ruleset
//----------------------------------------------------------------------------------------------------------------------

function validateRuleset(ruleset: Ruleset) {
    assertNoRuleUnderImport(ruleset.rules);
    assertNoRuleUnderGoto(ruleset.rules);
    assertIncludeExcludeConsistency(ruleset);
}
