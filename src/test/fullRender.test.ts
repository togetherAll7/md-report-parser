import MdParser from '../MdParser'
import { getFile, removeNewLines, removeWhiteSpace } from './test.helpers'

describe('render a full sample html', () => {
  const parser = MdParser()

  it('should generate an exact html', async () => {
    const md = getFile('full-example.md')
    const x = parser.render(md)
    console.log(x)
    const html = removeWhiteSpace(removeNewLines(parser.render(md)))
    const expected = removeWhiteSpace(
      removeNewLines(await getFile('full-example.html'))
    )
    expect(html).toBe(expected)
  })
})
