import { renderTemplate } from './Templates'


export function RenderReports ({ metadataBlockTypeName }) {

  const metadataRenderer = (tokens, idx, _options, env, self) => {
    const token = tokens[idx]
    const metadata = token.content || {}
    const className = metadata[metadataBlockTypeName]
    return className === 'finding' ? renderTemplate('findingHeader', metadata) : ''
  }

  const render = (tokens, idx, _options, env, self) => {
    const token = tokens[idx]
    if (token.nesting === 1) {
      const metadata = token.meta || {}
      const className = metadata[metadataBlockTypeName]
      if (className) token.attrJoin('class', `${className}`)
    }
    return self.renderToken(tokens, idx, _options, env, self)
  }

  const titleCb = (metadata) => {
    let { title, id } = metadata
    title = title || ''
    const className = metadata[metadataBlockTypeName]
    return className === 'finding' ? `${id} - ${title}` : title
  }

  return { render, metadataRenderer, titleCb }
}

export default RenderReports
