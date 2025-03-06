import { Rule } from "../../types/rules.js";
import { fail } from "../../utils/fail.js";

//----------------------------------------------------------------------------------------------------------------------
// Verify that the glob is not empty and starts with "/" or "**"
//----------------------------------------------------------------------------------------------------------------------

export function assertGlobIsValid(source: Rule.Source.File, glob: string) {
    if (!glob) {
        fail(source, "Missing glob pattern");
    }
    if (!glob.startsWith("/") && !glob.startsWith("**")) {
        fail(source, 'Each glob must either start with "/" or "**"');
    }
}
