import MarkdownIt from 'markdown-it'
import StateCore from 'markdown-it/lib/rules_core/state_core'
import Token from 'markdown-it/lib/token'

const name = 'document_wrapper'
const openName = `${name}_open`
const closeName = `${name}_close`

const isOpenToken = (token: Token): boolean => token.type === openName
const isCloseToken = (token: Token): boolean => token.type === closeName

type Options = {
  cssCb: Function | undefined
  tag: string
}
/* eslint-disable @typescript-eslint/naming-convention */
export default function document_wrapper(
  md: MarkdownIt,
  options: Options = { cssCb: undefined, tag: 'div' }
) {
  options.tag = options.tag || 'div'
  const { cssCb, tag } = options

  const wrapDocument = (state: StateCore) => {
    if (!cssCb || !tag) {
      return
    }
    const tokens = state.tokens
    const opened = isOpenToken(tokens[0])
    const closed = isCloseToken(tokens[tokens.length - 1])
    if (opened && closed) {
      return
    }
    const cssClassNames = cssCb(tokens) || []
    if (!cssClassNames.length) {
      return
    }

    if (!opened) {
      const token = new Token(openName, tag, 1)
      cssClassNames.forEach((className: string) =>
        token.attrJoin('class', className)
      )
      tokens.unshift(token)
    }

    if (!closed) {
      tokens.push(new Token(closeName, tag, -1))
    }
  }
  md.core.ruler.push(name, wrapDocument)
}
