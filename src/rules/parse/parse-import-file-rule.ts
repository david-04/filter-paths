import { Parameters } from "../../types/parameters.js";
import { ImportFileRule, ParentRule, RuleSource, RuleType } from "../../types/rule-types.js";
import { loadFile } from "../load/load-file.js";

//----------------------------------------------------------------------------------------------------------------------
// Parse an "include path" rule
//----------------------------------------------------------------------------------------------------------------------

export function parseImportFileRule(
    parameters: Parameters,
    parent: ParentRule,
    source: RuleSource,
    _operator: string,
    data: string
) {
    const file = data.trim();
    const rule: ImportFileRule = {
        atDirectory: parent?.atDirectory,
        children: [],
        file,
        parent,
        source,
        type: RuleType.IMPORT_FILE,
    };
    loadFile(parameters, file, rule);
    return rule;
}
