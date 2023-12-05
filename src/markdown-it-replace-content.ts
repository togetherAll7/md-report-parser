import MarkdownIt from 'markdown-it'
import StateBlock from 'markdown-it/lib/rules_block/state_block'
import {
  parsePlaceholder,
  phClose,
  phOpen,
  PlaceholderObj
} from './placeholders'
import { escapeRegExp } from './utils'

const name = 'replace_content'
const openName = `${name}_open`
const closeName = `${name}_close`
const contentName = `${name}_content`
const tag = 'div'
const openRegex = new RegExp(`^${escapeRegExp(phOpen)}`)
const closeRegex = new RegExp(`${escapeRegExp(phClose)}\\s*$`)

export interface RenderListCb {
  (md: string, placeHolderData: PlaceholderObj): string | undefined
}

/* eslint-disable @typescript-eslint/naming-convention */
export default function render_lists(
  md: MarkdownIt,
  options: { renderListCb: RenderListCb; skipKeys?: string[] }
) {
  const { renderListCb, skipKeys } = options
  const replaceContent = (
    state: StateBlock,
    startLine: number,
    endLine: number,
    silent: boolean
  ): boolean => {
    if (silent) {
      return false
    }

    let content, phStartLine, phEndLine

    const opener = state.getLines(startLine, startLine + 1, 0, false)
    if (!opener.startsWith(phOpen)) {
      return false
    }
    for (let i = startLine; i < endLine; i++) {
      const line = state.getLines(i, i + 1, 0, true)

      if (openRegex.test(line)) {
        phStartLine = i
      }

      if (closeRegex.test(line) && phStartLine !== undefined) {
        phEndLine = i
        break
      }
    }

    if (phStartLine !== undefined && phEndLine !== undefined) {
      content = state.getLines(phStartLine, phEndLine + 1, 0, true)

      const placeholderData = parsePlaceholder(content)
      const { name } = placeholderData

      if (!name || (Array.isArray(skipKeys) && skipKeys.includes(name))) {
        return false
      }

      const html = renderListCb(state.src, placeholderData) || ''

      if (undefined === html || null === html) {
        return false
      }

      let token = state.push(openName, tag, 1)
      token.block = true
      token.attrJoin('class', name)
      token = state.push(contentName, tag, 1)
      token.meta = { name, content: html }
      token = state.push(closeName, tag, -1)

      state.line = phEndLine + 1
      return true
    }

    return false
  }

  md.block.ruler.after('table', name, replaceContent)

  md.renderer.rules[contentName] = function (tokens, index) {
    const token = tokens[index]
    const { content } = token.meta
    return content || ''
  }
}
