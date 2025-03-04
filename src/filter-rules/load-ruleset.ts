import { CommandLineParameters } from "../cli/command-line-parameters.js";
import { loadFile } from "./load-file.js";
import { Rule, Ruleset, RuleType } from "./rule-types.js";

//----------------------------------------------------------------------------------------------------------------------
// Load the whole ruleset
//----------------------------------------------------------------------------------------------------------------------

export function loadRuleset(commandLineParameters: CommandLineParameters): Ruleset {
    const rules = commandLineParameters.filterRuleFiles.flatMap(file => loadFile(commandLineParameters, file));
    const finalDefaultAction = validateRulesAndGetFinalDefaultAction(rules);
    const type = RuleType.RULESET;
    return { finalDefaultAction, rules, type };
}

//----------------------------------------------------------------------------------------------------------------------
// Validate the rules and determine the final default action
//----------------------------------------------------------------------------------------------------------------------

function validateRulesAndGetFinalDefaultAction(_rules: ReadonlyArray<Rule>) {
    // check consistency of +/-
    // determine the top-level fallback (+ or -)
    return RuleType.INCLUDE_PATH as const;
}
