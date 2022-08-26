import { StructuredType } from 'typescript'
import yaml from 'yaml'
import { parseFinding, isFindingType, FindingMetadata } from './Findings'
import { LOW } from './constants'

export const parseMetadata = (str: string) => yaml.parse(str)

export const metadataToMd = (metadata: {}): string => yaml.stringify(metadata)

export type Metadata = {
  impact?: any
  likelihood?: any
  title?: string
  location?: string
}

export const validateMetadata = (
  metadata: string | Metadata | undefined,
  type: any
) => {
  if (typeof metadata !== 'object') {
    return metadata || {}
  }

  if (isFindingType(type)) {
    const { impact, likelihood } = metadata
    metadata.impact = impact || LOW
    metadata.likelihood = likelihood || LOW
    metadata = parseFinding(metadata as FindingMetadata)
  }
  return metadata
}
/* eslint-disable @typescript-eslint/naming-convention */
export const MetadataParser =
  (data: { metadataCb?: any } = {}) =>
  (str: string, { blockType }: any) => {
    let { metadataCb } = data
    const metadata = validateMetadata(parseMetadata(str), blockType)
    if (typeof metadataCb === 'function') {
      metadataCb(JSON.parse(JSON.stringify(metadata)))
    }
    return metadata
  }
