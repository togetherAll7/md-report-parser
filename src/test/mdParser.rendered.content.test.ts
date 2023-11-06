import {
  FINDING_LIST,
  FINDING_RESUME,
  FINDING_TITLE_LEVEL,
  REPORT_HEADER,
  TITLE_SEPARATOR
} from '../constants'
import { getRenderedLists } from '../renderedLists'
import { removeNewLines, getFile } from './test.helpers'
import { MdParser } from '../MdParser'
import { metadataToMd } from '../metadata'
import { wrapBlock } from '../mdModel'
import { getFindings } from '../Findings'
import { JSDOM } from 'jsdom'
import { getFindingTitleElements } from '../renderReports'

const parser = MdParser()

const title = 'test'
const md = [`# ${title}`, `[[${FINDING_LIST}]]`, `[[${FINDING_RESUME}]]`].join(
  '\n\n'
)

const doc = parser.parse(md)
const getHtml = (key: string) =>
  `<div class="${key}">${getRenderedLists(doc, key)}</div>`
const html = getHtml(FINDING_LIST) + getHtml(FINDING_RESUME)

describe('mdParser replace content', () => {
  it('should replace content', () => {
    const res = parser.render(md)
    expect(removeNewLines(res)).toContain(html)
  })

  it('example', async () => {
    const md = await getFile('example.md')
    const html = removeNewLines(parser.render(md))
    expect(html).toContain(`div class="${FINDING_LIST}"><table`)
    expect(html).toContain(`div class="${FINDING_RESUME}"><table`)
  })
})

describe('mdParser report header, doc metadata', () => {
  const metadata: { [key: string]: any } = {
    customerName: 'customer name',
    date: Date.now()
  }
  const md = `
${wrapBlock('metadata', metadataToMd(metadata))}

[[${REPORT_HEADER}]]`

  it('should render the report header', () => {
    const html = removeNewLines(parser.render(md))
    expect(html).toContain('<div class="report-header')
    for (const m in metadata) {
      expect(html).toContain(`li data-field="${m}"`)
    }
  })
})

describe('Render findings title', () => {
  it('should render finding titles', async () => {
    const md = await getFile('example.md')
    const html = parser.render(md)
    const dom = new JSDOM(html)
    const container = dom.window.document.body
    const findings = getFindings(parser.parse(md))
    for (const finding of findings) {
      const { id } = finding
      const fields = Object.entries(getFindingTitleElements(finding))
      const fTitle = container.querySelector(`#${id}`)
      expect(container).not.toBeNull()
      expect(fTitle).not.toBeNull()
      expect(fTitle?.tagName).toBe(`H${FINDING_TITLE_LEVEL}`)
      const elements = fTitle?.querySelectorAll('span')
      expect(elements?.length).not.toBeUndefined()
      expect(elements!.length >= fields.length).toBe(true)
      for (let k in fields) {
        const [key, value] = fields[k]
        const e = elements?.item(parseInt(k))
        expect(e?.textContent).toBe(value)
        expect(e?.getAttribute('class')).toBe(`title-${key}`)
      }
    }
  })
})
