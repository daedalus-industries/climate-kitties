#!/bin/bash
set -e

echo Clean checkout
git checkout master
git clean -f
npm install

echo Migrate to testnet
node_modules/.bin/truffle deploy --network sokol --reset

echo Delete .gitignore
git rm .gitignore

echo Add and commit /build
git add build/\*.*
git commit -m SNAPSHOT-$(git rev-parse --short HEAD)

echo Tag and push snapshot
git tag -a SNAPSHOT-$(git rev-parse --short HEAD) -m SNAPSHOT-$(git rev-parse --short HEAD)
git push origin SNAPSHOT-$(git rev-parse --short HEAD)

echo Restore
git reset --hard HEAD~1
git checkout master
