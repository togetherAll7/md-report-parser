import MdParser from '../MdParser'
import { REPORT_HEADER } from '../constants'
import { createPlaceHolder } from '../placeholders'
import { getDom } from './test.helpers'
import * as svg from '../templates/svg/index'

const getSvgContent = (svg: string) =>
  getDom(`<div>${svg}</div>`).body.querySelector('div')?.innerHTML

describe('Render report header', () => {
  const placeholder = createPlaceHolder(REPORT_HEADER)

  it('should render a report header', () => {
    const header = MdParser().render(placeholder)
    const { body } = getDom(header)
    const hContainer = body.querySelector('.report-header')
    expect(hContainer).not.toBeUndefined()
    expect(hContainer?.tagName).toBe('DIV')
    const logoCont = hContainer?.querySelector('.logo')
    expect(logoCont).not.toBeUndefined()
    expect(logoCont?.tagName).toBe('DIV')
    expect(logoCont?.innerHTML).toBe(getSvgContent(svg.logo))
  })

  it('should render a report header with different logo', () => {
    const logo = svg.statusProblem
    const header = MdParser({ templatesOptions: { svg: { logo } } }).render(
      placeholder
    )
    const { body } = getDom(header)
    const hContainer = body.querySelector('.report-header')
    expect(hContainer).not.toBeUndefined()
    expect(hContainer?.tagName).toBe('DIV')
    const logoCont = hContainer?.querySelector('.logo')
    expect(logoCont).not.toBeUndefined()
    expect(logoCont?.tagName).toBe('DIV')
    expect(logoCont?.innerHTML).toBe(getSvgContent(logo))
  })
})
