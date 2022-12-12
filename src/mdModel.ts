import { parseOptions } from 'markdown-it-data-blocks'
import { metadataToMd } from './metadata'
import { HEADINGS } from './constants'
import { arrayUnique } from './utils'

export const getOptions = () => parseOptions()

export const isHeadingType = (type: string) => HEADINGS.includes(type)

export type MdBlock = {
  blockType: string
  metadata: { [key: string]: any }
  children?: MdBlock[]
  md?: string
}

export type MdDoc = MdBlock[]

export const createMdBlock = ({
  blockType,
  metadata,
  children,
  md
}: MdBlock): MdBlock => {
  children = children || []
  metadata = metadata || {}
  md = md || ''
  return { blockType, metadata, children, md }
}

export const isMdBlock = (x: any): boolean => {
  if (!x) {
    return false
  }
  const { blockType, children } = x as MdBlock
  if (!blockType) {
    return false
  }
  return children && children.length ? isMdBlockArr(children) : true
}

export function isMdBlockArr(arr: any | undefined[]) {
  const result = arrayUnique(arr.map((c: any) => isMdBlock(c)))
  return Array.isArray(result) && result.length === 1 && result[0] === true
}

export const isMdDoc = (x: any | undefined[]) => isMdBlockArr(x)

export const wrapBlock = (blockType: string, content: string) => {
  if (!blockType) {
    throw new Error('Missing blockType')
  }
  const { openMarkup, closeMarkup } = getOptions()
  return [
    `${openMarkup} ${blockType}`,
    `${content}`,
    `${closeMarkup}`,
    ''
  ].join('\n')
}

export const mdBlockToMd = (block: MdBlock): string => {
  const { blockType, metadata, children, md } = createMdBlock(block)
  let resultMd = [md]
  if (children?.length) {
    resultMd.push(children?.map((ch) => mdBlockToMd(ch)).join('\n') || '')
  }
  if (isHeadingType(blockType)) {
    const markup = '#'.repeat(parseInt(blockType.replace('h', '')))
    const title = metadata.title || ''
    resultMd = [`${markup} ${title}`, '', ...resultMd]
  } else {
    delete metadata.type
    resultMd = [
      wrapBlock(blockType, [metadataToMd(metadata), ...resultMd].join('\n'))
    ]
  }
  return resultMd.join('\n')
}

export const mdDocToMd = (doc: MdDoc): string =>
  doc.map((block) => mdBlockToMd(block)).join('\n')

interface ArraySortCallback<TypeOne> {
  (param1: TypeOne, param2: TypeOne): number
}

interface FilterCallback<TypeOne> {
  (param1: TypeOne, param2: TypeOne): boolean
}

export const sortBlocks = (
  doc: MdDoc,
  sortCb: ArraySortCallback<MdBlock>,
  filterCb?: FilterCallback<MdBlock>
): MdDoc => {
  doc.sort((a, b) => {
    if (!isMdBlock(a) || !isMdBlock(b)) {
      return 0
    }
    if (typeof filterCb === 'function' && filterCb(a, b) !== true) {
      return 0
    }
    return sortCb(a, b)
  })
  doc.forEach((block) => {
    if (block.children) {
      block.children = sortBlocks(block.children, sortCb, filterCb)
    }
  })
  return doc
}

export const iterateBlocks = (doc: MdDoc, cb: Function) => {
  doc.forEach((block) => {
    if (!isMdBlock(block)) {
      return
    }
    block = cb(block)
    if (block && block.children) {
      block.children = iterateBlocks(block.children, cb)
    }
  })
  return doc
}
