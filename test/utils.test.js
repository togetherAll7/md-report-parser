import { assert } from 'chai'
import { filterObjectFields, flipObject } from '../src/utils.js'


describe('flipObjects', function () {
  it('should "flip" an object', () => {
    assert.deepEqual(flipObject({ a: 1, b: 2, c: 3 }), { 1: 'a', 2: 'b', 3: 'c' })
    assert.deepEqual(flipObject({ a: 1, b: null, c: undefined }), { 1: 'a', 'null': 'b', 'undefined': 'c' })
    assert.deepEqual(flipObject({ a: 1, b: null, c: null }), { 1: 'a', 'null': 'c' })
  })

})

describe('filterObjectFields', function () {
  const fields = ['a', 'c']
  it('should filter object fields', () => {
    const result = filterObjectFields({ a: 1, b: 2, c: 3 }, fields)
    assert.deepEqual(Object.keys(result), fields)
  })
})