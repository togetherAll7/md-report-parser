import { sortData } from '../Templates'

describe('sortData', () => {
  const data = [
    { a: 3, b: 4, c: 'a' },
    { a: 1, b: 10, c: 'b' },
    { a: 2, b: 2, c: 'c' }
  ]
  const expectedB = [
    { a: 2, b: 2, c: 'c' },
    { a: 3, b: 4, c: 'a' },
    { a: 1, b: 10, c: 'b' }
  ]

  const expectedA = [
    { a: 1, b: 10, c: 'b' },
    { a: 2, b: 2, c: 'c' },
    { a: 3, b: 4, c: 'a' }
  ]

  const expectedC = [
    { a: 3, b: 4, c: 'a' },
    { a: 1, b: 10, c: 'b' },
    { a: 2, b: 2, c: 'c' }
  ]

  const expectedBr = [
    { a: 1, b: 10, c: 'b' },
    { a: 3, b: 4, c: 'a' },
    { a: 2, b: 2, c: 'c' }
  ]

  const expectedAr = [
    { a: 3, b: 4, c: 'a' },
    { a: 2, b: 2, c: 'c' },
    { a: 1, b: 10, c: 'b' }
  ]

  const expectedCr = [
    { a: 2, b: 2, c: 'c' },
    { a: 1, b: 10, c: 'b' },
    { a: 3, b: 4, c: 'a' }
  ]

  it('should sort data', () => {
    expect(sortData(data, ['b'])).toStrictEqual(expectedB)
    expect(sortData(data, ['a', 'b'])).toStrictEqual(expectedA)
    expect(sortData(data, ['c', 'b'])).toStrictEqual(expectedC)
  })

  it('should sort data in reverse order', () => {
    expect(sortData(data, ['-b'])).toStrictEqual(expectedBr)
    expect(sortData(data, ['-a', 'b'])).toStrictEqual(expectedAr)
    expect(sortData(data, ['-c', 'b'])).toStrictEqual(expectedCr)
  })
})
