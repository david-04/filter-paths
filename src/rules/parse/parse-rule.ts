import { Config } from "../../types/config.js";
import { RuleSource } from "../../types/rule-source.js";
import { Rule } from "../../types/rules.js";
import { fail } from "../../utils/fail.js";
import { parseBreakRule } from "./parse-break-rule.js";
import { parseDirectoryScopeRule } from "./parse-directory-scope-rule.js";
import { parseGlobSelectorRule } from "./parse-glob-selector-rule.js";
import { parseImportFileRule } from "./parse-import-file-rule.js";

//----------------------------------------------------------------------------------------------------------------------
// Parsers
//----------------------------------------------------------------------------------------------------------------------

const HANDLERS = [
    [/^\+$/, parseGlobSelectorRule],
    [/^-$/, parseGlobSelectorRule],
    [/^(include|import)$/, parseImportFileRule],
    [/^@$/, parseDirectoryScopeRule],
    [/^[^\sa-z\d]*<$/i, parseBreakRule],
] as const;

const ALLOWED_OPERATORS = "+, -, @, <, include, import";

//----------------------------------------------------------------------------------------------------------------------
// Dispatch a single rule into the matching parser
//----------------------------------------------------------------------------------------------------------------------

export function parseRule(config: Config, parent: Rule, rule: RuleSource.File) {
    const match = /^([^\s]+)\s(.*)$/.exec(rule.line.trim());
    const [operator, data] = [match?.[1]?.trim() ?? "", match?.[2]?.trim() ?? ""];
    for (const [regexp, handler] of HANDLERS) {
        if (regexp.test(operator)) {
            const newRule = handler(config, parent, rule, operator, data);
            parent?.children.push(newRule);
            return newRule;
        }
    }
    return fail(rule, `Invalid filter rule. It must start with one of the following operators: ${ALLOWED_OPERATORS}`);
}
