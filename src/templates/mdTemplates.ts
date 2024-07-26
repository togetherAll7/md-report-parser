import { REPORT_METADATA } from '../Reports'
import {
  FINDING_LIST,
  FINDING_RESUME,
  TXT_PLACEHOLDER,
  REPORT_HEADER,
  CODE_MARK,
  TECH_BITS,
  FINDING_TABLE_STATUS_PROBLEM,
  FINDING_TABLE_STATUS_WARNING,
  FINDING_TABLE_STATUS_OK,
  FINDING_STATUS_PROBLEM_TITLE,
  FINDING_STATUS_WARNING_TITLE,
  FINDING_STATUS_OK_TITLE,
  FINDING_RESUME_STATUS,
  SOURCE_CODE_AUDIT_KEY,
  SMART_CONTRACT_AUDIT_KEY
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

# Security Assessment

[[toc]]

## 1. Executive Summary

In **{MONTH} {YEAR}**, [**Client**](http://client.com) engaged [Coinspect](https://coinspect.com) 
to perform a { ${SOURCE_CODE_AUDIT_KEY} | ${SMART_CONTRACT_AUDIT_KEY} } of { PROJECT NAME }. 
The objective of the project was to evaluate the security of the application.

The { PROJECT NAME } is a ... { SHORT DESCRIPTION OF PROJECT }

[[${FINDING_RESUME_STATUS}]]

\`XXX-001\` represents the risks associated with the current storage of secrets. \'XXX-002\'...

## 2. Summary of Findings

This section provides a concise overview of all the findings in the report grouped by remediation 
status and sorted by estimated total risk.

### 2.1 ${FINDING_STATUS_PROBLEM_TITLE}

These findings indicate potential risks that require some action. They must be addressed with 
modifications to the codebase or an explicit acceptance as part of the project's 
known security risks.

[[name: ${FINDING_TABLE_STATUS_PROBLEM}
removeUntil: 3
]]

### 2.2 ${FINDING_STATUS_WARNING_TITLE}

Issues with risk in this list have been addressed to some extent but not fully mitigated. 
Any future changes to the codebase should be carefully evaluated to avoid exacerbating these 
issues or increasing their probability.

Findings with a risk of \`None\` pose no threat, but document an implicit 
assumption which must be taken into account. Once acknowledged, these are 
considered solved.

[[name: ${FINDING_TABLE_STATUS_WARNING}
removeUntil: 3
]]

### 2.3 ${FINDING_STATUS_OK_TITLE}

These issues have been fully fixed or represent recommendations that could improve the 
long-term security posture of the project.

[[name: ${FINDING_TABLE_STATUS_OK}
removeUntil: 3
]]
 
## 3. Scope 

The scope was set to be the repository at { REPOSITORY_URL } at commit { COMMIT }.

## 4. Assessment 

### 4.1 Security assumptions 

### 4.2 Decentralization 

### 4.3 Testing 

### 4.4 Code quality

## 5. Detailed Findings

${findings.join('\n')}

## 6. Disclaimer

The contents of this report are provided "as is" without warranty of any kind. 
Coinspect is not responsible for any consequences of using the information contained herein.

This report represents a point-in-time and time-boxed evaluation conducted within a specific timeframe
and scope agreed upon with the client. The assessment's findings and recommendations are based on the 
information, source code, and systems access provided by the client during the review period.

The assessment's findings should not be considered an exhaustive list of all potential security issues. 
This report does not cover out-of-scope components that may interact with the analyzed system, nor 
does it assess the operational security of the organization that developed and deployed the system.

This report does not imply ongoing security monitoring or guaranteeing the current security status of
the assessed system.  Due to the dynamic nature of information security threats, new vulnerabilities 
may emerge after the assessment period.

This report should not be considered an endorsement or disapproval of any project or team. 
It does not provide investment advice and should not be used to make investment decisions.
`
}

export const createExampleReport = () =>
  createNewReport(createExampleFindings(createFindigsExampleMetadata()))
