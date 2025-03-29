import { describe } from "@david-04/typefinity-cli";
import { it } from "../../utils/test-runner.js";

const GLOB_MUST_START_WITH_SLASH_OR_GLOBSTAR = /Each glob must either start with "\/" or "\*\*"/;
const GLOBSTARS_MUST_BE_SEPARATED_WITH_SLASHES =
    /Globstars .* must be separated with slashes .* from the rest of the glob/;

describe("picomatch", () => {
    describe("wildcard *", () => {
        it("matches the empty string", {
            ruleset: "+ /file*",
            paths: "✅ file",
        });

        it("matches a single character", {
            ruleset: "+ /file*txt",
            paths: "✅ file.txt",
        });

        it("matches multiple characters", {
            ruleset: "+ /file*txt",
            paths: "✅ file-01.txt",
        });

        it("does not match slashes", {
            ruleset: "+ /dir*",
            paths: "⛔ dir/file",
        });
    });

    describe("wildcard ?", () => {
        it("does not match the empty string", {
            ruleset: "+ /file?",
            paths: "⛔ file",
        });

        it("matches single characters", {
            ruleset: "+ /file?",
            paths: "✅ file1",
        });

        it("matches question marks", {
            ruleset: "+ /file?",
            paths: "✅ file?",
        });

        it("does not match slashes", {
            ruleset: "+ /dir?file.txt",
            paths: "⛔ dir/file.txt",
        });

        it("does not match multiple characters", {
            ruleset: "+ /file?",
            paths: "⛔ file.txt",
        });
    });

    describe("character classes", () => {
        describe("discrete characters", () => {
            it("matches any of the given characters", {
                ruleset: "+ /file-[12]",
                paths: `
                    ✅ file-1
                    ✅ file-2
                `,
            });

            it("does not match any non-given characters", {
                ruleset: "+ /file-[12]",
                paths: "⛔ file-3",
            });

            it("does not the empty string", {
                ruleset: "+ /file-[12]",
                paths: "⛔ file-",
            });

            it("can include slashes", {
                ruleset: "+ /file-[1/].txt",
                paths: `
                    ✅ file-1.txt
                    ✅ file-/.txt
                `,
            });

            it("can include literal questions marks", {
                ruleset: "+ /file-[1?].txt",
                paths: `
                    ✅ file-1.txt
                    ✅ file-?.txt
                    ⛔ file-/.txt
                    ⛔ file-3.txt
                `,
            });

            it("can include literal exclamation marks (that don't negate the expression)", {
                ruleset: "+ /file-[!1].txt",
                paths: `
                    ✅ file-!.txt
                    ✅ file-1.txt
                    ⛔ file-2.txt
                `,
            });
        });

        describe("character ranges", () => {
            it("can include multiple ranges (and discrete characters as well)", {
                ruleset: "+ /file-[a-c1-3xy]",
                paths: `
                    ✅ file-a
                    ✅ file-b
                    ✅ file-c
                    ✅ file-1
                    ✅ file-2
                    ✅ file-3
                    ⛔ file-d
                    ⛔ file-4
                    ✅ file-x
                    ✅ file-y
                    ⛔ file-z
                `,
            });
        });

        describe("case-sensitivity", () => {
            it("can match case-sensitive", {
                config: { caseSensitive: true },
                ruleset: "+ /file-[äöü]",
                paths: `⛔ file-Ä`,
            });

            it("can match case-insensitive", {
                config: { caseSensitive: false },
                ruleset: "+ /file-[äöü]",
                paths: `✅ file-Ä`,
            });
        });
    });

    describe("globstar (**)", () => {
        describe("matching behavior", () => {
            it("matches the empty string", {
                ruleset: "+ **/file.txt",
                paths: "✅ file.txt",
            });

            it("matches any string (including slashes)", {
                ruleset: "+ **/file.txt",
                paths: "✅ root/parent/child/file.txt",
            });

            it("matches everything", {
                ruleset: "+ **",
                paths: "✅ root/parent/child/file.txt",
            });

            describe("when chained", () => {
                it("matches the empty string", {
                    ruleset: "+ **/**/file.txt",
                    paths: "✅ file.txt",
                });

                it("matches a single directory", {
                    ruleset: "+ **/**/file.txt",
                    paths: "✅ directory/file.txt",
                });

                it("matches multiple directories", {
                    ruleset: "+ **/**/file.txt",
                    paths: "✅ root/parent/child/file.txt",
                });

                it("matches everything", {
                    ruleset: "+ **/**",
                    paths: "✅ root/parent/child/file.txt",
                });
            });
        });

        describe("positioning", () => {
            it("can be anchored at the beginning", {
                ruleset: "+ **/file.txt",
                paths: "✅ root/parent/child/file.txt",
            });

            it("can be anchored at the end", {
                ruleset: "+ /root/**",
                paths: "✅ root/parent/child/file.txt",
            });

            it("can occur in the middle", {
                ruleset: "+ /root/**/file.txt",
                paths: "✅ root/parent/child/file.txt",
            });

            it("can't follow anything other than a path separator", {
                ruleset: "+ /root**/file.txt",
                failsToInitialize: GLOBSTARS_MUST_BE_SEPARATED_WITH_SLASHES,
            });

            it("can't be followed by anything other than a path separator", {
                ruleset: "+ /root/**file.txt",
                failsToInitialize: GLOBSTARS_MUST_BE_SEPARATED_WITH_SLASHES,
            });
        });
    });

    describe("start of glob", () => {
        it("globs can start with a slash", {
            ruleset: `+ /*.ts`,
            paths: "✅ /file.ts",
        });

        it("globs can start with a globstar", {
            ruleset: `+ **/*.ts`,
            paths: "✅ parent/child/file.ts",
        });

        it("globs can't start with a wildcard (*)", {
            ruleset: `+ *.ts`,
            failsToInitialize: GLOB_MUST_START_WITH_SLASH_OR_GLOBSTAR,
        });

        it("globs can't start with a string literal", {
            ruleset: ` + file.*.ts`,
            failsToInitialize: GLOB_MUST_START_WITH_SLASH_OR_GLOBSTAR,
        });

        it("globs can't start with an exclamation mark", {
            ruleset: ` + ?file.*.ts`,
            failsToInitialize: GLOB_MUST_START_WITH_SLASH_OR_GLOBSTAR,
        });
    });

    describe("braces", () => {
        it("matches any of the given values", {
            ruleset: "+ /test.{txt,tmp.txt}",
            paths: `
                ✅ test.txt
                ✅ test.tmp.txt
            `,
        });

        it("can include the empty string", {
            ruleset: "+ /test{,.txt}",
            paths: `
                ✅ test
                ✅ test.txt
            `,
        });

        it("can include wildcards", {
            ruleset: "+ /test.{*js,ts?}",
            paths: `
                ✅ test.js
                ✅ test.cjs
                ✅ test.tmp.js
                ⛔ test.ts
                ✅ test.tsx
                ⛔ test.ts.tmp
            `,
        });

        it("can be nested", {
            ruleset: "+ /test{{.,-}1,2}",
            paths: `
                ✅ test.1
                ✅ test-1
                ✅ test2
            `,
        });
    });

    describe("case sensitivity", () => {
        it("can match case-sensitive", {
            config: { caseSensitive: true },
            ruleset: "+ /readme.*",
            paths: "⛔ README.md",
        });

        it("can match non-case-sensitive", {
            config: { caseSensitive: false },
            ruleset: "+ /readme.*",
            paths: "✅ README.md",
        });
    });
});
