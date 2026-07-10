import { it } from "../utils/test-runner.js";
import { describe } from "@david-04/typefinity-cli";

describe("comments", () => {
    it("ignores comments", {
        ruleset: `
             # - **
            - **/*.log
                # + **/*access*
        `,
        paths: `
            ⛔ file.log
            ⛔ access.log
            ✅ file.txt
        `,
    });
});
