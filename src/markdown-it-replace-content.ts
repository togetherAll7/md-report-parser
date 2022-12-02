import MarkdownIt from 'markdown-it'
import StateBlock from 'markdown-it/lib/rules_block/state_block'

const name = 'replace_content'
const openName = `${name}_open`
const closeName = `${name}_close`
const contentName = `${name}_content`
const tag = 'div'

export const getListName = (str: string | undefined): string | undefined => {
  if (!str) {
    return
  }
  const res = /\[\[([^)]+)\]\]/.exec(str)
  return (res?.length ? res[1].trim() : undefined) || undefined
}

/* eslint-disable @typescript-eslint/naming-convention */
export default function render_lists(
  md: MarkdownIt,
  contentCB: (md: string, key: string) => string | undefined
) {
  const replaceContent = (
    state: StateBlock,
    startLine: number,
    endLine: number,
    silent: boolean
  ): boolean => {
    if (silent) {
      return false
    }
    const opener = state.getLines(startLine, startLine + 1, 0, false)
    if (opener.charCodeAt(0) !== 0x5b /* [ */) {
      return false
    }

    const name = getListName(opener)
    if (!name) {
      return false
    }
    const content = contentCB(state.src, name)

    if (!content) {
      return false
    }

    let token = state.push(openName, tag, 1)
    token.block = true
    token.attrJoin('class', name)
    token = state.push(contentName, tag, 1)
    token.meta = { name, content }
    token = state.push(closeName, tag, -1)

    state.line = endLine + 1

    return true
  }

  md.block.ruler.after('table', name, replaceContent)

  md.renderer.rules[contentName] = function (tokens, index) {
    const token = tokens[index]
    const { content } = token.meta
    return content || ''
  }
}
