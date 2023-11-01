import MdParser from '../MdParser'
import {
  getFile,
  removeNewLines,
  removeWhiteSpace,
  saveFile
} from './test.helpers'

describe('render a full sample html', () => {
  const parser = MdParser()

  it('should generate an exact html', async () => {
    const md = getFile('full-example.md')
    // saveFile('htmlTmp.html', parser.render(md))
    const html = removeWhiteSpace(removeNewLines(parser.render(md)))
    const expected = removeWhiteSpace(
      removeNewLines(await getFile('full-example.html'))
    )
    expect(html).toBe(expected)
  })
})
