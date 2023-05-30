import { MdParser } from '../MdParser'
import { isMdDoc, wrapBlock } from '../mdModel'
import { getFile } from './test.helpers'
import { createNewReport } from '../templates/mdTemplates'
import { REPORT_METADATA } from '../Reports'
import { metadataToMd } from '../metadata'

const parser = MdParser()
const src = '# Test'
const finding = getFile('finding.md')

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

    it('should render a div.report with div.finding inside', () => {
      const html = parser.render(finding)
      expect(/^<div class="report"><div class="finding"/.test(html)).toBe(true)
    })

    it('should render a div.concert-doc if metadata but no findings', () => {
      const metadataBlock = wrapBlock('metadata', metadataToMd(REPORT_METADATA))
      const html = parser.render(metadataBlock)
      expect(/^<div class="concert-doc"/.test(html)).toBe(true)
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

    it('Should keep line breaks', () => {
      const md = src + '\n\nline 1\n\nline 2\n\nline 3\n'
      const parsed = parser.parse(md)
      const reparsed = parser.toMd(parsed)
      expect(reparsed).toBe(md)
    })

    it('Should not keep more than 2 line breaks', () => {
      const md = src + '\n\nline 1\n\nline 2\n\n\n\nline 3\n'
      const parsed = parser.parse(md)
      const reparsed = parser.toMd(parsed)
      expect(reparsed).toBe(md.replace(/\n\n\n\n/g, '\n\n'))
    })
  })

  describe('getMetadata', () => {
    const md = createNewReport()
    it('should return the docs metadata', () => {
      const metadata = parser.getMetadata(md)
      expect(metadata).toStrictEqual({ ...REPORT_METADATA, type: 'metadata' })
    })
  })
})
