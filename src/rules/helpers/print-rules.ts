import { Rule, Ruleset } from "../../types/rules.js";

const INDENT = "  ";

//----------------------------------------------------------------------------------------------------------------------
// Print the rule set
//----------------------------------------------------------------------------------------------------------------------

export function printRules(ruleset: Ruleset) {
    const importRules = ruleset.rules.reduce((total, rule) => total + countImportRules(rule), 0);
    const lines = ruleset.rules.flatMap(rule => renderRule(rule, "", 1 < importRules));
    console.log(lines.join("\n"));
}

//----------------------------------------------------------------------------------------------------------------------
// Recursively count the number of import rules
//----------------------------------------------------------------------------------------------------------------------

function countImportRules(rule: Rule): number {
    return rule.children.reduce(
        (total, child) => total + countImportRules(child),
        rule.type === Rule.IMPORT_FILE ? 1 : 0
    );
}

//----------------------------------------------------------------------------------------------------------------------
// Recursively print a rule
//----------------------------------------------------------------------------------------------------------------------

function renderRule(rule: Rule, indent: string, showImports: boolean): ReadonlyArray<string> {
    if (rule.type === Rule.IMPORT_FILE) {
        return renderImportRule(rule, indent, showImports);
    } else if (rule.type === Rule.AT_DIRECTORY) {
        return printAtDirectoryRule(rule, indent, showImports);
    } else if (rule.type === Rule.BREAK) {
        return printBreakRule(rule, indent, showImports);
    } else {
        rule satisfies Rule.GlobSelector;
        return printGlobSelectorRule(rule, indent, showImports);
    }
}

//----------------------------------------------------------------------------------------------------------------------
// Render an import rule
//----------------------------------------------------------------------------------------------------------------------

function renderImportRule(rule: Rule.ImportFile, indent: string, showImports: boolean) {
    return renderChildren(rule, indent, showImports);
}

//----------------------------------------------------------------------------------------------------------------------
// Render an include or exclude glob pattern rule
//----------------------------------------------------------------------------------------------------------------------

function printGlobSelectorRule(rule: Rule.GlobSelector, indent: string, showImports: boolean) {
    const operator = rule.type === Rule.INCLUDE_GLOB ? "+" : "-";
    const { effective, original } = rule.glob;
    const suffix = effective === original ? "" : ` (original: ${original})`;
    return [`${indent}${operator} ${effective}${suffix}`, ...renderChildren(rule, `${indent}${INDENT}`, showImports)];
}

//----------------------------------------------------------------------------------------------------------------------
// Render an at-directory rule
//----------------------------------------------------------------------------------------------------------------------

function printAtDirectoryRule(rule: Rule.AtDirectory, indent: string, showImports: boolean) {
    const { effective, original } = rule.atDirectory;
    const suffix = effective === original ? "" : ` (original: ${original})`;
    const secondaryOperator = getAtDirectorySecondaryOperator(rule);
    const extraIndent = secondaryOperator.replace(/./g, " ");
    return [
        `${indent}@ ${secondaryOperator}${effective}${suffix}`,
        ...renderChildren(rule, `${indent}${INDENT}${extraIndent}`, showImports),
    ];
}

function getAtDirectorySecondaryOperator(rule: Rule.AtDirectory) {
    if (rule.secondaryAction === Rule.INCLUDE_GLOB) {
        return "+ ";
    } else if (rule.secondaryAction === Rule.EXCLUDE_GLOB) {
        return "- ";
    } else {
        return "";
    }
}

//----------------------------------------------------------------------------------------------------------------------
// Render a break rule
//----------------------------------------------------------------------------------------------------------------------

function printBreakRule(rule: Rule.Break, indent: string, showImports: boolean) {
    const levels = countBreakRuleLevels(rule);
    const patchedIndent = `${indent.substring(0, indent.length - INDENT.length * levels)}|`.padEnd(
        indent.length + 2,
        "<"
    );
    const { effective, original } = rule.glob;
    const suffix = effective === original ? "" : ` (original: ${original})`;
    return [`${patchedIndent}< ${effective}${suffix}`, ...renderChildren(rule, `${indent}${INDENT}`, showImports)];
}

function countBreakRuleLevels(rule: Rule.Break) {
    let levels = 0;
    for (
        let current: Rule.Parent | undefined = rule;
        current && current !== rule.parentToBreak;
        current = "parent" in current ? current.parent : undefined
    ) {
        levels++;
    }
    return levels;
}

//----------------------------------------------------------------------------------------------------------------------
// Render the children of a rule
//----------------------------------------------------------------------------------------------------------------------

function renderChildren(rule: Rule, indent: string, showImports: boolean) {
    return rule.children.flatMap(child => renderRule(child, `${indent}`, showImports));
}
