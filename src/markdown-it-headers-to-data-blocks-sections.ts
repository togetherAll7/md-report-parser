import MarkdownIt from 'markdown-it'
import StateCore from 'markdown-it/lib/rules_core/state_core'
import Token from 'markdown-it/lib/token'
import { NAME } from 'markdown-it-data-blocks'
const openName = `${NAME}_open`
const closeName = `${NAME}_close`

type Section = {
  header: number
  nesting: number
}

function headersToDataBlocksSections(md: MarkdownIt) {
  const addSections = (state: StateCore) => {
    const tokens: Token[] = [] // output
    /* eslint-disable @typescript-eslint/naming-convention */
    const Token = state.Token
    const sections: Section[] = []
    let nestedLevel = 0

    const openSection = (attrs: any | null[], meta: {}) => {
      const t = new Token(openName, 'section', 1)
      t.block = true
      t.attrs = attrs && attrs.map((attr: any) => [attr[0], attr[1]])
      t.meta = meta
      return t
    }

    const closeSection = () => {
      const t = new Token(closeName, 'section', -1)
      t.block = true
      return t
    }

    const closeSections = (section: Section) => {
      while (last(sections) && section.header <= last(sections).header) {
        sections.pop()
        tokens.push(closeSection())
      }
    }

    const closeSectionsToCurrentNesting = (nesting: number) => {
      while (last(sections) && nesting < last(sections).nesting) {
        sections.pop()
        tokens.push(closeSection())
      }
    }

    const closeAllSections = () => {
      while (sections.pop()) {
        tokens.push(closeSection())
      }
    }

    for (let i = 0, l = state.tokens.length; i < l; i++) {
      const token = state.tokens[i]

      // record level of nesting
      const { type } = token || {}
      if (type && type.search('heading') !== 0) {
        nestedLevel += token.nesting
      }
      if (last(sections) && nestedLevel < last(sections).nesting) {
        closeSectionsToCurrentNesting(nestedLevel)
      }

      // add sections before headers
      if (type === 'heading_open') {
        const section: Section = {
          header: headingLevel(token.tag),
          nesting: nestedLevel
        }
        if (last(sections) && section.header <= last(sections).header) {
          closeSections(section)
        }

        tokens.push(openSection(token.attrs, { type: token.tag }))
        if (token.attrIndex('id') !== -1) {
          // remove ID from token
          if (token.attrs) {
            token.attrs.splice(token.attrIndex('id'), 1)
          }
        }
        sections.push(section)
      }

      tokens.push(token)
    } // end for every token
    closeAllSections()

    state.tokens = tokens
  }

  md.core.ruler.push('header_sections_data_blocks', addSections)
}

function headingLevel(header: string) {
  return parseInt(header.charAt(1))
}

function last(arr: any[]) {
  return arr.slice(-1)[0]
}

export default headersToDataBlocksSections
