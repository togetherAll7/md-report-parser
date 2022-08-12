import yaml from 'yaml'
import { parseFinding, isFindingType } from './Findings'

export const parseMetadata = (str: string) => yaml.parse(str)

export const metadataToMd = (metadata: {}): string => yaml.stringify(metadata)

export const validateMetadata = (
  metadata: string | { impact: any; likelihood: any } | undefined,
  type: any
) => {
  if (typeof metadata !== 'object') {
    return metadata
  }

  if (isFindingType(type)) {
    metadata = parseFinding(metadata)
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
