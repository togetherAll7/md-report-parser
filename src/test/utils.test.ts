import { filterObjectFields, flipObject, arrayUnique } from '../utils'

describe('flipObjects', () => {
  it('should "flip" an object', () => {
    /* eslint-disable @typescript-eslint/naming-convention */
    expect(flipObject({ a: 1, b: 2, c: 3 })).toEqual({ 1: 'a', 2: 'b', 3: 'c' })
    expect(flipObject({ a: 1, b: null, c: undefined })).toEqual({
      1: 'a',
      null: 'b',
      undefined: 'c'
    })
    expect(flipObject({ a: 1, b: null, c: null })).toEqual({
      1: 'a',
      null: 'c'
    })
  })
})

describe('filterObjectFields', () => {
  const fields = ['a', 'c']
  it('should filter object fields', () => {
    const result = filterObjectFields({ a: 1, b: 2, c: 3 }, fields)
    expect(Object.keys(result)).toEqual(fields)
  })
})

describe('arrayUnique', () => {
  it('should remove duplicated values form array', () => {
    expect(arrayUnique([1, 2, 2, 3, 1, 'a'])).toStrictEqual([1, 2, 3, 'a'])
    expect(arrayUnique([5, 1, '2', 2, 1, 1, 'test'])).toStrictEqual([
      5,
      1,
      '2',
      2,
      'test'
    ])
  })
})
