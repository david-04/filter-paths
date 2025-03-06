import { Config } from "../../types/config.js";
import { Rule } from "../../types/rules.js";
import { fail } from "../../utils/fail.js";
import { pathsAreEqual } from "../../utils/path.js";
import { createGlob } from "../helpers/create-glob.js";

//----------------------------------------------------------------------------------------------------------------------
// Parse a "break" rule
//----------------------------------------------------------------------------------------------------------------------

export function parseBreakRule(config: Config, parent: Rule, source: Rule.Source.File, operator: string, data: string) {
    const { directoryScope } = parent;
    const glob = createGlob(config, source, directoryScope, data);
    const parentToBreak = getParentToBreak(parent, operator, source);
    const stack = [...parent.stack];
    const rule: Rule.Break = {
        children: [],
        directoryScope,
        glob,
        parent,
        parentToBreak,
        source,
        stack,
        stringified: getStringified(data, glob),
        type: Rule.BREAK,
    };
    stack.push(rule);
    return rule;
}

//----------------------------------------------------------------------------------------------------------------------
// Find the parent rule to break
//----------------------------------------------------------------------------------------------------------------------

function getParentToBreak(parent: Rule, operator: string, source: Rule.Source.File) {
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

function getApplicableParents(file: string, parent: Rule) {
    const applicableParents = new Array<{ currentRule: Rule; currentIndentation: number }>();

    for (let current: Rule | undefined = parent; current; current = current.parent) {
        if (current.source.type === "file" && pathsAreEqual(current.source.file, file)) {
            applicableParents.push({ currentRule: current, currentIndentation: current.source.indentation });
        }
    }
    return applicableParents;
}

//----------------------------------------------------------------------------------------------------------------------
// Create the stringified representation
//----------------------------------------------------------------------------------------------------------------------

function getStringified(data: string, glob: Rule.Fragment.Glob) {
    return {
        original: `< ${data}`,
        effective: `< ${glob.effective}`,
    };
}
