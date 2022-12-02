import MarkdownIt from 'markdown-it'
import markdown_it_wrap_document from '../markdown-it-document-wrapper'

const md = '# Test'
const cssClasses = ['one', 'test']
const cssCb = () => cssClasses

const getRegex = (tag: string) =>
  new RegExp(`^<${tag} class=\"([a-z ]*)\">(.*)<\/${tag}\>$`)

describe('markdown-it-document-wrapper', () => {
  it('should wrap html in a DIV (as default)', () => {
    const parser = new MarkdownIt().use(markdown_it_wrap_document, {
      cssCb
    })
    const html = parser.render(md).replace('\n', '')
    expect(getRegex('div').test(html)).toBe(true)
  })

  it('should wrap html in a SECTION', () => {
    const tag = 'section'
    const parser = new MarkdownIt().use(markdown_it_wrap_document, {
      tag,
      cssCb
    })
    const html = parser.render(md).replace('\n', '')
    expect(getRegex(tag).test(html)).toBe(true)
  })

  it('should add classNames to the main container', () => {
    const tag = 'div'
    const parser = new MarkdownIt().use(markdown_it_wrap_document, {
      tag,
      cssCb
    })
    const html = parser.render(md).replace('\n', '')
    const res = getRegex(tag).exec(html)
    expect(Array.isArray(res)).toBe(true)
    expect(res![2]).toBe('<h1>Test</h1>')
    expect(res![1].split(' ')).toStrictEqual(cssClasses)
  })
})
