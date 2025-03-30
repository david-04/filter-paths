import { describe } from "@david-04/typefinity-cli";
import { it } from "../utils/test-runner.js";

const ALL_SIBLINGS_MUST_ALIGN = /All siblings must be aligned/;

describe("indentation errors", () => {
    it("fails when include and exclude rules don't align properly", {
        ruleset: `
             - **/*.log
            - **/*.tmp
        `,
        failsToInitialize: ALL_SIBLINGS_MUST_ALIGN,
    });

    it("fails when import rules don't align properly", {
        ruleset: `
              include other.filter
            - **/*.log

            [other.filter]
            - **
        `,
        failsToInitialize: ALL_SIBLINGS_MUST_ALIGN,
    });
});
