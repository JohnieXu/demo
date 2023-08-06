#!/bin/bash

# clear
rm -f ./build/dominant_color.wasm

# copy wasm.exec.js
cp "$(go env GOROOT)/misc/wasm/wasm_exec.js" ./build

# build wasm
GOOS=js GOARCH=wasm go build -o ./build/dominant_color.wasm ./wasm

echo "build success dominant_color.wasm saved to ./build/dominant_color.wasm"