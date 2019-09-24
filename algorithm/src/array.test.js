import { flatten } from './array'

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
