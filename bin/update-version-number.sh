#!/usr/bin/env bash

set -e -o pipefail

function __fp_update_version_number() {
    unset -f __fp_update_version_number

    if [[ -d bin ]]; then
        cd bin
    fi
    echo Updating version number...
    echo "export const VERSION = \"$(get-version-number.sh)\";" >../src/utils/version.ts
}

__fp_update_version_number "$@"
