import { describe } from "@david-04/typefinity-cli";
import { it } from "../utils/test-runner.js";

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
