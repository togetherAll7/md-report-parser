import { filterObjectFields, flipObject } from '../utils'


describe('flipObjects', () => {
  it('should "flip" an object', () => {
    /* eslint-disable @typescript-eslint/naming-convention */
    expect(flipObject({ a: 1, b: 2, c: 3 })).toEqual({ 1: 'a', 2: 'b', 3: 'c' })
    expect(flipObject({ a: 1, b: null, c: undefined })).toEqual({ 1: 'a', 'null': 'b', 'undefined': 'c' })
    expect(flipObject({ a: 1, b: null, c: null })).toEqual({ 1: 'a', 'null': 'c' })
  })

})

describe('filterObjectFields', () => {
  const fields = ['a', 'c']
  it('should filter object fields', () => {
    const result = filterObjectFields({ a: 1, b: 2, c: 3 }, fields)
    expect(Object.keys(result)).toEqual(fields)
  })
})