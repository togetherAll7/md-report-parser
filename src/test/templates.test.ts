import { parseTemplateName, sortData } from '../Templates'
import {
  TEMPLATE_FIELDS_SEPARATOR,
  TEMPLATE_PARTS_SEPARATOR
} from '../constants'

const testName = (n: string, result?: string) => {
  const x = result || n
  it(`${n} should return ${x} as name`, () => {
    const { name, fields, sort } = parseTemplateName(n)
    expect(name).toBe(x)
    expect(fields).toBe(undefined)
    expect(sort).toBe(undefined)
  })
}

describe('parseTemplateName', () => {
  describe('name', () => {
    testName('test')
    testName('test---')
    testName(
      `test${TEMPLATE_PARTS_SEPARATOR}${TEMPLATE_PARTS_SEPARATOR}`,
      'test'
    )
    testName('test,')
    testName('test---asasas')
    testName('test')
  })

  describe('name fields sort', () => {
    const cases = [
      {
        name: 'testTemplate',
        fields: ['one', 'two', 'three'],
        sort: ['foo', '-bar', 'baz']
      }
    ]
    for (let { name, fields, sort } of cases) {
      const templateName = `${name}${TEMPLATE_PARTS_SEPARATOR}${fields.join(
        TEMPLATE_FIELDS_SEPARATOR
      )}${TEMPLATE_PARTS_SEPARATOR}${sort.join(TEMPLATE_FIELDS_SEPARATOR)}`

      it('should return the parsed parts of the name', () => {
        const parsed = parseTemplateName(templateName)
        expect(parsed.name).toBe(name)
        expect(parsed.fields).toStrictEqual(fields)
        expect(parsed.sort).toStrictEqual(sort)
      })
    }
  })
})

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
