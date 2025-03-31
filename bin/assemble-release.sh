#!/usr/bin/env bash

set -e -o pipefail

function __fp_assemble_release() {
    unset -f __fp_assemble_release

    if [[ -d bin ]]; then
        cd bin
    fi

    echo Assembling release...

    local BUNDLE=build/bundler/filter-paths.js

    if [[ ! -f "../${BUNDLE?}" ]]; then
        echo "ERROR: ${BUNDLE?} does not exist" >&2
        return 1
    fi

    cp "../${BUNDLE?}" ../dist/filter-paths.mjs
    cp ../README.md ../dist/README.md
    sed "s/\"version\"\\s*:\\s*\"[^\"]*\"/\"version\": \"$(get-version-number.sh)\"/g" ../resources/package.json >../dist/package.json
}

__fp_assemble_release "$@"
