import { MdDoc } from './mdModel'
import { renderTemplate } from './Templates'

export const getRenderedLists = (
  doc: MdDoc,
  name: string
): string | undefined => {
  try {
    const html = renderTemplate(name, doc)
    return html
  } catch (err) {
    console.error(err)
    return ''
  }
}

export const parseRenderedLists = (parse: (md: string) => MdDoc) => {
  return (md: string, name: string) => getRenderedLists(parse(md), name)
}
