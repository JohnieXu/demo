import { flatten, intersect, join } from './array'

test('array.flatten', () => {
  const arr1 = [[1, 2, 2], [3, 4, 5, 5], [6, 7, 8, 9, [11, 12, [12, 13, [14] ] ] ], 10]
  const arr2 = [1, 2, 3, {}, { a: 1 }, {}]
  const arr3 = [1, 2, 3, {}, {}, () => {}, () => {}, { a: 1 }]
  expect(() => {
    flatten()
  }).toThrow()
  expect(() => {
    flatten('')
  }).toThrow()
  expect(() => {
    flatten({})
  }).toThrow()
  expect(flatten(arr1)).toHaveLength(14)
  expect(flatten(arr2)).toHaveLength(6)
  expect(flatten(arr3)).toHaveLength(8)
})

test('array.intersect', () => {
  // 复合类型数组
  const obj = { a: 123 }
  const arr1 = [1, 2, 3, 3, obj, { b: 456 }, { c: 789 }]
  const arr2 = [2, 3, 4, obj, { c: 789 }]
  expect(intersect(arr1, arr2)).toHaveLength(4)
  expect(intersect(arr1, arr2)).toStrictEqual([2, 3, 3, obj])
  // 对象类型数组
  const arr3 = [{ id: 1, a: 123 }, { id: 1, a: 123 }, { id: 2, a: 123 }]
  const arr4 = [{ id: 2, a: 456 }, { id: 3, a: 456 }, { id: 4, a: 456 }]
  expect(intersect(arr3, arr4)).toHaveLength(0)
  expect(intersect(arr3, arr4, (item1, item2) => item1.id === item2.id)).toStrictEqual([ { id: 2, a: 123 }])
})

test('array.join', () => {
  // 复合类型数组
  const obj = { a: 123 }
  const arr1 = [1, 2, 3, 3, obj, { b: 456 }, { c: 789 }]
  const arr2 = [2, 3, 4, obj, { c: 789 }]
  expect(join(arr1, arr2)).toHaveLength(9)
  expect(join(arr1, arr2).sort()).toStrictEqual([1, 2, 3, 3, 4, obj, { b: 456 }, { c: 789 }, { c: 789 }].sort())
  // 对象类型数组
  const arr3 = [{ id: 1, a: 123 }, { id: 1, a: 123 }, { id: 2, a: 123 }]
  const arr4 = [{ id: 2, a: 456 }, { id: 3, a: 456 }, { id: 4, a: 456 }]
  expect(join(arr3, arr4)).toHaveLength(6)
  expect(join(arr3, arr4, (item1, item2) => item1.id === item2.id)).toHaveLength(5)
})
