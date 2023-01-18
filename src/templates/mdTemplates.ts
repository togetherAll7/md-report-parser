import { REPORT_METADATA } from '../Reports'
import {
  FINDING_LIST,
  FINDING_RESUME,
  TXT_PLACEHOLDER,
  REPORT_HEADER
} from '../constants'
import { metadataToMd } from '../metadata'
import { wrapBlock, mdBlockToMd } from '../mdModel'
import { createFindingBlock, FINDING_MODEL } from '../Findings'

export const createFinding = () =>
  mdBlockToMd(createFindingBlock(FINDING_MODEL, true))

export const createNewReport = () => {
  const metadataBlock = wrapBlock('metadata', metadataToMd(REPORT_METADATA))
  return `
![cover](cover.svg)

${metadataBlock}

[[${REPORT_HEADER}]]

# Smart Contract Audit

[[toc]]

## Detailed Findings

${createFinding()}

## Summary of Findings

[[${FINDING_LIST}]]

## Executive Summary
 
[[${FINDING_RESUME}]]

## Disclaimer

${TXT_PLACEHOLDER}
  `
}
