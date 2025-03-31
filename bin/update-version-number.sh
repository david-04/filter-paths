#!/usr/bin/env bash

set -e

if [[ -d bin ]]; then
    cd bin
fi

echo Updating version number...

VERSION_NUMBER=$(get-version-number.sh)

echo "export const VERSION = \"${VERSION_NUMBER?}\";" >../src/utils/version.ts

# sed -i "s/\"version\"\\s*:\\s*\"[^\"]*\"/\"version\": \"$VERSION_NUMBER\"/g" ../resources/package/package.json
