#!/usr/bin/env bash

set -e -o pipefail

function __fp_embed_manual() {
    unset -f __fp_embed_manual

    if [[ -d bin ]]; then
        cd bin
    fi

    echo Embedding manual...
    node embed-manual.mjs
}

__fp_embed_manual "$@"
