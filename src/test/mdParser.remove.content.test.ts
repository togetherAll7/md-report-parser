import {
  PlaceholderObj,
  createPlaceHolder,
  PLACEHOLDER_KEYS
} from '../placeholders'
import { getDom } from './test.helpers'
import MarkdownIt from 'markdown-it'
/* eslint-disable @typescript-eslint/naming-convention */
import { default as markdown_it_render_lists } from '../markdown-it-replace-content'

const data = [1, 2, 3]

const renderListCb = (md: string, phData: PlaceholderObj) => {
  const { filterG } = phData
  let d = [...data]
  if (filterG) {
    d = d.filter((x) => {
      return x > filterG
    })
  }
  return d.length ? '<ul>' + d.map((x) => `<li>${x}</li>`) + '</ul>' : ''
}

const parser = new MarkdownIt().use(markdown_it_render_lists, {
  renderListCb
})

const title = 'Main Title'
const s1 = 'Subtitle 1'
const s2 = 'Subtitle 2'
const s3 = 'Subtitle 3'
const s4 = 'Subtitle 4'
const p1 = 'This is an example text'
const p2 = 'This is an example text'
const name = 'test-placeholder'

const createMd = (ph: PlaceholderObj) =>
  `# ${title}
${p1}
## ${s1}
## ${s2}
### ${s4}
${p2}

${createPlaceHolder(ph)}

## ${s3}

`

const testPhContainer = (body: HTMLElement) => {
  const phContainer = body.querySelector(`.${name}`)
  expect(phContainer).not.toBeUndefined()
  expect(phContainer?.tagName).toBe('DIV')
  const list = phContainer?.querySelector('ul')
  expect(list).not.toBeUndefined()
  expect(list).not.toBeNull()
  return { phContainer, list }
}

describe('Md parser remove content', () => {
  it('should render full html content', () => {
    const html = parser.render(createMd({ name }))
    const { body } = getDom(html)
    const tags = [...body.children].map((x) => x.tagName)
    expect(tags).toStrictEqual(['H1', 'P', 'H2', 'H2', 'H3', 'P', 'DIV', 'H2'])
    const text = [...body.children].map((x) => x.textContent?.replace('\n', ''))
    expect(text).toStrictEqual([title, p1, s1, s2, s4, p2, data.join(','), s3])
    const { list } = testPhContainer(body)
    expect(list).not.toBeNull()
    expect(list).not.toBeUndefined()
    const liS = list?.querySelectorAll('li')
    expect(liS).not.toBeUndefined()
    const liE = liS ? [...liS] : []
    expect(liE.length).toBe(data.length)
    expect(liE.map((x) => x.textContent)).toStrictEqual(data.map((x) => `${x}`))
  })

  it('should skip render the container if the result is empty', () => {
    const html = parser.render(createMd({ name, filterG: 4 }))
    const { body } = getDom(html)
    const tags = [...body.children].map((x) => x.tagName)
    expect(tags).toStrictEqual(['H1', 'P', 'H2', 'H2', 'H3', 'P', 'H2'])
    const text = [...body.children].map((x) => x.textContent?.replace('\n', ''))
    expect(text).toStrictEqual([title, p1, s1, s2, s4, p2, s3])
  })

  const testRemoveUntil = (ru: any) => {
    const ph: PlaceholderObj = { name, filterG: 4 }
    ph[PLACEHOLDER_KEYS.removeUntil] = ru
    const html = parser.render(createMd(ph))
    const { body } = getDom(html)
    const tags = [...body.children].map((x) => x.tagName)
    const text = [...body.children].map((x) => x.textContent?.replace('\n', ''))
    return { text, tags, body }
  }

  for (let x of [true, 3, 'foo']) {
    it(`should remove the content if ${PLACEHOLDER_KEYS.removeUntil} == ${x}`, () => {
      const { text, tags } = testRemoveUntil(x)
      expect(tags).toStrictEqual(['H1', 'P', 'H2', 'H2', 'H2'])
      expect(text).toStrictEqual([title, p1, s1, s2, s3])
    })
  }

  for (let x of [false, 0, undefined, null]) {
    it(`should NOT remove the content if ${PLACEHOLDER_KEYS.removeUntil} == ${x}`, () => {
      const { text, tags } = testRemoveUntil(x)
      expect(tags).toStrictEqual(['H1', 'P', 'H2', 'H2', 'H3', 'P', 'H2'])
      expect(text).toStrictEqual([title, p1, s1, s2, s4, p2, s3])
    })
  }

  it('should remove the content to defined header', () => {
    const ph: PlaceholderObj = { name, filterG: 4 }
    ph[PLACEHOLDER_KEYS.removeUntil] = 2
    const html = parser.render(createMd(ph))
    const { body } = getDom(html)
    const tags = [...body.children].map((x) => x.tagName)
    expect(tags).toStrictEqual(['H1', 'P', 'H2', 'H2'])
    const text = [...body.children].map((x) => x.textContent?.replace('\n', ''))
    expect(text).toStrictEqual([title, p1, s1, s3])
  })
})
