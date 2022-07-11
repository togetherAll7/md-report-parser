import * as  MarkdownIt from 'markdown-it'
import yaml from 'yaml'
import * as markdown_it_highlightjs from 'markdown-it-highlightjs'
import markdown_it_anchor from 'markdown-it-anchor'
import * as markdown_it_table_of_contents from 'markdown-it-table-of-contents'
import { solidity } from 'highlightjs-solidity'
import data_blocks from 'markdown-it-data-blocks'

const metadataParser = yaml.parse

const dataBlocksOptions = { metadataParser, debug: true }

export function MdParser (options = {}) {
  const markdown = new MarkdownIt(options)
    .use(data_blocks, dataBlocksOptions)
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

