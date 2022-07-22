import MarkdownIt from 'markdown-it'
import markdown_it_highlightjs from 'markdown-it-highlightjs'
import markdown_it_anchor from 'markdown-it-anchor'
import markdown_it_table_of_contents from 'markdown-it-table-of-contents'
import { solidity } from 'highlightjs-solidity'
import { default as data_blocks, parseOptions } from 'markdown-it-data-blocks'
import { MetadataParser } from './metadata'
import RenderReports from './renderReports'


const { metadataBlockTypeName } = parseOptions()

export function MdParser (options :  MarkdownIt.Options & {debug? : any, metadataCb?: any} = {}) {

  const { debug, metadataCb } = options
  const metadataParser = MetadataParser({ metadataCb })

  const markdown = new MarkdownIt(options)
    .use(data_blocks, { ...RenderReports({ metadataBlockTypeName }), metadataParser, debug })
    .use(markdown_it_highlightjs, { register: { solidity } })
    .use(markdown_it_anchor)
    .use(markdown_it_table_of_contents, { includeLevel: [2, 3, 4, 5, 6] })
  const render = (src: any) => markdown.render(src)
  const parse = (src: any) => {
    return markdown.parse(src, {})
  }
  return Object.freeze({ parse, render })
}

export default MdParser

