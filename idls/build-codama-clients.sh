#!/usr/bin/env bash
set -euo pipefail

# generate all the codama clients (per their respective config files)
pnpm codama run js --config ./idls/token_metadata/codama.json

# run the repo's prettier settings on the generated files
pnpm prettier --write './packages/gill/src/programs/**/generated/{*,**/*}.{ts,js}'
