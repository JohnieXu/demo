#!/bin/bash
GOOS=js GOARCH=wasm go build -o ./build/release.wasm main.go

# copy wasm.exec.js
cp "$(go env GOROOT)/misc/wasm/wasm_exec.js" ./build
