// The entry file of your WebAssembly module.

import { logInteger } from "./env";

// interface Color {
//   0: i32
//   1: i32
//   2: i32
//   length: 3
// }

class Color {
  constructor() {}
  rgb(): string {
    return 'rgb(255,200,200)'
  }
}

const debug = (a: i32): void => {
  logInteger(a);
}

export function add(a: i32, b: i32): i32 {
  debug(a + b);
  return a + b;
}

export function ab(buffer: ArrayBuffer): string {
  const len = buffer.byteLength
  const dataView = new DataView(buffer)
  let f1 = dataView.getInt32(0)
  return `len = ${len} result = ${buffer.toString()} f1=${f1}`
}

export function ac(buffer: ArrayBuffer, width: i32): ArrayBuffer {
  return drawLine(buffer, width, 10, 255 as i8, 0, 0, 255 as i8)
}

/**
 * 绘制线条
 * FIXME: 外部传入的 buffer 引用失效，必须使用返回的 buffer？？？
 * @param buffer 图片buffer数据
 * @param width 图片宽度（像素）
 * @param R 红色（0-255）
 * @param G 绿色（0-255）
 * @param B 蓝色（0-255）
 * @param A 透明度（0-255）
 * @param height 线条高度（像素）
 * @returns buffer
 */
function drawLine(buffer: ArrayBuffer, width: i32, height: i8 = 1, R: i8 = 255, G: i8 = 0, B: i8 = 0, A: i8 = 255): ArrayBuffer {
  const dataView = new DataView(buffer)
  const byteLength = dataView.byteLength
  const pixelLength = byteLength / 4 // 像素点数
  const pixelX = width
  // const pixelY = pixelLength / pixelX
  console.assert(byteLength % 4 === 0, "invalid buffer length")
  for (let i: i32 = 0, y = Math.floor(i * pixelX); i < pixelLength; i++) {
    if (y >= height) { break }
    dataView.setUint8(i * 4, R)
    dataView.setUint8(i * 4 + 1, G)
    dataView.setUint8(i * 4 + 2, B)
    dataView.setUint8(i * 4 + 3, A)
  }
  return buffer
}

/**
 * 获取图片的主要颜色
 * @param start 图片数据在 memory 中的其实偏移值
 * @param length 图片数据的字节长度
 * @returns 颜色
 */
export function getImagePrimaryColor (start: i32, length: i32): Color {
  // TODO: 根据图片数据计算色值
  // https://jariz.github.io/vibrant.js/
  // https://github.com/Vibrant-Colors/node-vibrant
  // https://dev.to/producthackers/creating-a-color-palette-with-javascript-44ip
  const array = new Int32Array(3)
  array[0] = 255
  array[1] = start
  array[2] = length
  // return array
  return new Color()
}
