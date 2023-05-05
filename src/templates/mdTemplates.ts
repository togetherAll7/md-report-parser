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
import { createFindingBlock, FINDING_MODEL } from '../Findings'

export const createFinding = () =>
  mdBlockToMd(createFindingBlock(FINDING_MODEL, true))

export const createNewReport = () => {
  const metadataBlock = wrapBlock('metadata', metadataToMd(REPORT_METADATA))
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

${createFinding()}

## Disclaimer

${TXT_PLACEHOLDER}

## Appendix

### File hashes

${CODE_MARK}${TECH_BITS}
1234567890abcdef1234567890abcdef12345678 contracts/MyContract.sol
${CODE_MARK}
`
}
