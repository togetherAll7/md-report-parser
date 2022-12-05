import { FINDING_LIST, FINDING_RESUME } from './constants'
import { MdDoc } from './mdModel'

export const getRenderedLists = (
  data: any,
  name: string
): string | undefined => {
  switch (name) {
    case FINDING_LIST:
      return `<pre>${FINDING_LIST}</pre>`
      break

    case FINDING_RESUME:
      return `<pre>${FINDING_RESUME}</pre>`
      break
  }
  return
}

export const parseRenderedLists = (parse: (md: string) => MdDoc) => {
  return (md: string, name: string) => getRenderedLists(parse(md), name)
}
