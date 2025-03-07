import { Rule, Ruleset } from "../../types/rules.js";
import { isBreak, isDirectoryScope, isImportFile, isIncludeGlob } from "./rule-type-utils.js";

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
    return rule.children.reduce((total, child) => total + countImportRules(child), isImportFile(rule) ? 1 : 0);
}

//----------------------------------------------------------------------------------------------------------------------
// Recursively print a rule
//----------------------------------------------------------------------------------------------------------------------

function renderRule(rule: Rule, indent: string, showImports: boolean): ReadonlyArray<string> {
    if (isImportFile(rule)) {
        return renderImportRule(rule, indent, showImports);
    } else if (isDirectoryScope(rule)) {
        return printDirectoryScopeRule(rule, indent, showImports);
    } else if (isBreak(rule)) {
        return printBreakRule(rule, indent, showImports);
    } else {
        rule satisfies Rule.IncludeOrExclude;
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

function printGlobSelectorRule(rule: Rule.IncludeOrExclude, indent: string, showImports: boolean) {
    const operator = isIncludeGlob(rule) ? "+" : "-";
    const { effective, original } = rule.glob;
    const suffix = effective === original ? "" : ` (original: ${original})`;
    return [`${indent}${operator} ${effective}${suffix}`, ...renderChildren(rule, `${indent}${INDENT}`, showImports)];
}

//----------------------------------------------------------------------------------------------------------------------
// Render a directory scope rule
//----------------------------------------------------------------------------------------------------------------------

function printDirectoryScopeRule(rule: Rule.DirectoryScope, indent: string, showImports: boolean) {
    const { effective, original } = rule.directoryScope;
    const suffix = effective === original ? "" : ` (original: ${original})`;
    const secondaryOperator = getDirectoryScopeSecondaryOperator(rule);
    const extraIndent = secondaryOperator.replace(/./g, " ");
    return [
        `${indent}@ ${secondaryOperator}${effective}${suffix}`,
        ...renderChildren(rule, `${indent}${INDENT}${extraIndent}`, showImports),
    ];
}

function getDirectoryScopeSecondaryOperator(rule: Rule.DirectoryScope) {
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
    for (let current: Rule | undefined = rule; current && current !== rule.parentToBreak; current = current.parent) {
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
