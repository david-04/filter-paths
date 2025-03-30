import { describe } from "@david-04/typefinity-cli";
import { it } from "../utils/test-runner.js";

describe("directory scope rules", () => {
    describe("without secondary action (include or exclude)", () => {
        it("can have anchored children", {
            ruleset: `
                @ **/dir
                  - /*.log
            `,
            paths: `
                ⛔ root/dir/test.log
                ✅ root/dir/subdir/test.log
            `,
        });

        it("can have globstar children", {
            ruleset: `
                @ **/dir
                  - **/*.log
            `,
            paths: `
                ⛔ root/dir/test.log
                ⛔  root/dir/subdir/test.log
            `,
        });

        it("inherits the directory prefix to all children", {
            ruleset: `
                @ **/dir
                  - **/*.log
                    + /*access*
            `,
            paths: `
                ⛔ root/dir/test.log
                ⛔ root/dir/subdir/test.log
                ✅ root/dir/access.log
                ⛔ root/dir/subdir/access.log

                ✅ other/test.log
            `,
        });

        it("can be nested", {
            ruleset: `
                @ **/parent
                  @ **/child
                    + **
            `,
            paths: `
                ✅ parent/child/file.txt
                ✅ parent/child/subdirectory/file.txt
                ⛔ child/parent/file.txt
            `,
        });
    });

    describe("with secondary action (include or exclude)", () => {
        it("can have anchored children", {
            ruleset: `
                @ + **/dir
                  - /*.log
            `,
            paths: `
                ✅ root/dir/file.txt
                ⛔ root/dir/test.log
                ✅ root/dir/subdir/test.log
            `,
        });

        it("can have globstar children", {
            ruleset: `
                @ - **/dir
                  + **/*.txt
            `,
            paths: `
                ✅ root/dir/test.txt
                ✅ root/dir/subdir/test.txt
                ⛔ root/dir/readme.md
            `,
        });

        it("inherits the directory prefix to all children", {
            ruleset: `
                @ + **/dir
                  - **/*.log
                    + /*access*
            `,
            paths: `
                ⛔ root/dir/test.log
                ⛔ root/dir/subdir/test.log
                ✅ root/dir/access.log
                ⛔ root/dir/subdir/access.log
                ✅ root/dir/readme.md

                ⛔ other/test.log
            `,
        });

        it("can be nested", {
            ruleset: `
                @ + **/parent
                  @ - **/child
                    + **/*.txt
            `,
            paths: `
                ✅ parent/file.txt
                ⛔ parent/child/temp.log
                ✅ parent/child/file.txt
                ✅ parent/child/subdirectory/file.txt
            `,
        });
    });
});
