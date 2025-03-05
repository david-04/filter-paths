import { Parameters } from "../../types/parameters.js";
import { Rule, Ruleset } from "../../types/rules.js";
import { parseRules } from "../parse/parse-rules.js";
import { loadFile } from "./load-file.js";

//----------------------------------------------------------------------------------------------------------------------
// Load the whole ruleset
//----------------------------------------------------------------------------------------------------------------------

export function loadRuleset(parameters: Parameters) {
    const ruleset: Ruleset = { rules: [], type: Rule.RULESET };
    parameters.files.forEach(file => ruleset.rules.push(createImportFileRule(parameters, ruleset, file)));
    return ruleset;
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
