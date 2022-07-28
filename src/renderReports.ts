import { renderTemplate } from './Templates'
import Renderer from 'markdown-it/lib/renderer'
// import Token from 'markdown-it/lib/token'
// import StateBlock from 'markdown-it/lib/rules_block/state_block'
// import MarkdownIt from 'markdown-it'

/* eslint-disable @typescript-eslint/naming-convention */
export function RenderReports({
  metadataBlockTypeName
}: {
  metadataBlockTypeName: string
}) {
  const metadataRenderer: Renderer.RenderRule = (
    tokens,
    idx,
    _options,
    env,
    self
  ) => {
    const token = tokens[idx]
    const metadata = token.meta || {}
    const className = metadata[metadataBlockTypeName]
    return className === 'finding'
      ? renderTemplate('findingHeader', metadata)
      : ''
  }

  const render: Renderer.RenderRule = (tokens, idx, _options, env, self) => {
    const token = tokens[idx]
    if (token.nesting === 1) {
      const metadata = token.meta || {}
      const className = metadata[metadataBlockTypeName]
      if (className) {
        token.attrJoin('class', `${className}`)
      }
    }
    return self.renderToken(tokens, idx, _options)
  }

  const titleCb = (metadata: { [x: string]: any; title?: any; id?: any }) => {
    let { title, id } = metadata
    title = title || ''
    const className = metadata[metadataBlockTypeName]
    return className === 'finding' ? `${id} - ${title}` : title
  }

  return { render, metadataRenderer, titleCb }
}

export default RenderReports
