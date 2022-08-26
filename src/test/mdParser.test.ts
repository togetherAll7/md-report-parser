import { MdParser } from '../MdParser'
import { isMdDoc } from '../mdModel'

const parser = MdParser()
const src = '# Test'

describe('MdParser', function () {
  it('MdParser should have a "mdParse" method', () => {
    expect(typeof parser.mdParse).toEqual('function')
  })

  it('MdParser should have a "render" method', () => {
    expect(typeof parser.render).toEqual('function')
  })

  it('MdParser should have a "parse" method', () => {
    expect(typeof parser.parse).toEqual('function')
  })

  it('MdParser should have a "toMd" method', () => {
    expect(typeof parser.toMd).toEqual('function')
  })

  describe('mdParse', () => {
    it('Minimal mdParser test', () => {
      const result = parser.mdParse(src)
      expect(Array.isArray(result)).toBe(true)
    })
  })
  describe('render', () => {
    it('Minimal render test', () => {
      expect(parser.render(src).trim()).toEqual(
        '<h1 id="test" tabindex="-1">Test</h1>'.trim()
      )
    })
  })

  describe('parse', () => {
    it('Minimal  test', () => {
      expect(isMdDoc(parser.parse(src))).toBe(true)
    })
  })

  describe('toMd', () => {
    it('Minimal  test', () => {
      expect(parser.toMd(parser.parse(src))).toBe(`${src}\n\n`)
    })
  })
})
