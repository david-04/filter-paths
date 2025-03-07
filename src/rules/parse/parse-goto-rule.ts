import { Config } from "../../types/config.js";
import { Rule } from "../../types/rules.js";
import { fail } from "../../utils/fail.js";
import { createGlob } from "../helpers/create-glob.js";
import { filterStack } from "../helpers/filter-stack.js";
import { isArgv } from "../helpers/rule-type-utils.js";
import { stringifyStack } from "../helpers/stringify-stack.js";

//----------------------------------------------------------------------------------------------------------------------
// Parse a "goto" rule
//----------------------------------------------------------------------------------------------------------------------

export function parseGotoRule(
    config: Config,
    parent: Rule,
    source: Rule.Source.File,
    operator: string,
    data: string
): Rule.Goto {
    const { directoryScope } = parent;
    const glob = createGlob(config, source, directoryScope, data);
    const stack = [...parent.stack];
    const rule = {
        children: [],
        directoryScope,
        glob,
        parent,
        ruleToSkip: parent,
        source,
        stack,
        stringified: toStringified(data, glob),
        type: Rule.GOTO,
    } satisfies Rule.Goto;
    stack.push(rule);
    rule.ruleToSkip = getRuleToSkip(rule, operator, source);
    return rule;
}

//----------------------------------------------------------------------------------------------------------------------
// Find the parent rule to skip
//----------------------------------------------------------------------------------------------------------------------

function getRuleToSkip(rule: Rule.Goto, operator: string, source: Rule.Source.File) {
    const targetIndentation = source.indentation - operator.length + 1;
    for (const { currentRule, currentIndentation } of getApplicableParents(source.file, rule.parent)) {
        if (currentIndentation === targetIndentation) {
            return currentRule;
        } else if (currentIndentation < targetIndentation) {
            break;
        }
    }
    const stack = filterStack.byFile(rule.stack, rule.source.file, { includeArgv: false });
    const message = [
        'The "goto-arrow" does not properly align with a parent rules',
        "",
        stringifyStack.asOriginalWithLineNumbers(stack),
    ];
    return fail(source, message.join("\n"));
}

//----------------------------------------------------------------------------------------------------------------------
// Extract all applicable parents that could be broken
//----------------------------------------------------------------------------------------------------------------------

function getApplicableParents(file: Rule.Fragment.File, parent: Rule) {
    const applicableParents = new Array<{ currentRule: Rule; currentIndentation: number }>();
    for (let current: Rule | undefined = parent; current; current = current.parent) {
        if (!isArgv(current.source) && current.source.file.equals(file)) {
            applicableParents.push({ currentRule: current, currentIndentation: current.source.indentation });
        }
    }
    return applicableParents;
}

//----------------------------------------------------------------------------------------------------------------------
// Create the stringified representation
//----------------------------------------------------------------------------------------------------------------------

function toStringified(original: string, glob: Rule.Fragment.Glob): Rule.Fragment.Stringified {
    return {
        operator: "<",
        original,
        effective: glob.effective,
    };
}
