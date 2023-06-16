import exp from 'constants'
import { table, tag, ul, dl } from '../html'
import { removeWhiteSpace } from './test.helpers'

const clear = (s: string) => s.replace(/ /g, '').replace(/\n/g, '')

describe('html', () => {
  describe('tag', () => {
    it('should render a div', () => {
      const content = 'test content'
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const attrs: any = { class: 'testClass', 'data-test': 'test data' }
      const html = tag('div', content, attrs)
      expect(html).toContain('<div')
      for (const a in attrs) {
        expect(html).toContain(`${a}="${attrs[a]}"`)
      }
    })

    it('should autoclose tags', () => {
      const tags: string[] = ['img', 'input']
      for (const t of tags) {
        expect(tag(t)).toBe(`<${t}  />`)
      }
    })
  })

  describe('ul', () => {
    it('should render a list from an array', () => {
      const data = ['foo', 'bar', 'baz']
      const html = ul(data)
      const expected = `<ul  >${data
        .map((d) => `<li data-value="${d}" >${d}</li>`)
        .join('')}</ul>`
      expect(clear(html)).toBe(clear(expected))
    })

    it('should render a list from an object', () => {
      const data = { foo: 'FOO', bar: 'BAR', baz: 'BAZ' }
      const html = ul(data)
      const expected = `<ul  >${Object.entries(data)
        .map(
          ([field, value]) =>
            `<li  data-field="${field}" data-value="${value}">${value}</li>`
        )
        .join('')}</ul>`
      expect(clear(html)).toBe(clear(expected))
    })
  })

  describe('table', () => {
    const A: string = 'a'
    const B: string = 'b'
    const fields = { [A]: 'foo', [B]: 'bar' }
    const data = [{ [A]: 'test_a', [B]: 'test_b' }]
    const html = table(data, fields)
    const expected =
      '<table >' +
      '<tr>' +
      `<th  class="field-${A}"  data-value="${fields[A]}">${fields[A]}</th>` +
      `<th  class="field-${B}" data-value="${fields[B]}">${fields[B]}</th>` +
      '</tr>' +
      '<tr>' +
      `<td class="field-${A}" data-value="${data[0][A]}">${data[0][A]}</td>` +
      `<td class="field-${B}" data-value="${data[0][B]}">${data[0][B]}</td>` +
      '</tr>' +
      '</table>'

    it('should rended a table', () => {
      expect(removeWhiteSpace(`${html}`)).toBe(removeWhiteSpace(expected))
    })
  })

  describe('dl', () => {
    const getClass = (name: any, value: any) => `${name}--${value}`
    const attrsCb = (name: string, value: any) => {
      return { class: getClass(name, value) }
    }
    const data = { a: 1, b: 2, c: 3 }
    const html = dl(data, { class: 'test' }).replaceAll('  ', ' ')
    it('should start with a dl tag', () => {
      const startTag = '<dl'

      expect(html.substring(0, startTag.length)).toBe(startTag)
    })
    it('should close a dl tag', () => {
      const endTag = '</dl>'
      expect(html.substring(html.length - endTag.length, html.length)).toBe(
        endTag
      )
    })

    it('should render every data element', () => {
      for (let [key, value] of Object.entries(data)) {
        expect(html.includes(`<dt data-value="${key}`)).toBe(true)
        expect(html.includes(`<dd data-value="${value}`)).toBe(true)
      }
    })

    it('should add elements attributtes', () => {
      const html = dl(data, { class: 'test' }, attrsCb).replaceAll('  ', ' ')
      for (let [key, value] of Object.entries(data)) {
        expect(html.includes(`class="${getClass(key, value)}"`)).toBe(true)
      }
    })
  })
})
