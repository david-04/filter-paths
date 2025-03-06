import { Config } from "../../types/config.js";
import { Rule } from "../../types/rules.js";
import { loadFile } from "../load/load-file.js";
import { parseRules } from "./parse-rules.js";

//----------------------------------------------------------------------------------------------------------------------
// Parse an "include path" rule
//----------------------------------------------------------------------------------------------------------------------

export function parseImportFileRule(config: Config, parent: Rule, source: Rule.Source, operator: string, file: string) {
    const stack = [...parent.stack];
    const rule: Rule.ImportFile = {
        directoryScope: parent.directoryScope,
        children: [],
        file,
        parent,
        source,
        stack,
        stringified: getStringified(operator, file),
        type: Rule.IMPORT_FILE,
    };
    stack.push(rule);
    parseRules(config, rule, loadFile(rule, file));
    return rule;
}

//----------------------------------------------------------------------------------------------------------------------
// Get the stringified representation
//----------------------------------------------------------------------------------------------------------------------

function getStringified(operator: string, file: string) {
    return {
        original: `${operator} ${file}`,
        effective: `${operator} ${file}`,
    };
}
