import MarkdownIt from 'markdown-it'
import {
  default as data_blocks,
  NAME as DATA_BLOCKS
} from 'markdown-it-data-blocks'
import { MdDoc, createMdBlock, isHeadingType, MdBlock } from './mdModel'
import headerSectionsToDataBlocks from './markdown-it-headers-to-data-blocks-sections'
import Token from 'markdown-it/lib/token'
import { MdParserOptions, getDataBlocksPluginOptions } from './MdParser'
// const { metadataBlockTypeName } = getOptions()

const isHeadingOpen = ({ type }: Token) => type === 'heading_open'

const isHeadingClose = ({ type }: Token) => type === 'heading_close'

const isBlockDataOpeningTag = ({ type }: Token) =>
  type === `${DATA_BLOCKS}_open`

const isBlockDataClosingTag = ({ type }: Token) =>
  type === `${DATA_BLOCKS}_close`

const getEndingBlock = (token: Token, segment: Token[]) =>
  segment.findIndex(
    (t) =>
      isBlockDataClosingTag(t) &&
      t.tag === token.tag &&
      JSON.stringify(t.map) === JSON.stringify(token.map)
  )

const newLineTokens = ['paragraph_close', 'soft_break', 'heading_close']
const isNewLine = ({ type }: Token) => newLineTokens.includes(type)

const getMd = (segment: Token[], start: number, end: number): string => {
  const s = segment.slice(start, end)
  return s
    .map((t, i) => {
      let nl = isNewLine(t) ? '\n' : ''
      if (t.type === 'paragraph_close' && s[i + 1]?.type === 'paragraph_open') {
        nl += '\n'
      }
      return `${t.content}${nl}`
    })
    .join('')
}

const headingTokensToMd = (
  pos: number,
  tokens: Token[],
  open: boolean = false
) => {
  const segment = tokens.slice(pos)
  let end = segment.findIndex(open ? isHeadingOpen : isHeadingClose)
  if (end < 0) {
    end = tokens.length
  }
  const md = getMd(segment, 0, end)

  return { md, end }
}

const createParser = (options: MdParserOptions = {}) => {
  const parser = new MarkdownIt('zero')
  parser.block.ruler.enable(['heading'])
  parser.use(data_blocks, {
    ...getDataBlocksPluginOptions(options),
    wrapOnly: true
  })
  parser.use(headerSectionsToDataBlocks)

  // parser.enable('code')
  return parser
}

/* eslint-disable @typescript-eslint/naming-convention */
export function MdToObj(options: MdParserOptions = {}): (md: string) => MdDoc {
  const parser = createParser(options)

  const getTokens = (src: string) => parser.parse(src, {})

  const parseHeadings = (tokens: Token[]): MdDoc => {
    const result: MdDoc = []
    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i]
      const { meta } = token || {}

      if (isBlockDataOpeningTag(token)) {
        const blockType = meta.type
        let metadata = meta || {}
        let children: MdDoc = []
        let md = ''
        const segment = tokens.slice(i + 1)
        const endBlock = getEndingBlock(token, segment)
        let end = segment.findIndex(isBlockDataOpeningTag)
        if (end > endBlock || end < 0) {
          end = endBlock
        }

        if (!isHeadingType(blockType)) {
          // Finding blocks

          // md = token.content
          const childrenTokens = getTokens(token.content)
          md = headingTokensToMd(0, childrenTokens, true).md

          const metadataToken = segment.find(
            (t) => t.type === `${DATA_BLOCKS}_metadata_open`
          )

          if (metadataToken && metadataToken.meta) {
            metadata = metadataToken.meta
          }

          children = parseHeadings(childrenTokens)
        } else {
          // Heading blocks
          const heading = headingTokensToMd(i, tokens)
          metadata.title = heading.md
          md = getMd(segment, heading.end, end)

          const ch = segment.slice(end, endBlock + 1)
          children = ch.length > 1 ? parseHeadings(ch) : []
        }

        const block = createMdBlock({ blockType, metadata, children, md })
        result.push(block)
        i += endBlock + 1
      }
    }
    return result
  }

  const parse = (src: string): MdDoc => {
    const tokens = getTokens(src)
    return parseHeadings(tokens)
  }

  return parse
}

export default MdToObj
