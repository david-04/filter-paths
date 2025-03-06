import { Config } from "../../types/config.js";
import { RuleSource } from "../../types/rule-source.js";
import { Rule } from "../../types/rules.js";
import { fail } from "../../utils/fail.js";
import { pathsAreEqual } from "../../utils/path.js";
import { getEffectiveGlob, getGlobMatcher } from "../helpers/create-glob.js";

//----------------------------------------------------------------------------------------------------------------------
// Parse a "break" rule
//----------------------------------------------------------------------------------------------------------------------

export function parseBreakRule(
    config: Config,
    parent: Rule,
    source: RuleSource.File,
    operator: string,
    data: string
): Rule.Break {
    const directoryScope = "directoryScope" in parent ? parent.directoryScope : undefined;
    const original = data.trim();
    const effective = getEffectiveGlob(directoryScope?.effective, original);
    const matches = getGlobMatcher(config, effective);
    return {
        directoryScope,
        children: [],
        parent,
        parentToBreak: getParentToBreak(parent, operator, source),
        source,
        type: Rule.BREAK,
        glob: { original, effective, matches },
    };
}

//----------------------------------------------------------------------------------------------------------------------
// Find the parent rule to break
//----------------------------------------------------------------------------------------------------------------------

function getParentToBreak(parent: Rule, operator: string, source: RuleSource.File) {
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
