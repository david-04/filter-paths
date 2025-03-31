export const MANUAL = [
    "--------------------------------------------------------------------------------", // NOSONAR
    "filter-paths                                                                    ", // NOSONAR
    "--------------------------------------------------------------------------------", // NOSONAR
    "                                                                                ", // NOSONAR
    "A command-line filter to include/exclude paths based on glob rules. It aims to  ", // NOSONAR
    "provide a comparably simple syntax to define rules with nested exceptions. A    ", // NOSONAR
    "simple filter might look like this:                                             ", // NOSONAR
    "                                                                                ", // NOSONAR
    "- **/*.log                                                                      ", // NOSONAR
    "  + **/*important*                                                              ", // NOSONAR
    "    - **/*unimportant*                                                          ", // NOSONAR
    "- /node_modules/**                                                              ", // NOSONAR
    "                                                                                ", // NOSONAR
    "It excludes (filters out) all log files except those containing the term        ", // NOSONAR
    "important in the file name. However, files with the term unimportant will still ", // NOSONAR
    "be excluded (even though they also contain the term important).                 ", // NOSONAR
    "                                                                                ", // NOSONAR
    "The primary use case for filter-paths is to select (or filter out) files based  ", // NOSONAR
    "on glob rules and then pass on the result to an application that archives the   ", // NOSONAR
    "selected files (e.g. tar, zip, or 7z) or synchronizes them to a destination     ", // NOSONAR
    "directory (e.g. via rsync or rclone).                                           ", // NOSONAR
    "                                                                                ", // NOSONAR
    "--------------------------------------------------------------------------------", // NOSONAR
    "Installation and usage                                                          ", // NOSONAR
    "--------------------------------------------------------------------------------", // NOSONAR
    "                                                                                ", // NOSONAR
    "Install the application:                                                        ", // NOSONAR
    "                                                                                ", // NOSONAR
    "npm install --global filter-paths                                               ", // NOSONAR
    "                                                                                ", // NOSONAR
    "Create a filter file (e.g. my.filter) with globs to include or exclude (see     ", // NOSONAR
    "syntax description below):                                                      ", // NOSONAR
    "                                                                                ", // NOSONAR
    "- **/*.log                                                                      ", // NOSONAR
    "  + **/*access*                                                                 ", // NOSONAR
    "- /node_modules/**                                                              ", // NOSONAR
    "                                                                                ", // NOSONAR
    "Use a command like find to list all files and pipe the result through           ", // NOSONAR
    "filter-paths:                                                                   ", // NOSONAR
    "                                                                                ", // NOSONAR
    "find . -type f | filter-paths my.filter                                         ", // NOSONAR
    "                                                                                ", // NOSONAR
    "This will print the paths of all files that are included (or not excluded) by   ", // NOSONAR
    "the filter rules.                                                               ", // NOSONAR
    "                                                                                ", // NOSONAR
    "--------------------------------------------------------------------------------", // NOSONAR
    "Testing                                                                         ", // NOSONAR
    "--------------------------------------------------------------------------------", // NOSONAR
    "                                                                                ", // NOSONAR
    "--------------------------------------------------------------------------------", // NOSONAR
    "Testing globs                                                                   ", // NOSONAR
    "--------------------------------------------------------------------------------", // NOSONAR
    "                                                                                ", // NOSONAR
    "To interactively test which globs match which path, run filter-paths in debug   ", // NOSONAR
    "mode:                                                                           ", // NOSONAR
    "                                                                                ", // NOSONAR
    "$ filter-paths --debug                                                          ", // NOSONAR
    "                                                                                ", // NOSONAR
    "Glob:   **/*.txt                                                                ", // NOSONAR
    "Path:   test.txt                                                                ", // NOSONAR
    "Result: 🟩 matches                                                              ", // NOSONAR
    "                                                                                ", // NOSONAR
    "It repeatedly prompts for a glob and a path and then indicates if the path      ", // NOSONAR
    "matches the glob. Leave any of the input fields empty to re-apply the previous  ", // NOSONAR
    "input.                                                                          ", // NOSONAR
    "                                                                                ", // NOSONAR
    "--------------------------------------------------------------------------------", // NOSONAR
    "Printing the filter rules                                                       ", // NOSONAR
    "--------------------------------------------------------------------------------", // NOSONAR
    "                                                                                ", // NOSONAR
    "To verify that the file with filter rules has been parsed correctly, pass the   ", // NOSONAR
    "option --print-rules to the application:                                        ", // NOSONAR
    "                                                                                ", // NOSONAR
    "$ filter-paths --print-rules my.filter                                          ", // NOSONAR
    "                                                                                ", // NOSONAR
    "- **/*.log                                                                      ", // NOSONAR
    "  + **/*important*                                                              ", // NOSONAR
    "    - **/*unimportant*                                                          ", // NOSONAR
    "- /node_modules/**                                                              ", // NOSONAR
    "                                                                                ", // NOSONAR
    "This will print the rules that will effectively be applied.                     ", // NOSONAR
    "                                                                                ", // NOSONAR
    "--------------------------------------------------------------------------------", // NOSONAR
    "Testing filter rules                                                            ", // NOSONAR
    "--------------------------------------------------------------------------------", // NOSONAR
    "                                                                                ", // NOSONAR
    "To interactively test which rules are applied to a specific path, run the       ", // NOSONAR
    "application in debug mode:                                                      ", // NOSONAR
    "                                                                                ", // NOSONAR
    "$ filter-paths --debug my.filter                                                ", // NOSONAR
    "                                                                                ", // NOSONAR
    "Path to evaluate: temp/important.log                                            ", // NOSONAR
    "                                                                                ", // NOSONAR
    "- **/*.log                                                                      ", // NOSONAR
    "  + **/*important*                                                              ", // NOSONAR
    "    - **/*unimportant*                                                          ", // NOSONAR
    "                                                                                ", // NOSONAR
    "Result: The path is included                                                    ", // NOSONAR
    "                                                                                ", // NOSONAR
    "It repeatedly prompts for a path to pass through the filter rules. For every    ", // NOSONAR
    "path, it prints all the filter rules that were evaluated. Include or exclude    ", // NOSONAR
    "rules that matched are printed in green or red. Globs that were evaluated but   ", // NOSONAR
    "did not match are grayed out. The last output line indicates whether the path   ", // NOSONAR
    "would be selected or filtered out.                                              ", // NOSONAR
    "                                                                                ", // NOSONAR
    "--------------------------------------------------------------------------------", // NOSONAR
    "Glob syntax                                                                     ", // NOSONAR
    "--------------------------------------------------------------------------------", // NOSONAR
    "                                                                                ", // NOSONAR
    "filter-paths uses picomatch [https://www.npmjs.com/package/picomatch] to match  ", // NOSONAR
    "paths.                                                                          ", // NOSONAR
    "                                                                                ", // NOSONAR
    "--------------------------------------------------------------------------------", // NOSONAR
    "Wildcards and globstars                                                         ", // NOSONAR
    "--------------------------------------------------------------------------------", // NOSONAR
    "                                                                                ", // NOSONAR
    "The ? wildcard represents a single character, including dots (.) and question   ", // NOSONAR
    "marks (?), but excluding slashes (/):                                           ", // NOSONAR
    "                                                                                ", // NOSONAR
    "Glob:           /test?file                                                      ", // NOSONAR
    "                                                                                ", // NOSONAR
    "Matches:        🟩 test-file                                                    ", // NOSONAR
    "                🟩 test.file                                                    ", // NOSONAR
    "                🟩 test?file                                                    ", // NOSONAR
    "                                                                                ", // NOSONAR
    "Does not match: 🟥 test/file                                                    ", // NOSONAR
    "                🟥 testfile                                                     ", // NOSONAR
    "                🟥 test--file                                                   ", // NOSONAR
    "                                                                                ", // NOSONAR
    "The * wildcard represents zero, one, or more characters, including dots (.), but", // NOSONAR
    "excluding slashes (/):                                                          ", // NOSONAR
    "                                                                                ", // NOSONAR
    "Glob:           /test*file                                                      ", // NOSONAR
    "                                                                                ", // NOSONAR
    "Matches:        🟩 testfile                                                     ", // NOSONAR
    "                🟩 test.file                                                    ", // NOSONAR
    "                🟩 test?file                                                    ", // NOSONAR
    "                🟩 test-123.file                                                ", // NOSONAR
    "                                                                                ", // NOSONAR
    "Does not match: 🟥 test/file                                                    ", // NOSONAR
    "                                                                                ", // NOSONAR
    "Globstars (**) represent zero, one or more subdirectories:                      ", // NOSONAR
    "                                                                                ", // NOSONAR
    "Glob:           /test/**/file                                                   ", // NOSONAR
    "                                                                                ", // NOSONAR
    "Matches:        🟩 test/file                                                    ", // NOSONAR
    "                🟩 test/backup/file                                             ", // NOSONAR
    "                                                                                ", // NOSONAR
    "Does not match: 🟥 testfile                                                     ", // NOSONAR
    "                🟥 test.file                                                    ", // NOSONAR
    "                🟥 test?file                                                    ", // NOSONAR
    "                🟥 test-123.file                                                ", // NOSONAR
    "                                                                                ", // NOSONAR
    "Globstars should always be delimited by slashes and/or the beginning/end of a   ", // NOSONAR
    "glob expression. When used in a non-delimited context, they behave like *       ", // NOSONAR
    "wildcards:                                                                      ", // NOSONAR
    "                                                                                ", // NOSONAR
    "Glob:           /test**file                                                     ", // NOSONAR
    "                                                                                ", // NOSONAR
    "Matches:        🟩 testfile                                                     ", // NOSONAR
    "                🟩 test.file                                                    ", // NOSONAR
    "                                                                                ", // NOSONAR
    "Does not match: 🟥 test/file                                                    ", // NOSONAR
    "                🟥 test/backup/file                                             ", // NOSONAR
    "                                                                                ", // NOSONAR
    "--------------------------------------------------------------------------------", // NOSONAR
    "Bracket expressions                                                             ", // NOSONAR
    "--------------------------------------------------------------------------------", // NOSONAR
    "                                                                                ", // NOSONAR
    "Bracket expressions work the same way as in regular expressions. They can       ", // NOSONAR
    "contain discrete characters and character ranges (like a-z or 0-9):             ", // NOSONAR
    "                                                                                ", // NOSONAR
    "Glob:           /test.log.[1-5ab]                                               ", // NOSONAR
    "                                                                                ", // NOSONAR
    "Matches:        🟩 test.log.1                                                   ", // NOSONAR
    "                🟩 test.log.2                                                   ", // NOSONAR
    "                   ...                                                          ", // NOSONAR
    "                🟩 test.log.5                                                   ", // NOSONAR
    "                🟩 test.log.a                                                   ", // NOSONAR
    "                🟩 test.log.b                                                   ", // NOSONAR
    "                                                                                ", // NOSONAR
    "Does not match: 🟥 test.log.                                                    ", // NOSONAR
    "                🟥 test.log.6                                                   ", // NOSONAR
    "                🟥 test.log.c                                                   ", // NOSONAR
    "                                                                                ", // NOSONAR
    "The meaning can be negated by prepending the circumflex (^):                    ", // NOSONAR
    "                                                                                ", // NOSONAR
    "Glob:           /test.log.[^1-5ab]                                              ", // NOSONAR
    "                                                                                ", // NOSONAR
    "Matches:        🟩 test.log.6                                                   ", // NOSONAR
    "                🟩 test.log.c                                                   ", // NOSONAR
    "                                                                                ", // NOSONAR
    "Does not match: 🟥 test.log.                                                    ", // NOSONAR
    "                🟥 test.log.1                                                   ", // NOSONAR
    "                🟥 test.log.2                                                   ", // NOSONAR
    "                   ...                                                          ", // NOSONAR
    "                🟥 test.log.5                                                   ", // NOSONAR
    "                🟥 test.log.a                                                   ", // NOSONAR
    "                🟥 test.log.b                                                   ", // NOSONAR
    "                                                                                ", // NOSONAR
    "POSIX classes (e.g. [:alnum:] as an alias for [a-zA-Z0-9]) are supported as     ", // NOSONAR
    "well.                                                                           ", // NOSONAR
    "                                                                                ", // NOSONAR
    "--------------------------------------------------------------------------------", // NOSONAR
    "Curly braces                                                                    ", // NOSONAR
    "--------------------------------------------------------------------------------", // NOSONAR
    "                                                                                ", // NOSONAR
    "Curly braces ({ and }) can be used to allow one of multiple values that are     ", // NOSONAR
    "separated by commas (,):                                                        ", // NOSONAR
    "                                                                                ", // NOSONAR
    "Glob:           /test.{txt,md}                                                  ", // NOSONAR
    "                                                                                ", // NOSONAR
    "Matches:        🟩 test.txt                                                     ", // NOSONAR
    "                🟩 test.md                                                      ", // NOSONAR
    "                                                                                ", // NOSONAR
    "Does not match: 🟥 test.tmp                                                     ", // NOSONAR
    "                                                                                ", // NOSONAR
    "Curly braces can contain empty strings, be nested, and include wildcards (? and ", // NOSONAR
    "*), globstars (**), and bracket expressions ([a-z]):                            ", // NOSONAR
    "                                                                                ", // NOSONAR
    "Glob:           /file{,.{?js,ts*}}                                              ", // NOSONAR
    "                                                                                ", // NOSONAR
    "Matches:        🟩 file                                                         ", // NOSONAR
    "                🟩 file.cjs                                                     ", // NOSONAR
    "                🟩 file.mjs                                                     ", // NOSONAR
    "                🟩 file.ts                                                      ", // NOSONAR
    "                🟩 file.tsx                                                     ", // NOSONAR
    "                🟩 file.ts.tmp                                                  ", // NOSONAR
    "                                                                                ", // NOSONAR
    "Does not match: 🟥 file.                                                        ", // NOSONAR
    "                🟥 file.js                                                      ", // NOSONAR
    "                                                                                ", // NOSONAR
    "--------------------------------------------------------------------------------", // NOSONAR
    "Constraints                                                                     ", // NOSONAR
    "--------------------------------------------------------------------------------", // NOSONAR
    "                                                                                ", // NOSONAR
    "The following constraints apply:                                                ", // NOSONAR
    "                                                                                ", // NOSONAR
    " * Only forward-slashes (/) can be used as the path separator in globs (even on ", // NOSONAR
    "   Windows). The paths to be filtered can still contain backslashes (\\). They   ", // NOSONAR
    "   are automatically normalized before applying the globs.                      ", // NOSONAR
    " * Globs must either start with a slash (/) or with a globstar (**/). This is   ", // NOSONAR
    "   enforced for readability purposes only. It makes it clearer if a glob can    ", // NOSONAR
    "   match only on root-level or anywhere in nested subdirectories.               ", // NOSONAR
    " * Globs match \"hidden\" files and directories whose name starts with a dot (.). ", // NOSONAR
    " * Globs are case-insensitive by default. This can be changed via the           ", // NOSONAR
    "   command-line option --case-sensitive.                                        ", // NOSONAR
    " * Globs can't be negated by prepending an exclamation mark (!). Use include or ", // NOSONAR
    "   exclude rules (+ or -) instead.                                              ", // NOSONAR
    "                                                                                ", // NOSONAR
    "--------------------------------------------------------------------------------", // NOSONAR
    "Rules                                                                           ", // NOSONAR
    "--------------------------------------------------------------------------------", // NOSONAR
    "                                                                                ", // NOSONAR
    "--------------------------------------------------------------------------------", // NOSONAR
    "Include and exclude rules                                                       ", // NOSONAR
    "--------------------------------------------------------------------------------", // NOSONAR
    "                                                                                ", // NOSONAR
    "The basic building blocks are include and exclude rules. A rule set can be built", // NOSONAR
    "to exclude certain files:                                                       ", // NOSONAR
    "                                                                                ", // NOSONAR
    "- **/*.log                                                                      ", // NOSONAR
    "- **/node_modules/**                                                            ", // NOSONAR
    "                                                                                ", // NOSONAR
    "All files that don't match any of the globs will be included by default.        ", // NOSONAR
    "                                                                                ", // NOSONAR
    "Alternatively, the rules can specify which files to include:                    ", // NOSONAR
    "                                                                                ", // NOSONAR
    "+ **/*.ts                                                                       ", // NOSONAR
    "+ /*.json                                                                       ", // NOSONAR
    "                                                                                ", // NOSONAR
    "All paths that don't match any of the globs will be excluded by default.        ", // NOSONAR
    "                                                                                ", // NOSONAR
    "It is not possible to mix include and exclude rules:                            ", // NOSONAR
    "                                                                                ", // NOSONAR
    "+ **/*.ts                                                                       ", // NOSONAR
    "- **/node_modules/**                                                            ", // NOSONAR
    "                                                                                ", // NOSONAR
    "=> ERROR: Can't mix include (+) and exclude (-)                                 ", // NOSONAR
    "                                                                                ", // NOSONAR
    "This is to avoid ambiguity, as include and exclude globs might both match the   ", // NOSONAR
    "same paths.                                                                     ", // NOSONAR
    "                                                                                ", // NOSONAR
    "Instead of mixing include and exclude rules on the same level, exemptions can be", // NOSONAR
    "defined as nested rules in an alternating manner:                               ", // NOSONAR
    "                                                                                ", // NOSONAR
    "- **/*.log                                                                      ", // NOSONAR
    "  + **/*access*                                                                 ", // NOSONAR
    "    - **/tmp/**                                                                 ", // NOSONAR
    "                                                                                ", // NOSONAR
    "This rule excludes all .log files. However, it will still include all access    ", // NOSONAR
    "logs - but not if they happen to also be in a tmp directory.                    ", // NOSONAR
    "                                                                                ", // NOSONAR
    "When nesting rules, each glob must always match the full path. Nested globs are ", // NOSONAR
    "not concatenated:                                                               ", // NOSONAR
    "                                                                                ", // NOSONAR
    "Filter rules:   - **/tmp/**                                                     ", // NOSONAR
    "                  + /*important*                                                ", // NOSONAR
    "                                                                                ", // NOSONAR
    "Excluded paths: 🟥 tmp/important.file                                           ", // NOSONAR
    "                                                                                ", // NOSONAR
    "The inner glob (/*important*) never matches because it contradicts the outer    ", // NOSONAR
    "glob (**/tmp/**):                                                               ", // NOSONAR
    "                                                                                ", // NOSONAR
    " * The outer glob requires files to be inside a tmp directory.                  ", // NOSONAR
    " * The inner glob requires the file to be in the root directory.                ", // NOSONAR
    "                                                                                ", // NOSONAR
    "Globs are not concatenated. Child globs must always match the whole path - and  ", // NOSONAR
    "not just the segments that haven't been matched by the parent glob already.     ", // NOSONAR
    "Similarly, globs themselves can't match only part of a path:                    ", // NOSONAR
    "                                                                                ", // NOSONAR
    "Glob:           **/tmp                                                          ", // NOSONAR
    "                                                                                ", // NOSONAR
    "Matches:        🟩 tmp                                                          ", // NOSONAR
    "                🟩 directory/tmp                                                ", // NOSONAR
    "                                                                                ", // NOSONAR
    "Does not match: 🟥 tmp/file                                                     ", // NOSONAR
    "                                                                                ", // NOSONAR
    "When multiple globs match, the first innermost glob takes precedence:           ", // NOSONAR
    "                                                                                ", // NOSONAR
    "Filter rules: 1: - **/*.log                                                     ", // NOSONAR
    "              2:   + **/*important*                                             ", // NOSONAR
    "              3:     - **/*unimportant*                                         ", // NOSONAR
    "              4:   + **/*access*                                                ", // NOSONAR
    "              5: - **/tmp/**                                                    ", // NOSONAR
    "                                                                                ", // NOSONAR
    "Includes:     🟩 tmp/important.log   (lines: 1 => 2)                            ", // NOSONAR
    "              🟩 tmp/access.log      (lines: 1 => 4)                            ", // NOSONAR
    "                                                                                ", // NOSONAR
    "Excludes:     🟥 tmp/unimportant.log (linea: 1 => 2 => 3)                       ", // NOSONAR
    "              🟥 tmp/test.txt        (lines: 5)                                 ", // NOSONAR
    "                                                                                ", // NOSONAR
    "Every file that ends with .log will be matched by the rule in line 1. No other  ", // NOSONAR
    "rules (apart from the nested ones) will be applied. If a .log file is within the", // NOSONAR
    "tmp directory, the rule in line 1 will win. The rule in line 5 won't be         ", // NOSONAR
    "evaluated at all.                                                               ", // NOSONAR
    "                                                                                ", // NOSONAR
    "Once a rule has matched, child rules (exemptions) are evaluated. If a child rule", // NOSONAR
    "matches, it overrides/negates the parent rule's outcome.                        ", // NOSONAR
    "                                                                                ", // NOSONAR
    "--------------------------------------------------------------------------------", // NOSONAR
    "Comments                                                                        ", // NOSONAR
    "--------------------------------------------------------------------------------", // NOSONAR
    "                                                                                ", // NOSONAR
    "Filter rule files can contain comments. They are ignored when the filter rules  ", // NOSONAR
    "are read. Comments start with a leading hash symbol (#) and end at the end of   ", // NOSONAR
    "the line:                                                                       ", // NOSONAR
    "                                                                                ", // NOSONAR
    "--------------------------------------------------------------------------------", // NOSONAR
    "Exclude all log files                                                           ", // NOSONAR
    "--------------------------------------------------------------------------------", // NOSONAR
    "- **/*.log*                                                                     ", // NOSONAR
    "  # ...but include access logs                                                  ", // NOSONAR
    "  + **/*access*                                                                 ", // NOSONAR
    "                                                                                ", // NOSONAR
    "Only whole-line comments are supported. Hashes to the right-hand side of filter ", // NOSONAR
    "rules are not supported.                                                        ", // NOSONAR
    "                                                                                ", // NOSONAR
    "--------------------------------------------------------------------------------", // NOSONAR
    "Directory scope                                                                 ", // NOSONAR
    "--------------------------------------------------------------------------------", // NOSONAR
    "                                                                                ", // NOSONAR
    "When using include (+) and exclude (-) rules, every glob must always match the  ", // NOSONAR
    "full path:                                                                      ", // NOSONAR
    "                                                                                ", // NOSONAR
    "Filter rules: + /projects/filter-paths/**                                       ", // NOSONAR
    "                - **/.git/**                                                    ", // NOSONAR
    "                - **/node_modules/**                                            ", // NOSONAR
    "                                                                                ", // NOSONAR
    "Excludes:     🟥 projects/filter-paths/.git./*                                  ", // NOSONAR
    "              🟥 projects/filter-paths/node_modules/*                           ", // NOSONAR
    "              🟥 projects/filter-paths/experiment/.git/*                        ", // NOSONAR
    "              🟥 projects/filter-paths/experiment/node_modules/*                ", // NOSONAR
    "                                                                                ", // NOSONAR
    "To only exclude the .git and node_modules directories that reside directly on   ", // NOSONAR
    "the top level in projects/filter-paths, the root path has to be repeated:       ", // NOSONAR
    "                                                                                ", // NOSONAR
    "Filter rules: + /projects/filter-paths/**                                       ", // NOSONAR
    "                - /projects/filter-paths/.git/**                                ", // NOSONAR
    "                - /projects/filter-paths/node_modules/**                        ", // NOSONAR
    "                                                                                ", // NOSONAR
    "Includes:     🟩 projects/filter-paths/experiment/.git./...                     ", // NOSONAR
    "              🟩 projects/filter-paths/experiment/node_modules/...              ", // NOSONAR
    "                                                                                ", // NOSONAR
    "Excludes:     🟥 projects/filter-paths/.git/...                                 ", // NOSONAR
    "              🟥 projects/filter-paths/node_modules/...                         ", // NOSONAR
    "                                                                                ", // NOSONAR
    "The directory scope rule can be used to apply child rules only within a given   ", // NOSONAR
    "directory:                                                                      ", // NOSONAR
    "                                                                                ", // NOSONAR
    "1: @ /projects/filter-paths                                                     ", // NOSONAR
    "2:   + **                                                                       ", // NOSONAR
    "3:     - /.git/**                                                               ", // NOSONAR
    "4:     - /node_modules/**                                                       ", // NOSONAR
    "                                                                                ", // NOSONAR
    "The @ rule dictates that the prefix /projects/filter-paths has to be prepended  ", // NOSONAR
    "to every direct and indirect child glob. The globs are effectively evaluated as ", // NOSONAR
    "follows:                                                                        ", // NOSONAR
    "                                                                                ", // NOSONAR
    "1: @ /projects/filter-paths                                                     ", // NOSONAR
    "2:   + /projects/filter-paths/**                                                ", // NOSONAR
    "3:     - /projects/filter-paths/.git/**                                         ", // NOSONAR
    "4:     - /projects/filter-paths//node_modules/**                                ", // NOSONAR
    "                                                                                ", // NOSONAR
    "Please note the following:                                                      ", // NOSONAR
    "                                                                                ", // NOSONAR
    " * The @ rule itself is not matched against any path. Only the nested child     ", // NOSONAR
    "   rules determine if paths match and if they should be included or excluded.   ", // NOSONAR
    " * The path in the @ rule is a directory that matches only a part of the full   ", // NOSONAR
    "   path. The @ directory does not end with **. Files within the @ directory are ", // NOSONAR
    "   matched through the child globs. However, the path can still contain         ", // NOSONAR
    "   wildcards (? and *), globstars (**), bracket expressions ([a-z]), and curly  ", // NOSONAR
    "   braces ({.ts,.js}).                                                          ", // NOSONAR
    " * Similar to regular include (+) and exclude (-) rules, @ directories are globs", // NOSONAR
    "   that can start with a slash (/) or a globstar (**). However, they don't need ", // NOSONAR
    "   to match the whole path. They usually only match a parent directory (to be   ", // NOSONAR
    "   further refined by child rules/globs). Therefore, @ directories don't end    ", // NOSONAR
    "   with globstars (**).                                                         ", // NOSONAR
    " * Only @ directories are prepended to child globs. For example, the globstar   ", // NOSONAR
    "   (**) from line 2 is not inherited by/incorporated into lines 3 and 4.        ", // NOSONAR
    "                                                                                ", // NOSONAR
    "Directory scopes can be nested:                                                 ", // NOSONAR
    "                                                                                ", // NOSONAR
    "@ /projects                                                                     ", // NOSONAR
    "  + **                                                                          ", // NOSONAR
    "    @ /filter-paths                                                             ", // NOSONAR
    "      - /node_modules/**                                                        ", // NOSONAR
    "      - **/tmp/**                                                               ", // NOSONAR
    "    @ /experimentation                                                          ", // NOSONAR
    "      - **/*.tmp                                                                ", // NOSONAR
    "                                                                                ", // NOSONAR
    "This effectively forms the following ruleset:                                   ", // NOSONAR
    "                                                                                ", // NOSONAR
    "+ /projects/**                                                                  ", // NOSONAR
    "  - /projects/filter-paths/node_modules/**                                      ", // NOSONAR
    "  - /projects/filter-paths/**/tmp/**                                            ", // NOSONAR
    "  - /projects/experimentation/**/*.tmp                                          ", // NOSONAR
    "                                                                                ", // NOSONAR
    "A directory scope rule (@) does not include or exclude any path. To include or  ", // NOSONAR
    "exclude everything inside the specified directory, a nested globstar rule is    ", // NOSONAR
    "required:                                                                       ", // NOSONAR
    "                                                                                ", // NOSONAR
    "1: @ /projects                                                                  ", // NOSONAR
    "2:   + **                                                                       ", // NOSONAR
    "3:     - **/*.log                                                               ", // NOSONAR
    "                                                                                ", // NOSONAR
    "Line 1 does not include any paths, so we need line 2 to include everything that ", // NOSONAR
    "matches /projects/**. There's a shortcut to combine lines 1 and 2 into a single ", // NOSONAR
    "rule:                                                                           ", // NOSONAR
    "                                                                                ", // NOSONAR
    "@ + /projects                                                                   ", // NOSONAR
    "  - **/*.log                                                                    ", // NOSONAR
    "                                                                                ", // NOSONAR
    "This effectively evaluates to the following filter:                             ", // NOSONAR
    "                                                                                ", // NOSONAR
    "+ /projects/**                                                                  ", // NOSONAR
    "  - /projects/**/*.log                                                          ", // NOSONAR
    "                                                                                ", // NOSONAR
    "Note that the @ directory (/projects) is still a path (which doesn't end with   ", // NOSONAR
    "**). However, the trailing /** is added implicitly when evaluating the + part of", // NOSONAR
    "the @ rule.                                                                     ", // NOSONAR
    "                                                                                ", // NOSONAR
    "--------------------------------------------------------------------------------", // NOSONAR
    "Including files                                                                 ", // NOSONAR
    "--------------------------------------------------------------------------------", // NOSONAR
    "                                                                                ", // NOSONAR
    "Filter rules can include/inline other files, using either the include keyword or", // NOSONAR
    "its alias import:                                                               ", // NOSONAR
    "                                                                                ", // NOSONAR
    "include main.filter                                                             ", // NOSONAR
    "import additional.filter                                                        ", // NOSONAR
    "                                                                                ", // NOSONAR
    "The files to include can be specified as one of the following:                  ", // NOSONAR
    "                                                                                ", // NOSONAR
    " * An absolute path                                                             ", // NOSONAR
    " * A relative path (which is evaluated relative to the file containing the      ", // NOSONAR
    "   include statement)                                                           ", // NOSONAR
    " * A path based on an environment variable (e.g. include                        ", // NOSONAR
    "   ${MY_CONFIG_DIR}/default.filter)                                             ", // NOSONAR
    "                                                                                ", // NOSONAR
    "Environment variables are only supported in include paths. They are not expanded", // NOSONAR
    "in globs.                                                                       ", // NOSONAR
    "                                                                                ", // NOSONAR
    "Filter files can be included anywhere, and the indentation indicates under which", // NOSONAR
    "parent rule they should reside:                                                 ", // NOSONAR
    "                                                                                ", // NOSONAR
    "@ - **/.git                                                                     ", // NOSONAR
    "  include git.filter                                                            ", // NOSONAR
    "                                                                                ", // NOSONAR
    "In this example, the git.filter rules would inherit the directory scope (@) and ", // NOSONAR
    "only apply to files within a .git directory. The rules in git.filter must be    ", // NOSONAR
    "include rules (+) because the parent rule (**/.git) is an exclude rule (-).     ", // NOSONAR
    "                                                                                ", // NOSONAR
    "While include rules can be the child of another rule, they can't have nested    ", // NOSONAR
    "children themselves:                                                            ", // NOSONAR
    "                                                                                ", // NOSONAR
    "include default.filter                                                          ", // NOSONAR
    "  # ERROR: No children are allowed                                              ", // NOSONAR
    "  - **/*.log                                                                    ", // NOSONAR
    "  # ERROR: No children are allowed                                              ", // NOSONAR
    "  include nested.filter                                                         ", // NOSONAR
    "                                                                                ", // NOSONAR
    "--------------------------------------------------------------------------------", // NOSONAR
    "Goto rules                                                                      ", // NOSONAR
    "--------------------------------------------------------------------------------", // NOSONAR
    "                                                                                ", // NOSONAR
    "A goto rule works like the goto or break statement in programming languages. It ", // NOSONAR
    "causes a parent rule to be skipped even if it matches the path:                 ", // NOSONAR
    "                                                                                ", // NOSONAR
    "1: - **/*file*                                                                  ", // NOSONAR
    "2:   + **/*important*                                                           ", // NOSONAR
    "3:     - **/*unimportant*                                                       ", // NOSONAR
    "4: |   < **                                                                     ", // NOSONAR
    "5: - **/tmp/**                                                                  ", // NOSONAR
    "                                                                                ", // NOSONAR
    "The goto rule is the one in line 4. It consists of two operators:               ", // NOSONAR
    "                                                                                ", // NOSONAR
    " * The arrow (<) indicates the nesting of the rule (it's a child of             ", // NOSONAR
    "   **/*important* and a sibling of **/*unimportant*).                           ", // NOSONAR
    " * The target (|) indicates the level to jump to. In this example, it will jump ", // NOSONAR
    "   to the rule in line 5 because both lines' operators (| and -) have the same  ", // NOSONAR
    "   indentation level.                                                           ", // NOSONAR
    "                                                                                ", // NOSONAR
    "When this rule set is applied to path tmp/important-file, the following happens:", // NOSONAR
    "                                                                                ", // NOSONAR
    " * The rule in line 1 matches, excluding the file.                              ", // NOSONAR
    " * The rule in line 2 matches, creating an exemption and including the file     ", // NOSONAR
    "   again.                                                                       ", // NOSONAR
    " * The rule in line 3 is evaluated but does not match. It's ignored.            ", // NOSONAR
    " * The rule in line 4 matches. The target (|) is on the same indentation level  ", // NOSONAR
    "   as the - in line 1. This causes the rule from line 1 to be treated as if it  ", // NOSONAR
    "   hadn't matched the path to start with.                                       ", // NOSONAR
    " * With the rule in line 1 considered to not have matched, the evaluation of its", // NOSONAR
    "   nested children is aborted.                                                  ", // NOSONAR
    " * The rule in line 5 is evaluated. It matches and causes the file to be        ", // NOSONAR
    "   excluded.                                                                    ", // NOSONAR
    "                                                                                ", // NOSONAR
    "Without a goto rule, the first matching include (+) or exclude (-) rule would   ", // NOSONAR
    "determine if the path should be included. When line 1 (**/*file*) matches,      ", // NOSONAR
    "subsequent rules like in line 5 (**/tmp/**) would not be evaluated at all.      ", // NOSONAR
    "Processing always stops with the first match. The goto statement bypasses this  ", // NOSONAR
    "constraint.                                                                     ", // NOSONAR
];