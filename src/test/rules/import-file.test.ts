import { describe } from "@david-04/typefinity-cli";
import { it } from "../../utils/test-runner.js";

describe("import file rules", () => {
    it("can include files on top-level", {
        ruleset: `
            + **/*.md
            include other.filter

            [other.filter]
            + **/*.txt
        `,
        paths: `
            ✅ file.md
            ✅ file.txt
        `,
    });

    it("can include files as nested children", {
        ruleset: `
            - **/*.log
              include other.filter

            [other.filter]
            + **/*access*
        `,
        paths: `
            ⛔ file.log
            ✅ access.log
        `,
    });

    it("support import as an alias for include", {
        ruleset: `
            - **/*.log
              import other.filter

            [other.filter]
            + **/*access*
        `,
        paths: `
            ⛔ file.log
            ✅ access.log
        `,
    });

    it("supports includes from within included files", {
        ruleset: `
            - **/*.log
              import first.filter

            [first.filter]
            + **/*important*
              include second.filter

            [second.filter]
            - **/*un*
        `,
        paths: `
            ⛔ file.log
            ✅ important.log
            ⛔ unimportant.log
        `,
    });

    describe("nesting errors", () => {
        const INVALID_NESTING = /invalid nesting/i;
        const INCONSISTENT_INDENTATION = /inconsistent indentation/i;
        const NESTED_CHILDREN = /An "include" rule can't have nested children/;

        it("fails when nesting an include or exclude glob rule under an import", {
            ruleset: `
                include other.filter
                  + **/*important*

                [other.filter]
                - **/*.log
            `,
            failsToInitialize: INVALID_NESTING,
        });

        it("fails when nesting an import rule under an import rule", {
            ruleset: `
                include first.filter
                  include second.filter

                [first.filter]
                - **/*.log

                [second.filter]
                + **/*important*
            `,
            failsToInitialize: INCONSISTENT_INDENTATION,
        });

        it("fails when nesting a goto rule under an import rule", {
            ruleset: `
                + **
                  include other.filter
                |   < **

                [other.filter]
                - **/*.log
            `,
            failsToInitialize: NESTED_CHILDREN,
        });

        it("fails when nesting a directory scope rule under an import rule", {
            ruleset: `
                + **
                  include other.filter
                     @ **

                [other.filter]
                - **/*.log
            `,
            failsToInitialize: NESTED_CHILDREN,
        });
    });

    describe("file reference errors", () => {
        const CYCLIC_IMPORT = /cyclic import/i;
        const FILE_DOES_NOT_EXIST = /file.*does not exist/i;

        it("fails when the imported file does not exist", {
            ruleset: `
                + **/work/**
                  include does-not-exist.filter
                + **/*.txt
            `,
            failsToInitialize: FILE_DOES_NOT_EXIST,
        });

        it("fails when a file imports itself", {
            ruleset: `
                [default.filter]
                + **/work/**
                  - **/tmp/**
                    include default.filter
                + **/*.txt
            `,
            failsToInitialize: CYCLIC_IMPORT,
        });

        it("fails when multiple files form a cyclic dependency", {
            ruleset: `
                [default.filter]
                + **/work/**
                  include default.filter
                + **/*.txt

                [include.filter]
                - **/tmp/**
                  include default.filter
            `,
            failsToInitialize: CYCLIC_IMPORT,
        });
    });
});
