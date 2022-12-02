import { FINDING_LIST, FINDING_RESUME } from './constants'

export const getRenderedLists = (
  md: string,
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
