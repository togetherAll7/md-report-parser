export const CRITICAL = 'critical'
export const HIGH = 'high'
export const MEDIUM = 'medium'
export const LOW = 'low'
export const INFO = 'info'
export const ZERO = 'zero'
export const NONE = '_'
export const FINDING = 'finding'

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
