import {
  FINDING_LIST,
  FINDING_RESUME,
  FINDING_TITLE_LEVEL,
  REPORT_HEADER,
  FINDING_TABLE_STATUS_OK,
  FINDING_TABLE_STATUS_WARNING,
  FINDING_TABLE_STATUS_PROBLEM,
  LOW,
  HIGH,
  MEDIUM,
  RESOLUTION,
  STATUS,
  STATUS_OPEN,
  STATUS_FIXED,
  INFO
} from '../constants'
import { getRenderedLists } from '../renderedLists'
import { removeNewLines, getFile } from './test.helpers'
import { MdParser } from '../MdParser'
import { metadataToMd } from '../metadata'
import { wrapBlock } from '../mdModel'
import { getFindings, getRiskKey, parseFinding } from '../Findings'
import { JSDOM } from 'jsdom'
import { getFindingTitleElements } from '../renderReports'
import {
  createExampleFindings,
  createExampleReport,
  createNewReport
} from '../templates/mdTemplates'
import { STATUS_CODES } from 'http'
import exp from 'constants'

const parser = MdParser()

const title = 'test'
const md = [`# ${title}`, `[[${FINDING_LIST}]]`, `[[${FINDING_RESUME}]]`].join(
  '\n\n'
)

const doc = parser.parse(md)
const getHtml = (key: string) =>
  `<div class="${key}">${getRenderedLists(doc, key)}</div>`
const html = getHtml(FINDING_LIST) + getHtml(FINDING_RESUME)

const getExampleDom = (md: string) => {
  const html = parser.render(md)
  const dom = new JSDOM(html)
  const container = dom.window.document.body
  return { md, html, dom, container }
}

describe('mdParser replace content', () => {
  it('should replace content', () => {
    const res = parser.render(md)
    expect(removeNewLines(res)).toContain(html)
  })
})

const tesTable = (
  container: HTMLElement,
  divClassName: string,
  checkRiskOrder?: boolean
) => {
  const div = container.querySelector(`div.${divClassName}`)
  it(`should render a DIV with class ${divClassName}`, () => {
    expect(div).not.toBeNull()
    expect(div?.tagName).toBe('DIV')
  })
  const table = div?.children.item(0)

  it('should render a table inside the DIV', () => {
    expect(table).not.toBeNull()
    expect(table?.tagName).toBe('TABLE')
  })

  if (checkRiskOrder) {
    it('The table rows should be ordered by risk', () => {
      const cells = table?.querySelectorAll('td.field-risk')
      expect(cells).not.toBeUndefined()
      const risks = [...new Set([...(cells as any)].map((e) => e.textContent))]
      expect(risks.length > 0).toBe(true)
      const riskLevels = risks.map((r) => getRiskKey(r))
      expect(
        [...riskLevels].sort((a, b) => parseInt(a) - parseInt(b))
      ).toStrictEqual(riskLevels)
    })
  }

  return { div, table }
}

describe('Example', () => {
  const { container } = getExampleDom(getFile('example.md'))
  tesTable(container, FINDING_LIST, true)
  tesTable(container, FINDING_RESUME)
})

describe('Example createExampleReport()', () => {
  const { container } = getExampleDom(createExampleReport())
  tesTable(container, FINDING_RESUME)
  tesTable(container, FINDING_TABLE_STATUS_OK, true)
  tesTable(container, FINDING_TABLE_STATUS_WARNING, true)
  tesTable(container, FINDING_TABLE_STATUS_PROBLEM, true)
})

describe('Example createNewReport()', () => {
  const findings = createExampleFindings([
    { impact: LOW, likelihood: LOW, resolution: STATUS_OPEN },
    { impact: LOW, likelihood: MEDIUM },
    { impact: INFO, likelihood: INFO },
    { impact: HIGH, likelihood: HIGH },
    { impact: HIGH, likelihood: HIGH, resolution: STATUS_FIXED }
  ])
  const { container } = getExampleDom(createNewReport(findings))
  tesTable(container, FINDING_RESUME)
  tesTable(container, FINDING_TABLE_STATUS_OK, true)
  tesTable(container, FINDING_TABLE_STATUS_WARNING, true)
  tesTable(container, FINDING_TABLE_STATUS_PROBLEM, true)
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
  it('should render finding titles', () => {
    const { md, container } = getExampleDom(getFile('example.md'))
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
