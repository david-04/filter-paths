import { Parameters } from "../../types/parameters.js";
import { RuleSource } from "../../types/rule-source.js";
import { Rule } from "../../types/rules.js";
import { fail } from "../../utils/fail.js";
import { parseAtDirectoryRule } from "./parse-at-directory-rule.js";
import { parseBreakRule } from "./parse-break-rule.js";
import { parseGlobSelectorRule } from "./parse-glob-selector-rule.js";
import { parseImportFileRule } from "./parse-import-file-rule.js";

//----------------------------------------------------------------------------------------------------------------------
// Parsers
//----------------------------------------------------------------------------------------------------------------------

const HANDLERS = [
    [/^\+$/, parseGlobSelectorRule],
    [/^-$/, parseGlobSelectorRule],
    [/^(include|import)$/, parseImportFileRule],
    [/^@$/, parseAtDirectoryRule],
    [/^[^\sa-z\d]*<$/i, parseBreakRule],
] as const;

const ALLOWED_OPERATORS = "+, -, @, <, include, import";

//----------------------------------------------------------------------------------------------------------------------
// Dispatch a single rule into the matching parser
//----------------------------------------------------------------------------------------------------------------------

export function parseRule(parameters: Parameters, parent: Rule, rule: RuleSource.File) {
    const match = /^([^\s]+)\s(.*)$/.exec(rule.line.trim());
    const [operator, data] = [match?.[1]?.trim() ?? "", match?.[2]?.trim() ?? ""];
    for (const [regexp, handler] of HANDLERS) {
        if (regexp.test(operator)) {
            const newRule = handler(parameters, parent, rule, operator, data);
            parent?.children.push(newRule);
            return newRule;
        }
    }
    return fail(rule, `Invalid filter rule. It must start with one of the following operators: ${ALLOWED_OPERATORS}`);
}
