import { renderTemplate } from './Templates'
import Renderer from 'markdown-it/lib/renderer'
import { isFindingType } from './Findings'

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
    return isFindingType(className)
      ? renderTemplate('findingHeader', metadata)
      : ''
  }

  const getClassName = (metadata: any) => metadata[metadataBlockTypeName]

  const render: Renderer.RenderRule = (tokens, idx, _options, env, self) => {
    const token = tokens[idx]
    if (token.nesting === 1) {
      const metadata = token.meta || {}
      const className = getClassName(metadata)
      if (className) {
        token.attrJoin('class', `${className}`)
      }
    }
    return self.renderToken(tokens, idx, _options)
  }

  const titleCb = (metadata: { [x: string]: any; title?: any; id?: any }) => {
    let { title, id } = metadata
    title = title || ''
    return isFindingType(getClassName(metadata)) ? `${id} - ${title}` : title
  }

  return { render, metadataRenderer, titleCb }
}

export default RenderReports
