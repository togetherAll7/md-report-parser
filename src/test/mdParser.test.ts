import { MdParser } from '../MdParser'

const parser = MdParser()
const src = '# Test'

describe('MdParser', function () {
  it('MdParser should have a "parse" method', () => {
    expect(typeof parser.parse).toEqual('function')
  })
  it('MdParser should have a "render" method', () => {
    expect(typeof parser.render).toEqual('function')
  })
  describe('parse', () => {
    it('Minimal parser test', () => {
      const result = parser.parse(src)
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
})
