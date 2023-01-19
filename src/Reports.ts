import {
  CUSTOMER_NAME,
  REPORT_TYPE,
  SMART_CONTRACT_AUDIT_KEY,
  PRODUCT_NAME,
  REPORT_DATE,
  REPORT_VERSION,
  CUSTOMER_NAME_PLACEHOLDER,
  PRODUCT_NAME_PLACEHOLDER
} from './constants'

import { getReportDate } from './utils'

export const REPORT_METADATA = {
  [CUSTOMER_NAME]: CUSTOMER_NAME_PLACEHOLDER,
  [REPORT_TYPE]: SMART_CONTRACT_AUDIT_KEY,
  [PRODUCT_NAME]: PRODUCT_NAME_PLACEHOLDER,
  [REPORT_DATE]: getReportDate(),
  [REPORT_VERSION]: 'v0001'
}
