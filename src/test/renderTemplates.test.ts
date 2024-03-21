import { createFindingTemplates } from '../templates/findingTemplates'
import { JSDOM } from 'jsdom'
import {
  parseFinding,
  createFindigsExampleMetadata,
  FINDING_RESUME_STATUS_RISK,
  FINDING_RESUME_STATUS_STATUS
} from '../Findings'
import {
  FINDING_HEADER,
  HIGH,
  LOW,
  FH_COL,
  FH_ROW,
  FINDING_TABLE,
  FINDING_RESUME_STATUS
} from '../constants'
import { MdToObj } from '../MdToObj'
import { getFile } from './test.helpers'
import {
  createExampleReport,
  createExampleFindings
} from '../templates/mdTemplates'

const templates = createFindingTemplates()

const getDom = (html: string) => {
  const dom = new JSDOM(html)
  const body = dom.window.document.body
  return { dom, body }
}

describe('FINDING_HEADER', () => {
  const id = 'FXC-001'
  const impact = HIGH
  const likelihood = LOW
  const title = 'Test Finding'

  const location = ['/foo/bar/baz', '/var/test.sol', '/tmp/tmp.sol']
  const f = parseFinding({ impact, likelihood, id, location, title })
  const html = templates[FINDING_HEADER](f)
  const dom = new JSDOM(html)
  const body = dom.window.document.body
  const container = body.querySelector(`.${FINDING_HEADER}`)

  it('should render a finding header container', () => {
    expect(container).not.toBeUndefined()
  })
  const rows = container?.querySelectorAll(`.${FH_ROW}`)
  it('should render a finding header rows', () => {
    // rows
    expect(rows).not.toBeUndefined()
    expect(rows?.length).toBe(2)
  })
  const rowA = rows?.item(0).querySelectorAll(`.${FH_COL}`)
  it('should render a finding row', () => {
    // row 1

    expect(rowA).not.toBeUndefined()
    expect(rowA?.length).toBe(2)
  })

  // colA
  const colA = rowA?.item(0)
  it('should render the first column A content', () => {
    const colADls = colA?.querySelectorAll('dl')
    expect(colADls).not.toBeUndefined()
    expect(colADls?.length).toBe(1)
  })

  // colB
  const colB = rowA?.item(1)
  it('should render the first column B content', () => {
    const colBDls = colA?.querySelectorAll('dl')
    expect(colBDls).not.toBeUndefined()
    expect(colBDls?.length).toBe(1)
  })

  // row 2
  const rowB = rows?.item(1).querySelectorAll('ul')
  it('should render a finding row', () => {
    expect(rowB).not.toBeUndefined()
    expect(rowB?.length).toBe(1)
  })

  // location
  const locationContainer = rows?.item(1).querySelector('.field-location')
  it('should render the finding location', () => {
    expect(locationContainer).not.toBeUndefined()
    expect(locationContainer?.tagName).toBe('DIV')
    const list = locationContainer?.querySelector('ul')
    expect(list).not.toBeUndefined()
    const liS = list?.querySelectorAll('li')
    expect(liS).not.toBeUndefined()
  })
})

describe('FINDINGS_TABLE', () => {
  const parse = MdToObj()
  const example = getFile('example.md')
  const doc = parse(example)

  it('dummy test', () => {
    const html = templates[FINDING_TABLE](doc, ['id', 'risk', 'title'])
    expect(html).not.toBeUndefined()
    expect(typeof html).toBe('string')
    const { body } = getDom(`${html}`)
    expect(body).not.toBeUndefined()
  })
})

const testDiv = (container: HTMLElement, name: string) => {
  it(`Cell should contain a div.${name}`, () => {
    const div = container.querySelector('.label')
    expect(div).not.toBeUndefined()
    expect(div?.tagName).toBe('DIV')
  })
}

const testResumeCell = (cell: HTMLElement) => {
  testDiv(cell, 'label')
  testDiv(cell, 'value')
}

describe('FINDING_RESUME_STATUS', () => {
  const findings = createExampleFindings(createFindigsExampleMetadata())
  const md = `${findings.join('\n')}\n[[${FINDING_RESUME_STATUS}]]`
  const doc = MdToObj()(md)
  const html = templates[FINDING_RESUME_STATUS](doc)
  const { body } = getDom(`${html}`)
  const dataRows = FINDING_RESUME_STATUS_RISK.length
  const totalColumns = FINDING_RESUME_STATUS_STATUS.length
  const totalRows = dataRows + 1
  const totalCells = dataRows * totalColumns
  const resume = body.querySelector('table')

  it('the HTML should not contain undefined strings', () => {
    expect(html?.indexOf('undefined')).toBe(-1)
  })

  it('should render a finding status resume', () => {
    expect(html).not.toBeUndefined()
    expect(typeof html).toBe('string')
    expect(body).not.toBeUndefined()
    const tables = body.querySelectorAll('table')
    expect(tables).not.toBeUndefined()
    expect(tables.length).toBe(1)

    expect(resume?.tagName).toBe('TABLE')
    const rows = resume?.querySelectorAll('tr')
    expect(rows?.length).toBe(totalRows)
  })

  const ths = resume?.querySelectorAll('th')

  it(`should render ${totalColumns} title cells`, () => {
    expect(ths).not.toBeUndefined()
    expect(ths?.length).toBe(totalColumns)
  })

  const cells = resume?.querySelectorAll('td')

  it(`should render ${totalCells} cells`, () => {
    expect(cells).not.toBeUndefined()
    expect(cells?.length).toBe(totalCells)
  })

  describe('Test cells', () => {
    cells?.forEach(testResumeCell)
  })
})
