import MarkdownIt from 'markdown-it'
import {
  default as data_blocks,
  NAME as DATA_BLOCKS
} from 'markdown-it-data-blocks'
import { getOptions, MdDoc, createMdBlock } from './mdModel'
import headerSectionsToDataBlocks from './markdown-it-headers-to-data-blocks-sections'
import Token from 'markdown-it/lib/token'
import { MdParserOptions } from './MdParser'

const { metadataBlockTypeName } = getOptions()

const isHeadingClose = ({ type }: Token) => type === 'heading_close'

const headingTokensToMd = (pos: number, tokens: Token[]) => {
  const segment = tokens.slice(pos)
  let end = segment.findIndex(isHeadingClose)
  if (end < 0) {
    end = tokens.length
  }
  const md = segment
    .slice(0, end)
    .map(({ content }) => content)
    .join('')

  return { md, end }
}

/* eslint-disable @typescript-eslint/naming-convention */
export function MdToObj(options: MdParserOptions = {}): Function {
  const { debug } = options

  const parser = new MarkdownIt('zero')
  parser.block.ruler.enable(['heading'])
  parser.use(headerSectionsToDataBlocks)
  parser.use(data_blocks, { debug })

  const isBlockDataOpeningTag = ({ type }: Token) =>
    type === `${DATA_BLOCKS}_open`

  const isBlockDataClosingTag = ({ type }: Token) =>
    type === `${DATA_BLOCKS}_close`

  /*   const isBlockDataTag = (token: Token) =>
    isBlockDataOpeningTag(token) || isBlockDataClosingTag(token) */

  const parseHeadings = (tokens: Token[]): MdDoc => {
    const result: MdDoc = []
    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i]
      const { meta, map } = token || {}
      if (isBlockDataOpeningTag(token)) {
        const segment = tokens.slice(i + 1)
        const endBlock = segment
          .slice()
          .findIndex(
            (t) =>
              isBlockDataClosingTag(t) &&
              JSON.stringify(t.map) === JSON.stringify(map)
          )
        let end = segment.findIndex(isBlockDataOpeningTag)
        if (end > endBlock || end < 0) {
          end = endBlock
        }
        const metadata = meta || {}
        const blockType = metadata.type
        const heading = headingTokensToMd(i, tokens)
        metadata.title = heading.md
        const md = segment
          .slice(heading.end, end)
          .map(({ content }) => content)
          .join('')
        const children = parseHeadings(segment.slice(end, endBlock + 1))
        const block = createMdBlock({ blockType, metadata, children, md })
        result.push(block)
        i = endBlock
      }
    }
    return result
  }

  const parse = (src: string): MdDoc => {
    const tokens = parser.parse(src, {})
    return parseHeadings(tokens)
  }

  return parse
}

export default MdToObj
