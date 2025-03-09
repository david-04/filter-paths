import { Config } from "../../types/config.js";
import { Rule, Rules, Ruleset } from "../../types/rules.js";
import { fail } from "../../utils/fail.js";
import { createFileDescriptor } from "../helpers/create-file-descriptor.js";
import { invert, isDirectoryScope, isIncludeOrExcludeGlob } from "../helpers/rule-type-utils.js";
import { parseImportFileRule } from "../parse/parse-import-file-rule.js";
import { assertConsistentSiblingIndentation } from "../validate/consistent-sibling-indentation.js";
import { assertIncludeExcludeConsistency } from "../validate/include-exclude-consistency.js";
import { assertNoRuleUnderGoto } from "../validate/no-rule-under-goto.js";
import { assertNoRuleUnderImport } from "../validate/no-rule-under-import.js";

//----------------------------------------------------------------------------------------------------------------------
// Load the whole ruleset
//----------------------------------------------------------------------------------------------------------------------

export function loadRuleset(config: Config): Ruleset {
    if (0 === config.files.length) {
        return { rules: [], unmatchedPathAction: Rule.INCLUDE_GLOB };
    }
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

function getFirstFilterType(rules: Rules): Rule.Type.IncludeOrExclude | undefined {
    for (const rule of rules) {
        const type = tryGetIncludeOrExcludeType(rule) ?? getFirstFilterType(rule.children);
        if (type) {
            return type;
        }
    }
    return undefined;
}

function tryGetIncludeOrExcludeType(rule: Rule) {
    if (isIncludeOrExcludeGlob(rule)) {
        return rule.type;
    } else if (isDirectoryScope(rule) && rule.secondaryAction) {
        return rule.secondaryAction;
    } else {
        return undefined;
    }
}

//----------------------------------------------------------------------------------------------------------------------
// Validate the ruleset
//----------------------------------------------------------------------------------------------------------------------

function validateRuleset(ruleset: Ruleset) {
    assertNoRuleUnderImport(ruleset.rules);
    assertNoRuleUnderGoto(ruleset.rules);
    assertConsistentSiblingIndentation(ruleset.rules);
    assertIncludeExcludeConsistency(ruleset);
}
