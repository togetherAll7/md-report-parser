import yaml from 'yaml'
import { escapeRegExp } from './utils'

export const phOpen = '[['
export const phClose = ']]'

const phRegex = new RegExp(
  `^${escapeRegExp(phOpen)}([\\s\\S]*?)${escapeRegExp(phClose)}$`
)

export const wrapPh = (str: string) => `${phOpen}${str}${phClose}`

export type PlaceholderObj = {
  name: string | undefined
  [key: string]: any
}

export const isPlaceHolder = (str: string): boolean => {
  return phRegex.test(str)
}

export const unwrapPlaceholder = (str: string): string => {
  const res = phRegex.exec(str)
  return (res?.length ? res[1] : str) || str
}

export const parsePlaceholder = (str: string): PlaceholderObj => {
  str = str.trimEnd().trimStart()
  let res: PlaceholderObj = { name: undefined }
  if (!isPlaceHolder(str)) {
    return res
  }
  str = unwrapPlaceholder(str)
  const parsed = yaml.parse(str)
  if (typeof parsed === 'string') {
    res.name = parsed
  }
  if (typeof parsed === 'object') {
    res = { ...parsed }
  }
  return res
}

export const createPlaceHolder = (content: string | PlaceholderObj) => {
  if (typeof content !== 'string') {
    const { name } = content
    if (!name) {
      throw new Error('Place holder name is mandatory')
    }
    content = yaml.stringify(content)
  }
  return wrapPh(content)
}

export const PLACEHOLDER_KEYS = {
  removeUntil: 'removeUntil'
}
