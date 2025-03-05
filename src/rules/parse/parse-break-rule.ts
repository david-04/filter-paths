import { Parameters } from "../../types/parameters.js";
import { RuleSource } from "../../types/rule-source.js";
import { Rule } from "../../types/rules.js";
import { fail } from "../../utils/fail.js";
import { pathsAreEqual } from "../../utils/path.js";
import { getEffectiveGlob, getGlobMatcher } from "../helpers/create-glob.js";

//----------------------------------------------------------------------------------------------------------------------
// Parse a "break" rule
//----------------------------------------------------------------------------------------------------------------------

export function parseBreakRule(
    parameters: Parameters,
    parent: Rule.Parent,
    source: RuleSource.File,
    operator: string,
    data: string
): Rule.Break {
    const atDirectory = "atDirectory" in parent ? parent.atDirectory : undefined;
    const original = data.trim();
    const effective = getEffectiveGlob(atDirectory?.effective, original);
    return {
        atDirectory,
        children: [],
        parent,
        parentToBreak: getParentToBreak(parent, operator, source),
        source,
        type: Rule.BREAK,
        glob: { original, effective },
        matches: getGlobMatcher(parameters, effective),
    };
}

//----------------------------------------------------------------------------------------------------------------------
// Find the parent rule to break
//----------------------------------------------------------------------------------------------------------------------

function getParentToBreak(parent: Rule.Parent, operator: string, source: RuleSource.File) {
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

function getApplicableParents(file: string, parent: Rule.Parent) {
    const applicableParents = new Array<{ currentRule: Rule; currentIndentation: number }>();

    for (
        let current: Rule.Parent | undefined = parent;
        current;
        current = current.type === Rule.RULESET ? undefined : current.parent
    ) {
        if (
            current.type !== Rule.RULESET &&
            current.source.type === "file" &&
            pathsAreEqual(current.source.file, file)
        ) {
            applicableParents.push({ currentRule: current, currentIndentation: current.source.indentation });
        }
    }
    return applicableParents;
}
