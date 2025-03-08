import { Config } from "../../types/config.js";
import { Rule } from "../../types/rules.js";
import { fail } from "../../utils/fail.js";
import { getGotoRuleOperator } from "../helpers/goto-rule-operator.js";
import { parseDirectoryScopeRule } from "./parse-directory-scope-rule.js";
import { parseGotoRule } from "./parse-goto-rule.js";
import { parseImportFileRule } from "./parse-import-file-rule.js";
import { parseIncludeOrExcludeGlobRule } from "./parse-include-or-exclude-glob-rule.js";

//----------------------------------------------------------------------------------------------------------------------
// Dispatch a single rule into the matching parser
//----------------------------------------------------------------------------------------------------------------------

export function parseRule(config: Config, parent: Rule, source: Rule.Source.File) {
    const parse = getRuleParser(config, parent, source);
    const rule = parse();
    parent.children.push(rule);
    return rule;
}

//----------------------------------------------------------------------------------------------------------------------
// Get the parser for a specific operator
//----------------------------------------------------------------------------------------------------------------------

function getRuleParser(config: Config, parent: Rule, rule: Rule.Source.File) {
    const { operator, data } = splitOperatorAndData(rule);
    if (operator.endsWith("<")) {
        return () => parseGotoRule(config, parent, rule, operator, data);
    }
    switch (operator) {
        case "+":
            return () => parseIncludeOrExcludeGlobRule(config, parent, rule, Rule.INCLUDE_GLOB, data);
        case "-":
            return () => parseIncludeOrExcludeGlobRule(config, parent, rule, Rule.EXCLUDE_GLOB, data);
        case "@":
            return () => parseDirectoryScopeRule(config, parent, rule, data);
        case "import":
        case "include":
            return () => parseImportFileRule.fromFile(config, parent, rule, operator, data);
        default:
            return fail(rule, `Invalid operator: ${operator} (expected +, -, @, <, import or include)`);
    }
}

//----------------------------------------------------------------------------------------------------------------------
// Split a line into the operator and the data
//----------------------------------------------------------------------------------------------------------------------

function splitOperatorAndData(rule: Rule.Source.File) {
    const line = normalizeTrimmedLine(rule.line.trim());
    const operator = getGotoRuleOperator(line);
    if (operator) {
        return { operator, data: line.substring(operator.length).trim() };
    }
    const match = /\s/.exec(line);
    return match
        ? { operator: line.substring(0, match.index).trim(), data: line.substring(match.index + 1).trim() }
        : fail(rule, 'Invalid line syntax. It must start with an operator like "+", "-" or "@".');
}

//----------------------------------------------------------------------------------------------------------------------
// Perform normalization to cater for slight syntax mismatches
//----------------------------------------------------------------------------------------------------------------------

function normalizeTrimmedLine(line: string) {
    if (getGotoRuleOperator(line)) {
        return line;
    } else {
        return line
            .replace(/^@\s*-\s*(.*)/, "@ - $1")
            .replace(/^@\s*\+\s*(.*)/, "@ + $1")
            .replace(/^-\s*@\s*(.*)/, "@ - $1")
            .replace(/^\+\s*@\s*(.*)/, "@ + $1")
            .replace(/^@\s*(.*)$/, "@ $1");
    }
}
