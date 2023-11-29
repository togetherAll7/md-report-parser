import MarkdownIt from 'markdown-it'
/* eslint-disable @typescript-eslint/naming-convention */
import { default as markdown_it_render_lists } from '../markdown-it-replace-content'
import { removeNewLines } from './test.helpers'

const title = 'Title'
const name = 'my-list'
const md = `# ${title}\n[[${name}]]`
const createHtml = (md: string, key: string) =>
  `<span>${removeNewLines(md + key)}<span>`

const renderListCb = (str: string, n: string) => createHtml(str, n)

describe('markdown_it_replace_content', () => {
  it('should render a list', () => {
    const parser = new MarkdownIt().use(markdown_it_render_lists, {
      renderListCb
    })
    const res = removeNewLines(parser.render(md))
    expect(res).toBe(
      `<h1>${title}</h1><div class="${name}">${createHtml(md, name)}</div>`
    )
  })
})
