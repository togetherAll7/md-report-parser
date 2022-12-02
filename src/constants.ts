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
