import MarkdownIt from 'markdown-it'
import StateBlock from 'markdown-it/lib/rules_block/state_block'
import { parsePlaceholder, phOpen } from './placeholders'

const name = 'replace_content'
const openName = `${name}_open`
const closeName = `${name}_close`
const contentName = `${name}_content`
const tag = 'div'
const argsSeparator = '#'

export interface RenderListCb {
  (md: string, key: string): string | undefined
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
    const end = startLine + 1
    const opener = state.getLines(startLine, end, 0, false)
    if (!opener.startsWith(phOpen)) {
      return false
    }

    const { name } = parsePlaceholder(opener)
    if (!name || (Array.isArray(skipKeys) && skipKeys.includes(name))) {
      return false
    }

    const content = renderListCb(state.src, name)

    if (undefined === content || null === content) {
      return false
    }

    let token = state.push(openName, tag, 1)
    token.block = true
    token.attrJoin('class', name)
    token = state.push(contentName, tag, 1)
    token.meta = { name, content }
    token = state.push(closeName, tag, -1)

    state.line = end

    return true
  }

  md.block.ruler.after('table', name, replaceContent)

  md.renderer.rules[contentName] = function (tokens, index) {
    const token = tokens[index]
    const { content } = token.meta
    return content || ''
  }
}
