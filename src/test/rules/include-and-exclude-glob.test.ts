import { describe } from "@david-04/typefinity-cli";
import { it } from "../../utils/test-runner.js";

describe("include and exclude glob rules", () => {
    describe("include ruleset", () => {
        it("includes all paths that match any glob", {
            ruleset: `
                + **/*.md
                + **/*.txt
            `,
            paths: `
                ✅ file.md
                ✅ file.txt
            `,
        });

        it("excludes all paths that don't match any glob", {
            ruleset: `
                + **/*.md
                + **/*.txt
            `,
            paths: "⛔ file.log",
        });
    });

    describe("exclude ruleset", () => {
        it("excludes all paths that match any glob", {
            ruleset: `
                - **/*.md
                - **/*.txt
            `,
            paths: `
                ⛔ file.md
                ⛔ file.txt
            `,
        });

        it("includes all paths that don't match any glob", {
            ruleset: `
                - **/*.md
                - **/*.txt
            `,
            paths: "✅ file.log",
        });
    });

    describe("mixed/nested rulesets", () => {
        it("matching child globs override matching parent globs", {
            ruleset: `
                - **/*.log
                  + **/*important*
            `,
            paths: "✅ important-file.log",
        });

        it("matching parent globs apply when no child glob matches", {
            ruleset: `
                - **/*.log
                  + **/*important*
            `,
            paths: "⛔ test.log",
        });

        it("child globs don't apply when the parent glob does not match", {
            ruleset: `
                + **/*.txt
                  - **/*tmp*
                + **/*.log

            `,
            paths: "✅ file.tmp.log",
        });

        it("parent and child globs are independent of one another (they are not concatenated)", {
            ruleset: `
                - **/personal/**
                  + /documents/**
            `,
            paths: `
                ✅ /documents/personal/file.txt
                ⛔ /personal/documents/file.txt
            `,
        });

        it("rules can be nested multiple levels deep", {
            ruleset: `
                - **/*.log
                  + **/*important*
                    - **/*tmp*
            `,
            paths: `
                ⛔ test.log
                ✅ important.log
                ⛔ important.tmp.log
            `,
        });
    });
});
