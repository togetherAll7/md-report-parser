import {
  mdBlockToMd,
  getOptions,
  MdBlock,
  createMdBlock,
  mdDocToMd,
  isMdBlock,
  isMdDoc
} from '../mdModel'
import { findingModel } from '../Findings'
import { metadataToMd } from '../metadata'
import { FINDING } from '../constants'

const { openMarkup, closeMarkup } = getOptions()

describe('mdModel', () => {
  const blockType = FINDING
  const metadata = { ...findingModel }
  const block = { blockType: 'xxx', metadata: {} }

  describe('isMdBlock', () => {
    const test = [
      [block, true],
      [{ ...block, children: [] }, true],
      [{ ...block, children: [{}] }, false],
      [{ ...block, children: [block, {}] }, false],
      [{ ...block, children: [block] }, true],
      [{ ...block, children: [block, block] }, true],
      [{}, false],
      [{ blockType: '', metadata: {} }, false]
    ]

    for (const [t, r] of test) {
      it(`${JSON.stringify(t)} should return ${r}`, () => {
        expect(isMdBlock(t)).toBe(r)
      })
    }
  })

  describe('isMdDoc', () => {
    const test = [
      [[], false],
      [[undefined], false],
      [[block, block], true]
    ]

    for (const [t, r] of test) {
      it(`${JSON.stringify(t)}  should return ${r}`, () => {
        expect(isMdDoc(t)).toBe(r)
      })
    }
  })

  describe('createMdBlock', () => {
    it('should return a MdBlock', () => {
      expect(isMdBlock(createMdBlock({ blockType, metadata }))).toBe(true)
    })
  })

  describe('mdBlockToMd', () => {
    it('should convert a mdObj to md', () => {
      const expected = [
        `${openMarkup} ${blockType}`,
        ...metadataToMd(metadata).split('\n'),
        closeMarkup
      ].join('\n')
      expect(mdBlockToMd({ blockType, metadata })).toBe(expected)
    })

    it('should convert a mdObj to md (nested headings)', () => {
      const blocks = [
        [1, 'One', 'one **content**'],
        [2, 'Two', 'two **content**'],
        [3, 'Three', 'three **content**']
      ].map(([type, title, md]) => {
        const metadata = { title: `${title}` }
        const blockType = `h${type}`
        return {
          block: createMdBlock({ blockType, metadata, md: `${md}` }),
          blockType,
          title,
          md,
          metadata
        }
      })

      const [b1, b2, b3] = blocks
      const obj = {
        ...b1.block,
        children: [{ ...b2.block, children: [b3.block] }]
      }
      const toMdArr = ({
        metadata,
        children,
        md,
        blockType
      }: MdBlock): string[] => {
        const { title } = metadata
        const markup = '#'.repeat(parseInt(blockType.replace('h', '')))
        const chContent =
          Array.isArray(children) && children.length > 0
            ? toMdArr(children[0])
            : []
        return [`${markup} ${title}`, `${md}`, ...chContent]
      }
      const expected = toMdArr(obj).join('\n')
      const result = mdBlockToMd(obj)
      console.log({ result, expected })
      expect(result).toBe(expected)
    })
  })

  describe('mdDocToMd', () => {})
})
