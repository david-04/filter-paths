# filter-paths

A command-line filter to include/exclude paths based on glob rules. It aims to provide a comparably simple syntax to define rules with nested exceptions. A simple filter might look like this:

```
- **/*.log
  + **/*important*
    - **/*unimportant*
- /node_modules/**
```

It excludes (filters out) all log files except those containing the term `important` in the file name. However, files with the term `unimportant` will still be excluded (even though they also contain the term `important`).

The primary use case for `filter-paths` is to select (or filter out) files based on glob rules and then pass on the result to an application that archives the selected files (e.g. `tar`, `zip`, or `7z`) or synchronizes them to a destination directory (e.g. via `rsync` or `rclone`).

## Installation and usage

Install the application:

```shell
npm install --global filter-paths
```

Create a filter file (e.g. `my.filter`) with globs to include or exclude (see syntax description below):

```
- **/*.log
  + **/*access*
- /node_modules/**
```

Use a command like `find` to list all files and pipe the result through `filter-paths`:

```shell
find . -type f | filter-paths my.filter
```

This will print the paths of all files that are included (or not excluded) by the filter rules.

## Testing

### Testing globs

To interactively test which globs match which path, run `filter-paths` in debug mode:

```
$ filter-paths --debug

Glob:   **/*.txt
Path:   test.txt
Result: 🟩 matches
```

It repeatedly prompts for a glob and a path and then indicates if the path matches the glob. Leave any of the input fields empty to re-apply the previous input.

### Printing the filter rules

To verify that the file with filter rules has been parsed correctly, pass the option `--print-rules` to the application:

```
$ filter-paths --print-rules my.filter

- **/*.log
  + **/*important*
    - **/*unimportant*
- /node_modules/**
```

This will print the rules that will effectively be applied.

### Testing filter rules

To interactively test which rules are applied to a specific path, run the application in debug mode:

```
$ filter-paths --debug my.filter

Path to evaluate: temp/important.log

- **/*.log
  + **/*important*
    - **/*unimportant*

Result: The path is included
```

It repeatedly prompts for a path to pass through the filter rules. For every path, it prints all the filter rules that were evaluated. Include or exclude rules that matched are printed in green or red. Globs that were evaluated but did not match are grayed out. The last output line indicates whether the path would be selected or filtered out.

## Glob syntax

