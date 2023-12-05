import MarkdownIt from 'markdown-it'
/* eslint-disable @typescript-eslint/naming-convention */
import { default as markdown_it_render_lists } from '../markdown-it-replace-content'
import { removeNewLines } from './test.helpers'
import { PlaceholderObj, createPlaceHolder, wrapPh } from '../placeholders'
import { getDom } from './test.helpers'

const title = 'Title'
const name = 'my-list'
const md = `# ${title}\n${wrapPh(name)}\n`

describe('markdown_it_replace_content', () => {
  it('should replace a placeholder with rendered dontent [[single-line]]', () => {
    const createHtml = (md: string, name: string | undefined) =>
      `<span>${removeNewLines(md + name)}<span>`

    const renderListCb = (str: string, { name }: PlaceholderObj) => {
      return createHtml(str, name)
    }

    const parser = new MarkdownIt().use(markdown_it_render_lists, {
      renderListCb
    })
    const res = removeNewLines(parser.render(md))
    expect(res).toBe(
      `<h1>${title}</h1><div class="${name}">${createHtml(md, name)}</div>`
    )
  })

  it('should replace a placeholder with rendered content ', () => {
    const createHtml = (md: string, phData: PlaceholderObj) => {
      return `<dl>${Object.entries(phData)
        .map(([key, value]) => `<dt>${key}</dt><dd>${value}`)
        .join('')}<dd>`
    }

    const renderListCb = (str: string, phData: PlaceholderObj) => {
      return createHtml(str, phData)
    }
    const parser = new MarkdownIt().use(markdown_it_render_lists, {
      renderListCb
    })
    const name = 'test-placeholder'
    const title = 'Test Title'
    const subTitle = 'Test Subtitle'
    const a = 123
    const phData = { name, a }
    const md = `# ${title}\n${createPlaceHolder(phData)}\n ## ${subTitle}`

    const html = parser.render(md)
    const { body } = getDom(html)
    expect(body).not.toBeUndefined()
    const tit = body.querySelector('h1')
    expect(tit).not.toBeUndefined()
    expect(tit?.textContent).toBe(title)
    const div = body.querySelector(`.${name}`)
    expect(div).not.toBeUndefined()
    expect(div?.tagName).toBe('DIV')
    const list = div?.querySelector('DL')
    expect(list).not.toBeUndefined()
    expect(list).not.toBeNull()
    expect(list?.children).not.toBeUndefined()
    expect(list?.children.item(0)?.tagName).toBe('DT')
    expect(list?.children.item(0)?.textContent).toBe('name')
    expect(list?.children.item(1)?.tagName).toBe('DD')
    expect(list?.children.item(1)?.textContent).toBe(`${name}`)
    expect(list?.children.item(2)?.tagName).toBe('DT')
    expect(list?.children.item(2)?.textContent).toBe('a')
    expect(list?.children.item(3)?.tagName).toBe('DD')
    expect(list?.children.item(3)?.textContent).toBe(`${a}`)
    const st = body.querySelector('h2')
    expect(st).not.toBeUndefined()
    expect(st?.textContent).toBe(subTitle)
  })
})
