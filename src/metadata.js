import yaml from 'yaml'
import { calculateTotalRisk } from './Findings'


const parseMetadata = (str) => {
  try {
    return yaml.parse(str)
  } catch (err) {
    return {}
  }
}

const validateMetadata = (metadata, type) => {
  switch (type) {
    case 'finding':
      metadata = Object.assign({ ...metadata }, calculateTotalRisk(metadata))
      break
  }
  return metadata
}

export const metadataParser = (str, { blockType }) => validateMetadata(parseMetadata(str), blockType)
