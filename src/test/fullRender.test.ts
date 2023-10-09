import MdParser from '../MdParser'
import { getFile, removeNewLines, removeWhiteSpace } from './test.helpers'

describe('render a full sample html', () => {
  const parser = MdParser()

  it('should generate an exact html', async () => {
    const md = getFile('full-example.md')
    /*     console.log(parser.render(md))
    process.exit() */
    const html = removeWhiteSpace(removeNewLines(parser.render(md)))
    const expected = removeWhiteSpace(
      removeNewLines(await getFile('full-example.html'))
    )
    expect(html).toBe(expected)
  })
})
