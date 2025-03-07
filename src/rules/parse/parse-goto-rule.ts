import { Config } from "../../types/config.js";
import { Rule } from "../../types/rules.js";
import { fail } from "../../utils/fail.js";
import { createGlob } from "../helpers/create-glob.js";
import { isArgv } from "../helpers/rule-type-utils.js";

//----------------------------------------------------------------------------------------------------------------------
// Parse a "goto" rule
//----------------------------------------------------------------------------------------------------------------------

export function parseGotoRule(config: Config, parent: Rule, source: Rule.Source.File, operator: string, data: string) {
    const { directoryScope } = parent;
    const glob = createGlob(config, source, directoryScope, data);
    const ruleToSkip = getParentToSkip(parent, operator, source);
    const stack = [...parent.stack];
    const rule: Rule.Goto = {
        children: [],
        directoryScope,
        glob,
        parent,
        ruleToSkip,
        source,
        stack,
        stringified: getStringified(data, glob),
        type: Rule.GOTO,
    };
    stack.push(rule);
    return rule;
}

//----------------------------------------------------------------------------------------------------------------------
// Find the parent rule to skip
//----------------------------------------------------------------------------------------------------------------------

function getParentToSkip(parent: Rule, operator: string, source: Rule.Source.File) {
    const targetIndentation = source.indentation - operator.length + 1;
    for (const { currentRule, currentIndentation } of getApplicableParents(source.file, parent)) {
        if (currentIndentation === targetIndentation) {
            return currentRule;
        } else if (currentIndentation < targetIndentation) {
            break;
        }
    }
    return fail(source, "Unable to find the parent rule/level to jump to (invalid alignment)");
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

function getStringified(original: string, glob: Rule.Fragment.Glob): Rule.Fragment.Stringified {
    return {
        operator: "<",
        original,
        effective: glob.effective,
    };
}
