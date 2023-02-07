import { renderTemplate } from './Templates'
import Renderer from 'markdown-it/lib/renderer'
import { isFindingType } from './Findings'
import { FINDING_HEADER } from './constants'
import { camelCaseToKebab } from './utils'

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
      ? renderTemplate(FINDING_HEADER, metadata)
      : ''
  }

  const getClassName = (metadata: any) => metadata[metadataBlockTypeName]

  const render: Renderer.RenderRule = (tokens, idx, _options, env, self) => {
    const token = tokens[idx]
    if (token.nesting === 1) {
      const metadata = token.meta || {}
      const className = getClassName(metadata)
      const { risk, likelihood, impact, status, condition } = metadata
      if (className) {
        token.attrJoin('class', `${className}`)
      }

      const fields: any = { risk, likelihood, impact, status, condition }
      for (const field in fields) {
        const value = fields[field]
        if (value) {
          token.attrJoin(`data-${camelCaseToKebab(field)}`, value)
        }
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
