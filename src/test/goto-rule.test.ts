import { describe } from "@david-04/typefinity-cli";
import { it } from "../utils/test-runner.js";

describe("goto rules", () => {
    it("continues at the indicated level", {
        ruleset: `
            - **/*file*
              + **/*txt*
                - **/*tmp*
            |   < **/*important*
                - **/*.txt
              + **/*unimportant*
            - **/*no-backup*
        `,
        paths: `
            ⛔ file.tmp
            ⛔ file.txt.tmp
            ✅ file.unimportant.txt
            ⛔ file.unimportant.no-backup.txt
        `,
    });

    it("fails when the target level indicator does not align properly", {
        ruleset: `
            - **/*file*
              + **/*txt*
                - **/*tmp*
             |  < **/*important*
            - **/*no-backup*
        `,
        failsToInitialize: /The left-hand side "goto" indicator must align precisely/,
    });
});
