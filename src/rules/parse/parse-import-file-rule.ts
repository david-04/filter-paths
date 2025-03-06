import { Config } from "../../types/config.js";
import { Rule } from "../../types/rules.js";
import { createFile } from "../helpers/create-file.js";
import { loadFile } from "../load/load-file.js";
import { parseRules } from "./parse-rules.js";

//----------------------------------------------------------------------------------------------------------------------
// Parse an "include path" rule
//----------------------------------------------------------------------------------------------------------------------

export function parseImportFileRule(config: Config, parent: Rule, source: Rule.Source, operator: string, data: string) {
    const stack = [...parent.stack];
    const file = createFile(parent.source.type === "file" ? parent.source.file : undefined, data);
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

function getStringified(operator: string, file: Rule.Fragment.File) {
    return {
        original: `${operator} ${file.original}`,
        effective: `${operator} ${file.resolved}`,
    };
}
