import {
  phOpen,
  phClose,
  isPlaceHolder,
  wrapPh,
  unwrapPlaceholder,
  parsePlaceholder,
  createPlaceHolder
} from '../placeholders'

const tesPlaceHolders = (test: string[], expected: boolean) => {
  for (const t of test) {
    it(`${t} should be ${expected}`, () => {
      expect(isPlaceHolder(t)).toBe(expected)
    })
  }
}

describe('Placeholders', () => {
  describe('wrap/unwrap', () => {
    const test = 'xxxxx-\ntest'
    it('should wrap a placeholder', () => {
      expect(wrapPh(test)).toBe(`${phOpen}${test}${phClose}`)
    })
    it('should unwrap a placeholder', () => {
      expect(unwrapPlaceholder(wrapPh(test))).toBe(test)
    })
  })

  describe('isPlaceholder', () => {
    const invalid = [
      '',
      phOpen,
      phClose,
      `${phOpen}abc`,
      `abc${phClose}`,
      `foo${phOpen}bar${phClose}`
    ]
    const valid = [
      wrapPh('x'),
      wrapPh('one:one'),
      wrapPh('\na:a \n b:[1,2,3]\n'),
      `${phOpen}${phClose}`
    ]
    tesPlaceHolders(invalid, false)
    tesPlaceHolders(valid, true)
  })

  const obj = { name: 'test', a: 1, b: [1, 2, 3], c: 'test' }
  describe('createPlaceholder', () => {
    it('should create a placeholder from a string', () => {
      const str = 'this-is-a-paceholder'
      expect(createPlaceHolder(str)).toBe(`${phOpen}${str}${phClose}`)
    })

    it('should create a placeholder from object', () => {
      const ph = createPlaceHolder(obj)
      expect(typeof ph).toBe('string')
      const parsed = parsePlaceholder(ph)
      expect(parsed).toStrictEqual(obj)
    })
  })

  describe('parse placeholders', () => {
    it('should parse a text placeholder', () => {
      const test = 'this-is-a-placeholder'
      const ph = wrapPh(test)
      expect(parsePlaceholder(ph).name).toBe(test)
    })

    it('should parse an object placeholder', () => {
      const parsed = parsePlaceholder(createPlaceHolder(obj))
      expect(parsed).toStrictEqual(obj)
    })
  })
})
