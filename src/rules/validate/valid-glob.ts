import { RuleSource } from "../../types/rule-source.js";
import { fail } from "../../utils/fail.js";

//----------------------------------------------------------------------------------------------------------------------
// Verify that the glob is not empty and starts with "/" or "**"
//----------------------------------------------------------------------------------------------------------------------

export function assertGlobIsValid(source: RuleSource.File, glob: string) {
    if (!glob) {
        fail(source, "Missing glob pattern");
    }
    if (!glob.startsWith("/") && !glob.startsWith("**")) {
        fail(source, 'Each glob must either start with "/" or "**"');
    }
}
