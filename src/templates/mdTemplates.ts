import { REPORT_METADATA } from '../Reports'
import {
  FINDING_LIST,
  FINDING_RESUME,
  TXT_PLACEHOLDER,
  REPORT_HEADER,
  CODE_MARK,
  TECH_BITS
} from '../constants'
import { metadataToMd } from '../metadata'
import { wrapBlock, mdBlockToMd } from '../mdModel'
import {
  createFindingBlock,
  FINDING_MODEL,
  createFindigsExampleMetadata,
  type FindingMetadata
} from '../Findings'

export const createFinding = (model?: any) => {
  model = model || FINDING_MODEL
  return mdBlockToMd(createFindingBlock(model, true))
}

export const createExampleFindings = (meta: FindingMetadata[]): any[] => {
  return meta.map((metadata) => {
    const { impact, likelihood, resolution } = metadata
    const title = `Example finding ${impact} ${likelihood} ${resolution}`
    return createFinding(Object.assign(metadata, { title }))
  })
}

export const createNewReport = (reportFindings?: any[]): string => {
  const metadataBlock = wrapBlock('metadata', metadataToMd(REPORT_METADATA))
  const findings = reportFindings || [createFinding()]
  return `
${metadataBlock}

[[${REPORT_HEADER}]]

# Smart Contract Audit

[[toc]]

## Summary of Findings

[[${FINDING_LIST}]]

## Executive Summary
 
[[${FINDING_RESUME}]]

## Detailed Findings

${findings.join('\n')}

## Disclaimer

${TXT_PLACEHOLDER}

## Appendix

### File hashes

${CODE_MARK}${TECH_BITS}
1234567890abcdef1234567890abcdef12345678 contracts/MyContract.sol
${CODE_MARK}
`
}

export const createExampleReport = () =>
  createNewReport(createExampleFindings(createFindigsExampleMetadata()))
