
export const renderBlock = ({ metadataBlockTypeName }) => (tokens, idx, _options, env, self) => {
  const token = tokens[idx]
  let html = ''
  if (token.nesting === 1) {
    const metadata = token.meta || {}
    const className = metadata[metadataBlockTypeName]
    if (className) token.attrJoin('class', className)
    if (Object.keys(metadata).length) {
      html = `<small><pre>${JSON.stringify(metadata, null, 2)} </pre></small>`
    }
  }
  return html + self.renderToken(tokens, idx, _options, env, self)
}
