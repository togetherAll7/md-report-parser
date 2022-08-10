import MarkdownIt from 'markdown-it'
import markdown_it_highlightjs from 'markdown-it-highlightjs'
import markdown_it_anchor from 'markdown-it-anchor'
import markdown_it_table_of_contents from 'markdown-it-table-of-contents'
import { solidity } from 'highlightjs-solidity'
import { default as data_blocks } from 'markdown-it-data-blocks'
import { MetadataParser } from './metadata'
import RenderReports from './renderReports'
import { getOptions, mdDocToMd, MdDoc, createMdBlock } from './mdModel'
import { MdToObj } from './MdToObj'

export type MdParserDef = {
  mdParse: Function
  render: Function
  parse: Function
  toMd: Function
}

export type MdParserOptions = MarkdownIt.Options & {
  debug?: any
  metadataCb?: any
}

const { metadataBlockTypeName } = getOptions()

/* eslint-disable @typescript-eslint/naming-convention */
export function MdParser(options: MdParserOptions = {}): MdParserDef {
  const { debug, metadataCb } = options
  const metadataParser = MetadataParser({ metadataCb })

  // Markdown-it instance for rendering
  const renderer = new MarkdownIt(options)
    .use(data_blocks, {
      ...RenderReports({ metadataBlockTypeName }),
      metadataParser,
      debug
    })
    .use(markdown_it_highlightjs, { register: { solidity } })
    .use(markdown_it_anchor)
    .use(markdown_it_table_of_contents, { includeLevel: [2, 3, 4, 5, 6] })

  const parse = MdToObj(options)

  const render = (src: string) => renderer.render(src)

  const mdParse = (src: string) => {
    return renderer.parse(src, {})
  }

  const toMd = (data: MdDoc) => mdDocToMd(data)

  return Object.freeze({ mdParse, render, parse, toMd })
}

export default MdParser
