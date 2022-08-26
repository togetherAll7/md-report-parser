import { MdParser } from '../MdParser'
import { MdDoc } from '../mdModel'
import { getFile, removeEmptyLines } from './test.helpers'

const parser = MdParser()
const { editMd } = parser
const example = getFile('example.md')
const finding = getFile('finding.md')

describe('editMd', () => {
  it('should return the MD unmodified', () => {
    const md = '# Title\n\n...\n## Subtitle\n\ntext\n```\ncode test\n```\n'
    const result = editMd(md, [])
    expect(removeEmptyLines(result)).toBe(removeEmptyLines(md))
  })

  it('should return the finding.md unmodified', () => {
    const result = editMd(finding, [])
    expect(removeEmptyLines(result)).toBe(removeEmptyLines(finding))
  })

  it('should return the example.md unmodified', () => {
    const result = editMd(example, [])

    expect(removeEmptyLines(result)).toBe(removeEmptyLines(example))
  })

  it('should modify the md', () => {
    const md = '# Title\ncontent\n'
    const modifyMd = (doc: MdDoc) => {
      doc.forEach((block) => {
        const { metadata } = block
        const { type } = metadata
        if (type === 'h1') {
          block.metadata.title += ' xxx'
        }
      })
      return doc
    }
    const result = editMd(md, [modifyMd])
    expect(result).toBe('# Title xxx\n\ncontent\n')
  })
})
