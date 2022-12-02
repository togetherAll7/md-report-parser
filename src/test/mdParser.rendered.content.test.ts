import { FINDING_LIST } from '../constants'
import { getRenderedLists } from '../renderedLists'
import { removeNewLines } from './test.helpers'
import { MdParser } from '../MdParser'
const parser = MdParser()

const title = 'test'
const md = [`# ${title}`, `[[${FINDING_LIST}]]`].join('\n')
const html = `<div class="${FINDING_LIST}">${getRenderedLists(
  md,
  FINDING_LIST
)}</div>`

describe('mdParser replace content', () => {
  it('should replace content', () => {
    const res = parser.render(md)
    expect(removeNewLines(res)).toContain(html)
  })
})
