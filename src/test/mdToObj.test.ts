import { MdToObj } from '../MdToObj'
import { isMdDoc, mdDocToMd } from '../mdModel'

const md =
  '# Title\nThis is a **test**\nSecond line\n## Subtitle *X*\n- one \n- two'

describe('MdToObj', () => {
  const parse = MdToObj()

  it('MdObj should return a function', () => {
    expect(typeof parse).toBe('function')
  })

  it('should convert a md to MdDoc', () => {
    const result = parse(md)
    expect(Array.isArray(result)).toBe(true)
    expect(isMdDoc(result)).toBe(true)
    expect(mdDocToMd(result)).toBe(md)
  })
})
