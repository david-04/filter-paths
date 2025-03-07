import { Config } from "../../types/config.js";
import { Rule } from "../../types/rules.js";
import { createFileDescriptor } from "../helpers/create-file-descriptor.js";
import { comesFromFile } from "../helpers/rule-type-guards.js";
import { loadFile } from "../load/load-file.js";
import { parseRules } from "./parse-rules.js";

//----------------------------------------------------------------------------------------------------------------------
// Parse an "include path" rule
//----------------------------------------------------------------------------------------------------------------------

export function parseImportFileRule(config: Config, parent: Rule, source: Rule.Source, operator: string, data: string) {
    const stack = [...parent.stack];
    const file = createFileDescriptor(comesFromFile(parent.source) ? parent.source.file : undefined, data);
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
