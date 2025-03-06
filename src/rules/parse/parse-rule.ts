import { Config } from "../../types/config.js";
import { RuleSource } from "../../types/rule-source.js";
import { Rule } from "../../types/rules.js";
import { fail } from "../../utils/fail.js";
import { parseBreakRule } from "./parse-break-rule.js";
import { parseDirectoryScopeRule } from "./parse-directory-scope-rule.js";
import { parseGlobSelectorRule } from "./parse-glob-selector-rule.js";
import { parseImportFileRule } from "./parse-import-file-rule.js";

const BREAK_RULE_OPERATOR = /^[^\sa-z\d/]*<(\s|$)/;

//----------------------------------------------------------------------------------------------------------------------
// Dispatch a single rule into the matching parser
//----------------------------------------------------------------------------------------------------------------------

export function parseRule(config: Config, parent: Rule, source: RuleSource.File) {
    const parse = getRuleParser(config, parent, source);
    const rule = parse();
    parent.children.push(rule);
    return rule;
}

//----------------------------------------------------------------------------------------------------------------------
// Get the parser for a specific operator
//----------------------------------------------------------------------------------------------------------------------

function getRuleParser(config: Config, parent: Rule, rule: RuleSource.File) {
    const { operator, data } = splitOperatorAndData(rule);
    switch (operator) {
        case "+":
            return () => parseGlobSelectorRule(config, parent, rule, Rule.INCLUDE_GLOB, data);
        case "-":
            return () => parseGlobSelectorRule(config, parent, rule, Rule.EXCLUDE_GLOB, data);
        case "@":
            return () => parseDirectoryScopeRule(config, parent, rule, data);
        case "import":
        case "include":
            return () => parseImportFileRule(config, parent, rule, data);
        default:
            if (BREAK_RULE_OPERATOR.test(operator)) {
                return () => parseBreakRule(config, parent, rule, operator, data);
            }
    }
    return fail(rule, `Invalid operator: ${operator} (expected +, -, @, <, import or include)`);
}

//----------------------------------------------------------------------------------------------------------------------
// Split a line into the operator and the data
//----------------------------------------------------------------------------------------------------------------------

function splitOperatorAndData(rule: RuleSource.File) {
    const line = normalizeTrimmedLine(rule.line.trim());
    const match = /\s/.exec(line);
    return match
        ? { operator: line.substring(0, match.index).trim(), data: line.substring(match.index + 1).trim() }
        : fail(rule, 'Invalid line syntax. It must start with an operator like "+", "-" or "@".');
}

//----------------------------------------------------------------------------------------------------------------------
// Perform normalization to cater for slight syntax mismatches
//----------------------------------------------------------------------------------------------------------------------

function normalizeTrimmedLine(line: string) {
    if (BREAK_RULE_OPERATOR.exec(line)) {
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
