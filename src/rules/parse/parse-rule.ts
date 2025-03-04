import { Parameters } from "../../types/parameters.js";
import { ParentRule, RuleSource } from "../../types/rule-types.js";
import { fail } from "../../utils/fail.js";
import { parseExcludePathRule, parseIncludePathRule } from "../parse/parse-include-or-exclude-path-rule.js";
import { parseImportFileRule } from "./parse-import-file-rule.js";

//----------------------------------------------------------------------------------------------------------------------
// Parsers
//----------------------------------------------------------------------------------------------------------------------

const HANDLERS = [
    [/^\+$/, parseIncludePathRule],
    [/^-$/, parseExcludePathRule],
    [/^include$/, parseImportFileRule],
    [/^@$/, parseExcludePathRule],
    [/^<+$/, parseExcludePathRule],
] as const;

//----------------------------------------------------------------------------------------------------------------------
// Dispatch a single rule into the matching parser
//----------------------------------------------------------------------------------------------------------------------

export function parseRule(parameters: Parameters, parent: ParentRule, rule: RuleSource) {
    const match = /^([^\s]+)\s(.*)$/.exec(rule.line.trim());
    const [operator, data] = [match?.[1]?.trim() ?? "", match?.[2]?.trim() ?? ""];
    for (const [regexp, handler] of HANDLERS) {
        if (regexp.test(operator)) {
            const newRule = handler(parameters, parent, rule, operator, data);
            parent?.children.push(newRule);
            return newRule;
        }
    }
    return fail(rule, "Invalid filter rule. It must start with one of the following operators: +, -, @, <, include");
}
