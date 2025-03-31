#!/usr/bin/env bash

set -e

if [[ -f "CHANGELOG.md" ]]; then
    grep -E "^## \[[0-9.]+\]" CHANGELOG.md | head -1 | sed "s|^\#\# \[||;s|\].*||"
else
    grep -E "^## \[[0-9.]+\]" ../CHANGELOG.md | head -1 | sed "s|^\#\# \[||;s|\].*||"
fi
