import { Parameters } from "../../types/parameters.js";
import { RuleSource } from "../../types/rule-source.js";
import { Rule } from "../../types/rules.js";
import { loadFile } from "../load/load-file.js";
import { parseRules } from "./parse-rules.js";

//----------------------------------------------------------------------------------------------------------------------
// Parse an "include path" rule
//----------------------------------------------------------------------------------------------------------------------

export function parseImportFileRule(
    parameters: Parameters,
    parent: Rule,
    source: RuleSource,
    _operator: string,
    data: string
) {
    const file = data.trim();
    const rule: Rule.ImportFile = {
        atDirectory: "atDirectory" in parent ? parent.atDirectory : undefined,
        children: [],
        file,
        parent,
        source,
        type: Rule.IMPORT_FILE,
    };
    parseRules(parameters, rule, loadFile(rule, file));
    return rule;
}
