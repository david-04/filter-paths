import { Rules } from "../../types/rules.js";
import { fail } from "../../utils/fail.js";
import { isArgv, isFile } from "../helpers/rule-type-utils.js";
import { stringifyStack } from "../helpers/stringify-stack.js";

//----------------------------------------------------------------------------------------------------------------------
// Assert that all siblings are on the same indentation level
//----------------------------------------------------------------------------------------------------------------------

export function assertConsistentSiblingIndentation(rules: Rules) {
    const [first] = rules;
    if (first && isFile(first.source)) {
        const expectedIndentation = first.source.indentation;
        if (!rules.every(({ source }) => isArgv(source) || source.indentation === expectedIndentation)) {
            const message = [
                `Inconsistent indentation in ${first.source.file.resolved}:`,
                "",
                stringifyStack.asOriginalWithLineNumbers(rules),
                "",
                "All siblings must be aligned on the same column",
            ];
            fail(message.join("\n"));
        }
    }
    rules.forEach(rule => assertConsistentSiblingIndentation(rule.children));
}
