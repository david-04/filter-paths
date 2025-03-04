import { CommandLineParameters } from "../../cli/command-line-parameters.js";
import { loadFile } from "../load/load-file.js";
import { ImportFileRule, ParentRule, RuleSource, RuleType } from "../types/rule-types.js";

//----------------------------------------------------------------------------------------------------------------------
// Parse an "include path" rule
//----------------------------------------------------------------------------------------------------------------------

export function parseImportFileRule(
    commandLineParameters: CommandLineParameters,
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
    loadFile(commandLineParameters, file, rule);
    return rule;
}