`filter-paths` uses [picomatch](https://www.npmjs.com/package/picomatch) to match paths. 

### Wildcards and globstars

The `?` wildcard represents a single character, including dots (`.`) and question marks (`?`), but excluding slashes (`/`):

```
Glob:           /test?file

Matches:        🟩 test-file
                🟩 test.file
                🟩 test?file

Does not match: 🟥 test/file
                🟥 testfile
                🟥 test--file
```

The `*` wildcard represents zero, one, or more characters, including dots (`.`), but excluding slashes (`/`):

```
Glob:           /test*file

Matches:        🟩 testfile
                🟩 test.file
                🟩 test?file
                🟩 test-123.file

Does not match: 🟥 test/file
```

Globstars (`**`) represent zero, one or more subdirectories:

```
Glob:           /test/**/file

Matches:        🟩 test/file
                🟩 test/backup/file
                
Does not match: 🟥 testfile
                🟥 test.file
                🟥 test?file
                🟥 test-123.file
```

Globstars should always be delimited by slashes and/or the beginning/end of a glob expression. When used in a non-delimited context, they behave like `*` wildcards:

```
Glob:           /test**file

Matches:        🟩 testfile
                🟩 test.file
                
Does not match: 🟥 test/file
                🟥 test/backup/file
```

### Bracket expressions

Bracket expressions work the same way as in regular expressions. They can contain discrete characters and character ranges (like `a-z` or `0-9`):

```
Glob:           /test.log.[1-5ab]

Matches:        🟩 test.log.1
                🟩 test.log.2
                   ...
                🟩 test.log.5
                🟩 test.log.a
                🟩 test.log.b
                
Does not match: 🟥 test.log.
                🟥 test.log.6
                🟥 test.log.c
```

The meaning can be negated by prepending the circumflex (`^`):

```
Glob:           /test.log.[^1-5ab]

Matches:        🟩 test.log.6
                🟩 test.log.c
                
Does not match: 🟥 test.log.
                🟥 test.log.1
                🟥 test.log.2
                   ...
                🟥 test.log.5
                🟥 test.log.a
                🟥 test.log.b
```

POSIX classes (e.g. `[:alnum:]` as an alias for `[a-zA-Z0-9]`) are supported as well.

### Curly braces

Curly braces (`{` and `}`) can be used to allow one of multiple values that are separated by commas (`,`):

```
Glob:           /test.{txt,md}

Matches:        🟩 test.txt
                🟩 test.md
                
Does not match: 🟥 test.tmp
```

Curly braces can contain empty strings, be nested, and include wildcards (`?` and `*`), globstars (`**`), and bracket expressions (`[a-z]`):

```
Glob:           /file{,.{?js,ts*}}

Matches:        🟩 file
                🟩 file.cjs
                🟩 file.mjs
                🟩 file.ts
                🟩 file.tsx
                🟩 file.ts.tmp
                
Does not match: 🟥 file.
                🟥 file.js
```

### Constraints

The following constraints apply:

- Only forward-slashes (`/`) can be used as the path separator in globs (even on Windows). The paths to be filtered can still contain backslashes (`\`). They are automatically normalized before applying the globs.
- Globs must either start with a slash (`/`) or with a globstar (`**/`). This is enforced for readability purposes only. It makes it clearer if a glob can match only on root-level or anywhere in nested subdirectories.
- Globs match "hidden" files and directories whose name starts with a dot (`.`).
- Globs are case-insensitive by default. This can be changed via the command-line option `--case-sensitive`.
- Globs can't be negated by prepending an exclamation mark (`!`). Use include or exclude rules (`+` or `-`) instead.

## Rules

### Include and exclude rules

The basic building blocks are include and exclude rules. A rule set can be built to exclude certain files:

```
- **/*.log
- **/node_modules/**
```

All files that don't match any of the globs will be included by default.

Alternatively, the rules can specify which files to include:

```
+ **/*.ts
+ /*.json
```

All paths that don't match any of the globs will be excluded by default.

It is not possible to mix include and exclude rules:

```
+ **/*.ts
# ERROR: Can't mix include (+) and exclude (-)
- **/node_modules/**
```

This is to avoid ambiguity, as include and exclude globs might both match the same paths.

Instead of mixing include and exclude rules on the same level, exemptions can be defined as nested rules in an alternating manner:

```
- **/*.log
  + **/*access*
    - **/tmp/**
```

This rule excludes all `.log` files. However, it will still include all `access` logs - but not if they happen to also be in a `tmp` directory.

When nesting rules, each glob must always match the full path. Nested globs are not concatenated:

```
Filter rules:   - **/tmp/**
                  + /*important*

Excluded paths: 🟥 tmp/important.file                
```

The inner glob (`/*important*`) never matches because it contradicts the outer glob (`**/tmp/**`):

- The outer glob requires files to be inside a `tmp` directory.
- The inner glob requires the file to be in the root directory.

Globs are not concatenated. Child globs must always match the whole path - and not just the segments that haven't been matched by the parent glob already. Similarly, globs themselves can't match only part of a path:

```
Glob:           **/tmp

Matches:        🟩 tmp
                🟩 directory/tmp
                
Does not match: 🟥 tmp/file
```

When multiple globs match, the first innermost glob takes precedence:

```
Filter rules: 1: - **/*.log
              2:   + **/*important*
              3:     - **/*unimportant*
              4:   + **/*access*
              5: - **/tmp/**

Includes:     🟩 tmp/important.log   (lines: 1 => 2)
              🟩 tmp/access.log      (lines: 1 => 4)
                
Excludes:     🟥 tmp/unimportant.log (linea: 1 => 2 => 3)
              🟥 tmp/test.txt        (lines: 5)
```

Every file that ends with `.log` will be matched by the rule in line 1. No other rules (apart from the nested ones) will be applied. If a `.log` file is within the `tmp` directory, the rule in line 1 will win. The rule in line 5 won't be evaluated at all.

Once a rule has matched, child rules (exemptions) are evaluated. If a child rule matches, it overrides/negates the parent rule's outcome.

### Comments

Filter rule files can contain comments. They are ignored when the filter rules are read. Comments start with a leading hash symbol (`#`) and end at the end of the line:

```
# Exclude all log files
- **/*.log*
  # ...but include access logs
  + **/*access*
```

Only whole-line comments are supported. Hashes to the right-hand side of filter rules are not supported.

### Directory scope

When using include (`+`) and exclude (`-`) rules, every glob must always match the full path:

```
Filter rules: + /projects/filter-paths/**
                - **/.git/**
                - **/node_modules/**

Excludes:     🟥 projects/filter-paths/.git./*
              🟥 projects/filter-paths/node_modules/*
              🟥 projects/filter-paths/experiment/.git/*
              🟥 projects/filter-paths/experiment/node_modules/*
```

To only exclude the `.git` and `node_modules` directories that reside directly on the top level in `projects/filter-paths`, the root path has to be repeated:

```
Filter rules: + /projects/filter-paths/**
                - /projects/filter-paths/.git/**
                - /projects/filter-paths/node_modules/**

Includes:     🟩 projects/filter-paths/experiment/.git./...
              🟩 projects/filter-paths/experiment/node_modules/...
                
Excludes:     🟥 projects/filter-paths/.git/...
              🟥 projects/filter-paths/node_modules/...
```

The directory scope rule can be used to apply child rules only within a given directory:

```
1: @ /projects/filter-paths
2:   + **
3:     - /.git/**
4:     - /node_modules/**
```

The `@` rule dictates that the prefix `/projects/filter-paths` has to be prepended to every direct and indirect child glob. The globs are effectively evaluated as follows:

```
1: @ /projects/filter-paths
2:   + /projects/filter-paths/**
3:     - /projects/filter-paths/.git/**
4:     - /projects/filter-paths//node_modules/**
```

Please note the following:

- The `@` rule itself is not matched against any path. Only the nested child rules determine if paths match and if they should be included or excluded.
- The path in the `@` rule is a directory that matches only a part of the full path. The `@` directory does not end with `**`. Files within the `@` directory are matched through the child globs. However, the path can still contain wildcards (`?` and `*`), globstars (`**`), bracket expressions (`[a-z]`), and curly braces (`{.ts,.js}`).
- Similar to regular include (`+`) and exclude (`-`) rules, `@` directories are globs that can start with a slash (`/`) or a globstar (`**`). However, they don't need to match the whole path. They usually only match a parent directory (to be further refined by child rules/globs). Therefore, `@` directories don't end with globstars (`**`).
- Only `@` directories are prepended to child globs. For example, the globstar (`**`) from line 2 is not inherited by/incorporated into lines 3 and 4.

Directory scopes can be nested:

```
@ /projects
  + **
    @ /filter-paths
      - /node_modules/**
      - **/tmp/**
    @ /experimentation
      - **/*.tmp
```

This effectively forms the following ruleset:

```
+ /projects/**
  - /projects/filter-paths/node_modules/**
  - /projects/filter-paths/**/tmp/**
  - /projects/experimentation/**/*.tmp
```

A directory scope rule (`@`) does not include or exclude any path. To include or exclude everything inside the specified directory, a nested globstar rule is required:

```
1: @ /projects
2:   + **
3:     - **/*.log
```

Line 1 does not include any paths, so we need line 2 to include everything that matches `/projects/**`. There's a shortcut to combine lines 1 and 2 into a single rule:

```
@ + /projects
  - **/*.log
```

This effectively evaluates to the following filter:

```
+ /projects/**
  - /projects/**/*.log
```

Note that the `@` directory (`/projects`) is still a path (which doesn't end with `**`). However, the trailing `/**` is added implicitly when evaluating the `+` part of the `@` rule.

### Including files

Filter rules can include/inline other files, using either the `include` keyword or its alias `import`:

```
include main.filter
import additional.filter
```

The files to include can be specified as one of the following:

- An absolute path
- A relative path (which is evaluated relative to the file containing the `include` statement)
- A path based on an environment variable (e.g. `include ${MY_CONFIG_DIR}/default.filter`)

Environment variables are only supported in `include` paths. They are not expanded in globs.

Filter files can be included anywhere, and the indentation indicates under which parent rule they should reside:

```
@ - **/.git
  include git.filter
```

In this example, the `git.filter` rules would inherit the directory scope (`@`) and only apply to files within a `.git` directory. The rules in `git.filter` must be include rules (`+`) because the parent rule (`**/.git`) is an exclude rule (`-`).

While `include` rules can be the child of another rule, they can't have nested children themselves:

```
include default.filter
  # ERROR: No children are allowed
  - **/*.log
  # ERROR: No children are allowed
  include nested.filter
```

### Goto rules

A `goto` rule works like the `goto` or `break` statement in programming languages. It causes a parent rule to be skipped even if it matches the path:

```
1: - **/*file*
2:   + **/*important*
3:     - **/*unimportant*
4: |   < **
5: - **/tmp/**
```

The `goto` rule is the one in line 4. It consists of two operators:

+ The arrow (`<`) indicates the nesting of the rule (it's a child of `**/*important*` and a sibling of `**/*unimportant*`).
+ The target (`|`) indicates the level to jump to. In this example, it will jump to the rule in line 5 because both lines' operators (`|` and `-`) have the same indentation level.

When this rule set is applied to path `tmp/important-file`, the following happens:

- The rule in line 1 matches, excluding the file.
- The rule in line 2 matches, creating an exemption and including the file again.
- The rule in line 3 is evaluated but does not match. It's ignored.
- The rule in line 4 matches. The target (`|`) is on the same indentation level as the `-` in line 1. This causes the rule from line 1 to be treated as if it hadn't matched the path to start with.
- With the rule in line 1 considered to not have matched, the evaluation of its nested children is aborted.
- The rule in line 5 is evaluated. It matches and causes the file to be excluded.

Without a `goto` rule, the first matching include (`+`) or exclude (`-`) rule would determine if the path should be included. When line 1 (`**/*file*`) matches, subsequent rules like in line 5 (`**/tmp/**`) would not be evaluated at all. Processing always stops with the first match. The `goto` statement bypasses this constraint.
