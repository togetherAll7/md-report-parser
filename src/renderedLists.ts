import { MdDoc } from './mdModel'
import { PlaceholderObj } from './placeholders'
import { renderTemplate } from './Templates'

export const getRenderedLists = (
  doc: MdDoc,
  phData: PlaceholderObj
): string | undefined => {
  try {
    const html = renderTemplate(phData, doc)
    return html
  } catch (err) {
    console.error(err)
    return ''
  }
}

export const parseRenderedLists = (parse: (md: string) => MdDoc) => {
  return (md: string, phData: PlaceholderObj) => {
    return getRenderedLists(parse(md), phData)
  }
}
