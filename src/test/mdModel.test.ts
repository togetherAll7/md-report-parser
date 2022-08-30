import {
  mdBlockToMd,
  getOptions,
  MdBlock,
  createMdBlock,
  mdDocToMd,
  isMdBlock,
  isMdDoc,
  sortBlocks,
  iterateBlocks,
  MdDoc
} from '../mdModel'
import { findingModel } from '../Findings'
import { metadataToMd } from '../metadata'
import { FINDING } from '../constants'
import { arrayUnique } from '../utils'
import { removeEmptyLines } from './test.helpers'

const { openMarkup, closeMarkup } = getOptions()

const reduceResult = (arr: MdDoc) =>
  arrayUnique(arr.map(({ blockType }) => blockType))

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
        '',
        closeMarkup,
        ''
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
      expect(removeEmptyLines(result)).toBe(removeEmptyLines(expected))
    })
  })

  describe.skip('mdDocToMd', () => {
    // Write test
  })

  const createBlocks = (a: any[]) =>
    a.map((blockType: string) => createMdBlock({ blockType, metadata: {} }))

  describe('sortBlocks', () => {
    const blocks = createBlocks(['c', 'd', 'a', 'b'])

    const [b1, b2] = blocks

    b1.children = createBlocks(['c', 'b', 'd', 'a'])
    b2.children = createBlocks(['a', 'c', 'b', 'd'])

    const sortCb = (a: MdBlock, b: MdBlock) => {
      if (a.blockType > b.blockType) {
        return 1
      }
      if (a.blockType < b.blockType) {
        return -1
      }
      return 0
    }

    it('should sort objects and children', () => {
      const sorted = sortBlocks([...blocks], sortCb)
      const expected = ['a', 'b', 'c', 'd']
      expect(reduceResult(sorted)).toStrictEqual(expected)
      expect(reduceResult(b1.children as MdDoc)).toStrictEqual(expected)
      expect(reduceResult(b2.children as MdDoc)).toStrictEqual(expected)
    })

    it('should sort AND filter', () => {
      const filterCb = (a: MdBlock, b: MdBlock) =>
        a.metadata.sort && b.metadata.sort
      const key = 2

      blocks[key].children = createBlocks(['a', 'c', 'b', 'd']).map((x) => {
        x.metadata.sort = true
        return x
      })

      const sorted = sortBlocks([...blocks], sortCb, filterCb)

      const expected = ['a', 'b', 'c', 'd']
      const result = reduceResult(sorted[2].children as MdDoc)
      expect(result).toStrictEqual(expected)
    })
  })

  describe.skip('iterateBlocks', () => {
    const blocks = createBlocks(['c', 'd', 'a', 'b'])
    const test = 'test'
    const newBlocks = iterateBlocks(blocks, (block: MdBlock) => {
      block.metadata.test = 'test'
      return block
    })
    expect(blocks.map(({ metadata }) => metadata.test)).toStrictEqual(
      blocks.map(() => test)
    )
  })
})
