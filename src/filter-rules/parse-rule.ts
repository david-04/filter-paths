import { CommandLineParameters } from "../cli/command-line-parameters.js";
import { fail } from "../utils/fail.js";
import { parseExcludePathRule, parseIncludePathRule } from "./parse-include-or-exclude-path-rule.js";
import { ParentRule, RuleSource } from "./rule-types.js";

//----------------------------------------------------------------------------------------------------------------------
// Parsers
//----------------------------------------------------------------------------------------------------------------------

const HANDLERS = [
    [/^\+$/, parseIncludePathRule],
    [/^-$/, parseExcludePathRule],
    [/^<+$/, parseExcludePathRule],
] as const;

//----------------------------------------------------------------------------------------------------------------------
// Dispatch a single rule into the matching parser
//----------------------------------------------------------------------------------------------------------------------

export function parseRule(commandLineParameters: CommandLineParameters, parent: ParentRule, rule: RuleSource) {
    const match = /^([^\s]+)\s(.*)$/.exec(rule.line.trim());
    const [operator, data] = [match?.[1]?.trim() ?? "", match?.[2]?.trim() ?? ""];
    for (const [regexp, handler] of HANDLERS) {
        if (regexp.test(operator)) {
            const newRule = handler(commandLineParameters, parent, rule, operator, data);
            parent?.children.push(newRule);
            return newRule;
        }
    }
    return fail(rule, "Invalid filter rule. It must start with one of the following operators: +, -, @, <, include");
}
