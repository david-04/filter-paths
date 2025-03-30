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

    describe("inconsistencies", () => {
        const MISMATCH_ERROR = /Expected an (include|exclude) rule .* but found an (include|exclude) rule/;

        describe("mixing of include and exclude", () => {
            describe("on the same physical level", () => {
                describe("in the same file", () => {
                    it("fails when mixing directly", {
                        ruleset: `
                            - **/*.log
                            + **/*important*
                        `,
                        failsToInitialize: MISMATCH_ERROR,
                    });

                    it("fails when mixing via a directory scope", {
                        ruleset: `
                            - **/*.log
                            @ + **/*important*
                        `,
                        failsToInitialize: MISMATCH_ERROR,
                    });
                });

                describe("via an import", () => {
                    it("fails when mixing directly", {
                        ruleset: `
                            - **/*.log
                            import other.filter

                            [other.filter]
                            + **/*important*
                        `,
                        failsToInitialize: MISMATCH_ERROR,
                    });

                    it("fails when mixing via a directory scope", {
                        ruleset: `
                            - **/*.log
                            import other.filter

                            [other.filter]
                            @ + **/*important*
                        `,
                        failsToInitialize: MISMATCH_ERROR,
                    });
                });
            });

            describe("on the same logical level", () => {
                it("fails when mixing directly", {
                    ruleset: `
                        @ **/logs
                          + **/*important*
                        - **/*.tmp
                    `,
                    failsToInitialize: MISMATCH_ERROR,
                });

                it("fails when mixing via an import", {
                    ruleset: `
                        @ **/logs
                          include other.filter
                        - **/*.tmp

                        [other.filter]
                        + **/*important*
                    `,
                    failsToInitialize: MISMATCH_ERROR,
                });
            });
        });

        describe("nesting the same rule type", () => {
            describe("directly via include or exclude rule", () => {
                it("fails when nesting in the same file", {
                    ruleset: `
                        - **/*.log
                          - **/*.log.*
                        - **/*.tmp
                    `,
                    failsToInitialize: MISMATCH_ERROR,
                });

                it("fails when nesting via an import", {
                    ruleset: `
                        - **/*.log
                          include other.filter
                        - **/*.tmp

                        [other.filter]
                        - **/*.log.*
                    `,
                    failsToInitialize: MISMATCH_ERROR,
                });
            });

            describe("directly via including/excluding directory scope rule", () => {
                it("fails when nesting in the same file", {
                    ruleset: `
                        - **/*.log
                          @- **/dir/**
                        - **/*.tmp
                    `,
                    failsToInitialize: MISMATCH_ERROR,
                });

                it("fails when nesting via an import", {
                    ruleset: `
                        - **/*.log
                          include other.filter
                        - **/*.tmp

                        [other.filter]
                        @ - **/dir/**
                    `,
                    failsToInitialize: MISMATCH_ERROR,
                });
            });

            describe("indirectly via directory scope rule", () => {
                it("fails when nesting in the same file", {
                    ruleset: `
                        - **/*.log
                          @ **/parent/**
                            - **/*.log.*
                        - **/*.tmp
                    `,
                    failsToInitialize: MISMATCH_ERROR,
                });

                it("fails when nesting via an import", {
                    ruleset: `
                        - **/*.log
                          include other.filter
                        - **/*.tmp

                        [other.filter]
                        @ **/parent/**
                          - **/*.log.*
                    `,
                    failsToInitialize: MISMATCH_ERROR,
                });
            });
        });
    });
});
