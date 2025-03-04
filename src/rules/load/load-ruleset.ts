import { Parameters } from "../../types/parameters.js";
import { ImportFileRule, Rule, Ruleset, RuleType } from "../../types/rule-types.js";
import { loadFile } from "./load-file.js";

//----------------------------------------------------------------------------------------------------------------------
// Load the whole ruleset
//----------------------------------------------------------------------------------------------------------------------

export function loadRuleset(parameters: Parameters): Ruleset {
    const rules = loadRulesFromAllFiles(parameters);
    const finalDefaultAction = validateRulesAndGetFinalDefaultAction(rules);
    const type = RuleType.RULESET;
    return { finalDefaultAction, rules, type };
}

//----------------------------------------------------------------------------------------------------------------------
// Load the rules from one file
//----------------------------------------------------------------------------------------------------------------------

function loadRulesFromAllFiles(parameters: Parameters) {
    const files = parameters.files;
    if (1 < files.length) {
        return files.map(file => loadFileAsImportFileRule(parameters, file));
    } else {
        return files.flatMap(file => loadFileAsAsRuleArray(parameters, file));
    }
}

//----------------------------------------------------------------------------------------------------------------------
// Load the rules from one file wrapped into an "import file" rule
//----------------------------------------------------------------------------------------------------------------------

function loadFileAsImportFileRule(parameters: Parameters, file: string) {
    const rule: ImportFileRule = {
        atDirectory: undefined,
        children: [],
        file,
        parent: undefined,
        source: undefined,
        type: RuleType.IMPORT_FILE,
    };
    loadFile(parameters, file, rule);
    return rule;
}

//----------------------------------------------------------------------------------------------------------------------
// Load the rules from one file as a flat array of top-level rules
//----------------------------------------------------------------------------------------------------------------------

function loadFileAsAsRuleArray(parameters: Parameters, file: string) {
    return loadFile(parameters, file);
}

//----------------------------------------------------------------------------------------------------------------------
// Validate the rules and determine the final default action
//----------------------------------------------------------------------------------------------------------------------

function validateRulesAndGetFinalDefaultAction(_rules: ReadonlyArray<Rule>) {
    // check consistency of +/-
    // determine the top-level fallback (+ or -)
    return RuleType.INCLUDE_PATH as const;
}
