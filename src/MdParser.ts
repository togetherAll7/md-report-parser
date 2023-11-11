import MarkdownIt from 'markdown-it'
import markdown_it_highlightjs from 'markdown-it-highlightjs'
import markdown_it_anchor from 'markdown-it-anchor'
import markdown_it_table_of_contents from 'markdown-it-table-of-contents'
import markdown_it_wrap_document from './markdown-it-document-wrapper'
import { solidity } from 'highlightjs-solidity'
import { default as data_blocks, openName } from 'markdown-it-data-blocks'
import { MetadataParser } from './metadata'
import RenderReports from './renderReports'
import { getOptions, mdDocToMd, MdDoc } from './mdModel'
import { MdToObj } from './MdToObj'
import {
  FINDING_TITLE_LEVEL,
  FINDING,
  TOC_INCLUDED_LEVELS,
  CONCERT_GENERIC_DOCUMENT,
  REPORT,
  METADATA,
  TECH_BITS
} from './constants'
import Token from 'markdown-it/lib/token'
import { default as markdown_it_replace_link } from 'markdown-it-replace-link'
import {
  default as markdown_it_replace_content,
  RenderListCb
} from './markdown-it-replace-content'
import { parseRenderedLists } from './renderedLists'
import { getDocMetadata } from './mdModel'

export type MdParserDef = {
  mdParse: Function
  render: Function
  parse: Function
  toMd: Function
  editMd: Function
  getMetadata: Function
}

export type MdParserOptions = MarkdownIt.Options & {
  debug?: boolean | undefined
  metadataCb?: Function | undefined
  replaceLink?: (link: string, env?: any) => string | undefined
  renderListCb?: RenderListCb
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

const cssCb = (tokens: Token[]) => {
  const findings = tokens.filter(
    ({ type, meta }) =>
      type === openName && meta[metadataBlockTypeName] === FINDING
  )
  if (findings.length) {
    return [REPORT]
  }
  const metadata = tokens.filter(
    ({ type, meta }) =>
      type === openName && meta[metadataBlockTypeName] === METADATA
  )
  if (metadata.length) {
    return [CONCERT_GENERIC_DOCUMENT]
  }
  return []
}

export function setupMarkdownIt(md: MarkdownIt, options: MdParserOptions = {}) {
  return md
    .use(data_blocks, getDataBlocksPluginOptions(options))
    .use(markdown_it_highlightjs, {
      register: {
        solidity,
        [TECH_BITS]: (hljs: any) => {
          return { contains: [] }
        }
      }
    })
    .use(markdown_it_anchor)
    .use(markdown_it_table_of_contents, { includeLevel: TOC_INCLUDED_LEVELS })
    .use(markdown_it_wrap_document, { cssCb })
    .use(markdown_it_replace_link, options)
    .use(markdown_it_replace_content, { ...options, skipKeys: ['toc'] })
}

/* eslint-disable @typescript-eslint/naming-convention */
export function MdParser(options: MdParserOptions = {}): MdParserDef {
  // Markdown-it instance for rendering

  const parse = MdToObj(options)

  if (!options.renderListCb) {
    options.renderListCb = parseRenderedLists(parse)
  }

  const renderer = setupMarkdownIt(new MarkdownIt(options), options)

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

  const getMetadata = (md: string) => getDocMetadata(parse(md))

  return Object.freeze({ mdParse, render, parse, toMd, editMd, getMetadata })
}

export default MdParser
