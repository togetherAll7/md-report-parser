import yaml from 'yaml'
import { parseFinding } from './Findings'


const parseMetadata = (str) => yaml.parse(str)

const validateMetadata = (metadata, type) => {
  if (typeof metadata !== 'object') return metadata
  switch (type) {
    case 'finding':
      metadata = parseFinding(metadata)
      break
  }
  return metadata
}

export const metadataParser = (str, { blockType }) => validateMetadata(parseMetadata(str), blockType)
