import { parseOptions } from 'markdown-it-data-blocks'
import { metadataToMd } from './metadata'
import { HEADINGS } from './constants'

export const getOptions = () => parseOptions()

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

export const mdBlockToMd = (block: MdBlock): string => {
  const { blockType, metadata, children, md } = createMdBlock(block)
  const { openMarkup, closeMarkup } = getOptions()
  const child = children?.map((ch) => mdBlockToMd(ch)).join('\n')
  let resultMd = [md, child]
  if (HEADINGS.includes(blockType)) {
    const markup = '#'.repeat(parseInt(blockType.replace('h', '')))
    const title = metadata.title || ''
    resultMd = [`${markup} ${title}`, ...resultMd]
  } else {
    resultMd = [
      `${openMarkup} ${blockType}`,
      metadataToMd(metadata),
      ...resultMd,
      `${closeMarkup}`
    ]
  }
  return resultMd.filter((x) => x).join('\n')
}

export const mdDocToMd = (doc: MdDoc): string =>
  doc.map((block) => mdBlockToMd(block)).join('\n')
