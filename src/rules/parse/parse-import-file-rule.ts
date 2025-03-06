import { Config } from "../../types/config.js";
import { Rule } from "../../types/rules.js";
import { loadFile } from "../load/load-file.js";
import { parseRules } from "./parse-rules.js";

//----------------------------------------------------------------------------------------------------------------------
// Parse an "include path" rule
//----------------------------------------------------------------------------------------------------------------------

export function parseImportFileRule(config: Config, parent: Rule, source: Rule.Source, file: string) {
    const { directoryScope } = parent;
    const stack = [...parent.stack];
    const rule: Rule.ImportFile = { directoryScope, children: [], file, parent, source, stack, type: Rule.IMPORT_FILE };
    stack.push(rule);
    parseRules(config, rule, loadFile(rule, file));
    return rule;
}
