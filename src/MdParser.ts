import MarkdownIt from 'markdown-it'
import markdown_it_highlightjs from 'markdown-it-highlightjs'
import markdown_it_anchor from 'markdown-it-anchor'
import markdown_it_table_of_contents from 'markdown-it-table-of-contents'
import { solidity } from 'highlightjs-solidity'
import { default as data_blocks } from 'markdown-it-data-blocks'
import { MetadataParser } from './metadata'
import RenderReports from './renderReports'
import { getOptions, mdDocToMd, MdDoc } from './mdModel'
import { MdToObj } from './MdToObj'
import { FINDING_TITLE_LEVEL } from './constants'

export type MdParserDef = {
  mdParse: Function
  render: Function
  parse: Function
  toMd: Function
  editMd: Function
}

export type MdParserOptions = MarkdownIt.Options & {
  debug?: boolean | undefined
  metadataCb?: Function | undefined
}

const { metadataBlockTypeName } = getOptions()
const titleLevel = FINDING_TITLE_LEVEL

export const getDataBlocksPluginOptions = (options: MdParserOptions) => {
  const { debug, metadataCb } = options
  const metadataParser = MetadataParser({ metadataCb })
  return {
    ...RenderReports({ metadataBlockTypeName }),
    metadataParser,
    debug,
    titleLevel
  }
}

/* eslint-disable @typescript-eslint/naming-convention */
export function MdParser(options: MdParserOptions = {}): MdParserDef {
  // Markdown-it instance for rendering
  const renderer = new MarkdownIt(options)
    .use(data_blocks, getDataBlocksPluginOptions(options))
    .use(markdown_it_highlightjs, { register: { solidity } })
    .use(markdown_it_anchor)
    .use(markdown_it_table_of_contents, { includeLevel: [2, 3, 4, 5, 6] })

  const parse = MdToObj(options)

  const render = (src: string) => renderer.render(src)

  const mdParse = (src: string) => {
    return renderer.parse(src, {})
  }

  const toMd = (doc: MdDoc) => mdDocToMd(doc)

  const editMd = (md: string, cbs: Function[]): string => {
    let doc = parse(md)
    cbs.forEach((cb) => {
      doc = cb(doc)
    })
    return toMd(doc)
  }

  return Object.freeze({ mdParse, render, parse, toMd, editMd })
}

export default MdParser
