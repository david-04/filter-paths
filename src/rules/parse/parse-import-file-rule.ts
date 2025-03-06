import { Config } from "../../types/config.js";
import { RuleSource } from "../../types/rule-source.js";
import { Rule } from "../../types/rules.js";
import { loadFile } from "../load/load-file.js";
import { parseRules } from "./parse-rules.js";

//----------------------------------------------------------------------------------------------------------------------
// Parse an "include path" rule
//----------------------------------------------------------------------------------------------------------------------

export function parseImportFileRule(config: Config, parent: Rule, source: RuleSource, _operator: string, data: string) {
    const file = data.trim();
    const rule: Rule.ImportFile = {
        directoryScope: "directoryScope" in parent ? parent.directoryScope : undefined,
        children: [],
        file,
        parent,
        source,
        type: Rule.IMPORT_FILE,
    };
    parseRules(config, rule, loadFile(rule, file));
    return rule;
}
