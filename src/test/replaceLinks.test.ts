import { MdParser } from '../MdParser'

const prepLink = 'TEST'

const replaceLink = (link: string): string => {
  return `${prepLink}${link}`
}
const parser = MdParser({ replaceLink })

const links = {
  firstLink: 'http://test.com',
  name: '/test.html',
  otherLink: '123'
}

describe('Replace links', () => {
  for (const [name, link] of Object.entries(links)) {
    it(`should replace the link target [${name}]`, () => {
      const md = `[${name}](${link})`
      const html = parser.render(md)
      const expected = `<p><a href="${prepLink}${link}">${name}</a></p>\n`
      expect(html).toBe(expected)
    })
  }
})
