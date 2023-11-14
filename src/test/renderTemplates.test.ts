import templates from '../templates/'
import { JSDOM } from 'jsdom'
import { parseFinding } from '../Findings'
import {
  FINDING_HEADER,
  HIGH,
  LOW,
  FH_COL,
  FH_ROW,
  FINDING_TABLE
} from '../constants'
import { MdToObj } from '../MdToObj'
import { getFile } from './test.helpers'

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

  const html = templates[FINDING_TABLE](doc, ['id', 'risk', 'title'])
  const dom = new JSDOM(html)
  const body = dom.window.document.body
  it('dummy', () => {
    expect(typeof html).toBe('string')
  })
})
