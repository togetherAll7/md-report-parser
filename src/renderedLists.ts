import { MdDoc } from './mdModel'
import { PlaceholderObj } from './placeholders'
import { renderTemplate } from './Templates'
import { FindingTemplatesOptions } from './templates/findingTemplates'

export const getRenderedLists = (
  doc: MdDoc,
  phData: PlaceholderObj,
  templatesOptions?: FindingTemplatesOptions
): string | undefined => {
  try {
    const html = renderTemplate(phData, doc, templatesOptions)
    return html
  } catch (err) {
    console.error(err)
    return ''
  }
}

export const parseRenderedLists = (
  parse: (md: string) => MdDoc,
  templatesOptions?: FindingTemplatesOptions
) => {
  return (md: string, phData: PlaceholderObj) => {
    return getRenderedLists(parse(md), phData, templatesOptions)
  }
}
