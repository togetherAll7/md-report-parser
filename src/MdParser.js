import MarkdownIt from 'markdown-it'
import markdown_it_highlightjs from 'markdown-it-highlightjs'
import markdown_it_anchor from 'markdown-it-anchor'
import markdown_it_table_of_contents from 'markdown-it-table-of-contents'
import { solidity } from 'highlightjs-solidity'
import { default as data_blocks, parseOptions } from 'markdown-it-data-blocks'
import { metadataParser } from './metadata'
import { renderBlock, renderMetadata } from './renderReports'


const debug = true
const { metadataBlockTypeName } = parseOptions()

export function MdParser (options = {}) {
  const dbo = { metadataBlockTypeName }
  const markdown = new MarkdownIt(options)
    .use(data_blocks, { metadataParser, debug, render: renderBlock(dbo), metadataRenderer: renderMetadata(dbo) })
    .use(markdown_it_highlightjs, { register: { solidity } })
    .use(markdown_it_anchor)
    .use(markdown_it_table_of_contents, { includeLevel: [2, 3, 4, 5, 6] })
  const render = src => markdown.render(src)
  const parse = (src, env = {}) => {
    return markdown.parse(src, env)
  }
  return Object.freeze({ parse, render })
}

export default MdParser

