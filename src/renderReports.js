import { renderTemplate } from './Templates'

export const renderBlock = ({ metadataBlockTypeName }) => (tokens, idx, _options, env, self) => {
  const token = tokens[idx]
  if (token.nesting === 1) {
    const metadata = token.meta || {}
    const className = metadata[metadataBlockTypeName]
    if (className) token.attrJoin('class', `${className}`)
  }
  return self.renderToken(tokens, idx, _options, env, self)
}


export const renderMetadata = ({ metadataBlockTypeName }) => (tokens, idx, _options, env, self) => {
  const token = tokens[idx]
  const metadata = token.content || {}
  const className = metadata[metadataBlockTypeName]
  return className === 'finding' ? renderTemplate('findingHeader', metadata) : ''
}