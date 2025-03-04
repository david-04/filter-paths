import { CommandLineParameters } from "../cli/command-line-parameters.js";
import { loadFile } from "./load-file.js";
import { ImportFileRule, Rule, Ruleset, RuleType } from "./rule-types.js";

//----------------------------------------------------------------------------------------------------------------------
// Load the whole ruleset
//----------------------------------------------------------------------------------------------------------------------

export function loadRuleset(commandLineParameters: CommandLineParameters): Ruleset {
    const rules = loadRulesFromAllFiles(commandLineParameters);
    const finalDefaultAction = validateRulesAndGetFinalDefaultAction(rules);
    const type = RuleType.RULESET;
    return { finalDefaultAction, rules, type };
}

//----------------------------------------------------------------------------------------------------------------------
// Load the rules from one file
//----------------------------------------------------------------------------------------------------------------------

function loadRulesFromAllFiles(commandLineParameters: CommandLineParameters) {
    const files = commandLineParameters.filterRuleFiles;
    if (1 < files.length) {
        return files.map(file => loadFileAsImportFileRule(commandLineParameters, file));
    } else {
        return files.flatMap(file => loadFileAsAsRuleArray(commandLineParameters, file));
    }
}

//----------------------------------------------------------------------------------------------------------------------
// Load the rules from one file wrapped into an "import file" rule
//----------------------------------------------------------------------------------------------------------------------

function loadFileAsImportFileRule(commandLineParameters: CommandLineParameters, file: string) {
    const rule: ImportFileRule = {
        atDirectory: undefined,
        children: [],
        file,
        parent: undefined,
        source: undefined,
        type: RuleType.IMPORT_FILE,
    };
    loadFile(commandLineParameters, file, rule);
    return rule;
}

//----------------------------------------------------------------------------------------------------------------------
// Load the rules from one file as a flat array of top-level rules
//----------------------------------------------------------------------------------------------------------------------

function loadFileAsAsRuleArray(commandLineParameters: CommandLineParameters, file: string) {
    return loadFile(commandLineParameters, file);
}

//----------------------------------------------------------------------------------------------------------------------
// Validate the rules and determine the final default action
//----------------------------------------------------------------------------------------------------------------------

function validateRulesAndGetFinalDefaultAction(_rules: ReadonlyArray<Rule>) {
    // check consistency of +/-
    // determine the top-level fallback (+ or -)
    return RuleType.INCLUDE_PATH as const;
}
