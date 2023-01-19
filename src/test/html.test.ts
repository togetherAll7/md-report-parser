import { table, tag, ul } from '../html'
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
})
