import MarkdownIt from 'markdown-it'
import {
  default as markdown_it_render_lists,
  getListName
} from '../markdown-it-replace-content'
import { removeNewLines } from './test.helpers'

const title = 'Title'
const name = 'my-list'
const md = `# ${title}\n[[${name}]]`
const createHtml = (md: string, key: string) =>
  `<span>${removeNewLines(md + key)}<span>`

const contentCB = (str: string, n: string) => createHtml(str, n)

describe('getListName', () => {
  it('should return the list key', () => {
    expect(getListName(undefined)).toBe(undefined)
    expect(getListName('')).toBe(undefined)
    expect(getListName('[foo]')).toBe(undefined)
    expect(getListName('[[ ]]')).toBe(undefined)
    expect(getListName('[[my-list]]')).toBe('my-list')
    expect(getListName('[[ my-list ]]')).toBe('my-list')
    expect(getListName('[[ my-list foo ]]')).toBe('my-list foo')
  })
})

describe('markdown_it_replace_content', () => {
  it('should render a list', () => {
    const parser = new MarkdownIt().use(markdown_it_render_lists, contentCB)
    const res = removeNewLines(parser.render(md))
    expect(res).toBe(
      `<h1>${title}</h1><div class="${name}">${createHtml(md, name)}</div>`
    )
  })
})
