import { logger } from "core/log";

function loadLoggerAsync() {
  return import("core/log").then(res => {
    const logg = new res.Logger("entry")
    logg.log("async load done")
  })
}

function loadFormatAsync() {
  // https://webpack.js.org/concepts/under-the-hood/#chunks
  return import(/* webpackChunkName: "chunk_format" */"core/format").then(res => {
    console.log(res.repeat("a", 10))
  })
}

logger.log("entry:search")
setTimeout(() => {
  loadLoggerAsync()
  loadFormatAsync()
}, 100);
