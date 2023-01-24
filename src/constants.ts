export const CRITICAL = 'critical'
export const HIGH = 'high'
export const MEDIUM = 'medium'
export const LOW = 'low'
export const INFO = 'info'
export const ZERO = 'zero'
export const NONE = '_'
export const FINDING = 'finding'
export const FINDING_ID_SEPARATOR = '-'
export const FINDING_ID_PREFIX_MIN_LENGTH = 3
export const FINDING_ID_DEFAULT_PREFIX = 'ISSUE'
export const FINDING_ID_ZERO_PADDING = 3
export const FINDING_TITLE_LEVEL = 3
export const FINDING_SECTIONS = ['Description', 'Recommendation', 'Status']
export const TXT_PLACEHOLDER = '[...]'
export const TOTAL_RISK = 'totalRisk'
export const ID = 'id'
export const IMACT_RATE = 'impactRate'
export const TITLE = 'title'
export const TOTAL = 'total'
export const NOT_FIXED = 'notFixed'
export const PARTIALLY_FIXED = 'partiallyFixed'
export const OPEN = 'open'
export const FIXED_PERCENT = 'fixedPercent'
export const REPORTED = 'reported'

export const LIKELIHOOD_RATE = 'likelihoodRate'
export const RISK_RATE = 'riskRate'
export const FIXED = 'fixed'
export const LOCATION = 'location'
export const IMPACT = {
  [NONE]: 0,
  [LOW]: 1,
  [MEDIUM]: 2,
  [HIGH]: 3
}

export const LIKELIHOOD = { ...IMPACT }
/* eslint-disable @typescript-eslint/naming-convention */
export const RISK = {
  0: INFO,
  1: LOW,
  2: MEDIUM,
  3: HIGH
}

export const HEADINGS = [...Array(6)].map((x, i) => `h${i}`)

export const FINDING_LIST = 'finding-list'
export const FINDING_RESUME = 'finding-resume'
export const FINDING_HEADER = 'findingHeader'

export const CUSTOMER_NAME = 'customerName'
export const REPORT_TYPE = 'reportType'
export const SMART_CONTRACT_AUDIT_KEY = 'smartContractAudit'

export const REPORT_HEADER = 'report-header'

export const PRODUCT_NAME = 'productName'
export const REPORT_DATE = 'date'
export const REPORT_VERSION = 'version'
export const PRODUCT_NAME_PLACEHOLDER = 'PRODUCT_NAME'
export const CUSTOMER_NAME_PLACEHOLDER = 'CUSTOMER_NAME'
export const COVER_FILE = 'cover-file'
export const COVER_FILE_NAME = 'cover.svg'
