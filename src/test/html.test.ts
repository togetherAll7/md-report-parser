import { CLASS_NAMES } from '../constants'
import { table, tag, ul, dl, link, divLabel, ulField } from '../html'
import { camelCaseToKebab } from '../utils'
import { removeWhiteSpace } from './test.helpers'
import { getDom } from './test.helpers'

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

  describe('link', () => {
    const content = 'test'
    const dest = 'http://test.com'
    const attrs = { class: 'test-class' }
    const label = 'test-label'

    it('should render a link', () => {
      const expected = `<a href="${dest}" data-value="${content}" >${content}</a>`
      expect(link(content, dest)).toBe(expected)
    })

    it('should render a link with label', () => {
      const expected = `<a href="${dest}" data-value="${content}" >${label}</a>`
      expect(link(content, dest, undefined, label)).toBe(expected)
    })

    it('should render a link with attributes', () => {
      const expected = `<a class="${attrs.class}" href="${dest}" data-value="${content}" >${content}</a>`
      expect(link(content, dest, attrs)).toBe(expected)
    })
  })

  const testLabel = (theDiv: HTMLElement | undefined, title: string) => {
    if (!theDiv) {
      throw new Error('theDiv is undefined')
    }

    it('the div should contains the title', () => {
      expect(theDiv.textContent).toBe(title)
    })
    it(`The div should have the class: ${CLASS_NAMES.label}`, () => {
      expect(theDiv.getAttribute('class')).toBe(CLASS_NAMES.label)
    })
  }

  describe('divLabel', () => {
    const title = 'test title'
    const html = divLabel(title)
    const { body } = getDom(html)
    const divs = body.querySelectorAll('div')
    it('should render only one div', () => {
      expect(divs).not.toBeUndefined()
      expect(divs.length).toBe(1)
    })
    const theDiv = divs.item(0)
    testLabel(theDiv, title)
  })

  const testUlField = (myFieldData: string | string[]) => {
    const fieldName = 'myField'
    const data = { [fieldName]: myFieldData }
    const html = ulField(data, 'myField')
    const { body } = getDom(html)
    const className = `field-${camelCaseToKebab(fieldName)}`
    const fieldDiv = body.querySelector(`.${className}`)
    it(`should render a div with class ${className}`, () => {
      expect(fieldDiv).not.toBeUndefined()
      expect(fieldDiv?.tagName).toBe('DIV')
    })
    const theUl = fieldDiv?.querySelector('ul')
    it('the container div should have a UL', () => {
      expect(theUl).not.toBeUndefined()
    })

    const labelDiv = fieldDiv?.querySelectorAll('div')
    expect(labelDiv).not.toBeUndefined()
    testLabel(labelDiv?.item(0), fieldName)
    const values = Array.isArray(myFieldData) ? myFieldData : [myFieldData]
    it('the  UL should cointain all value elements', () => {
      const liS = theUl?.querySelectorAll('li')
      expect(liS).not.toBeUndefined()
      expect(liS?.length).toBe(values.length)

      for (const k in values) {
        const l = liS?.item(parseInt(k))
        expect(l?.textContent).toBe(values[k])
      }
    })
  }

  describe('ulField from array', () => {
    testUlField(['foo', 'bar', 'baz'])
  })

  describe('ulField from string', () => {
    testUlField('testvalue')
  })
})
