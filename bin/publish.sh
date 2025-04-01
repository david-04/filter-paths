#!/usr/bin/env bash

set -e -o pipefail

function __fp_publish() {
    unset -f __fp_publish

    if [[ -d bin ]]; then
        cd bin
    fi

    echo Publishing to npm...

    for FILE in filter-paths.mjs package.json README.md; do
        if [[ ! -f "../dist/${FILE?}" ]]; then
            echo "ERROR: dist/${FILE?} does not exist"
            return 1
        fi
    done

    if ! npm whoami >/dev/null 2>&1; then
        npm login --scope=@david-04
    fi

    cd ../dist
    npm publish --access=public
    cd ../bin
}

__fp_publish
