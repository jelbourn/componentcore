#!/usr/bin/env bash
rm -rf ./dist
$(npm bin)/tsc
$(npm bin)/rollup ./dist/demo/index.js --format iife --file ./dist/main.js
cp ./src/demo/index.html ./dist/
