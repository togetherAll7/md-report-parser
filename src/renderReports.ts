import { renderTemplate } from './Templates'
import Renderer from 'markdown-it/lib/renderer'
import {
  isFindingType,
  getFindingFieldValue,
  getFindingWrapperId
} from './Findings'
import { FINDING_HEADER, TITLE_SEPARATOR } from './constants'
import { camelCaseToKebab } from './utils'
import StateBlock from 'markdown-it/lib/rules_block/state_block'

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
      const { risk, likelihood, impact, remediation, condition, status, id } =
        metadata
      if (className) {
        token.attrJoin('class', `${className}`)
      }

      token.attrJoin('id', getFindingWrapperId(id))
      const fields: any = {
        risk,
        likelihood,
        impact,
        remediation,
        condition,
        status
      }
      for (const field in fields) {
        const value = getFindingFieldValue(field, fields[field])
        if (value) {
          token.attrJoin(`data-${camelCaseToKebab(field)}`, `${value}`)
        }
      }
    }
    return self.renderToken(tokens, idx, _options)
  }

  const getFindingTitle = (id: string, title: string): string =>
    `${id} ${TITLE_SEPARATOR} ${title}`

  const titleCb = (metadata: { [x: string]: any; title?: any; id?: any }) => {
    let { title, id } = metadata
    title = title || ''
    return isFindingType(getClassName(metadata))
      ? getFindingTitle(id, title)
      : title
  }

  const createTitle = (
    {
      state,
      title,
      titleLevel
    }: {
      state: StateBlock
      title: string
      titleLevel: number
    },
    metadata: { [key: string]: any }
  ) => {
    const isFinding = isFindingType(getClassName(metadata))
    let token = state.push('heading_open', `h${titleLevel}`, 1)
    token.markup = '#'.repeat(titleLevel)
    const { id } = metadata as any
    if (id) {
      token.attrSet('id', id)
    }
    token = state.push('inline', '', 0)
    token.content = isFinding ? getFindingTitle(id, title) : `${title}`
    token.children = []

    token = state.push('heading_close', `h${titleLevel}`, -1)
    token.markup = '#'.repeat(titleLevel)
  }
  // Remove createTitle here to use deafult markdown-it-data-block function
  return { render, metadataRenderer, createTitle }
}

export default RenderReports
