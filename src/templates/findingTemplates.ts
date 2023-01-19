import {
  CUSTOMER_NAME,
  FINDING_HEADER,
  FINDING_LIST,
  FINDING_RESUME,
  PRODUCT_NAME,
  REPORT_DATE,
  REPORT_HEADER,
  REPORT_TYPE,
  REPORT_VERSION
} from '../constants'
import { logo } from '../templates/logo'
import { dl, table, tag, ul } from '../html'
import { filterObjectFields } from '../utils'
import {
  findingFields,
  getFindings,
  FINDING_LIST_TITLES,
  getFindingResumeData,
  FINDING_RESUME_TITLES
} from '../Findings'
import { MdDoc, getDocMetadata } from '../mdModel'

const findingRenderFields = findingFields.filter(
  (f) => !['title', 'id'].includes(f)
)

const renderReportHeader = (doc: MdDoc) => {
  const metadata = getDocMetadata(doc)
  const footerData = [REPORT_VERSION, CUSTOMER_NAME, REPORT_DATE].reduce(
    (v: { [key: string]: string }, a) => {
      v[a] = metadata[a]
      return v
    },
    {}
  )
  return (
    tag('div', logo.content, {
      class: 'logo'
    }) +
    tag('div', metadata[PRODUCT_NAME], { class: 'title' }) +
    tag('div', metadata[REPORT_TYPE], { class: 'subtitle' }) +
    tag('div', ul(footerData), { class: 'foot' })
  )
}

export default {
  [FINDING_HEADER]: (data: ArrayLike<unknown> | { [s: string]: unknown }) =>
    dl(filterObjectFields(data, findingRenderFields), {
      class: 'finding-header'
    }),

  [FINDING_LIST]: (doc: MdDoc) => {
    const { id, title, totalRisk, fixed } = FINDING_LIST_TITLES
    return table(getFindings(doc), { id, title, totalRisk, fixed })
  },

  [FINDING_RESUME]: (doc: MdDoc) => {
    console.log(getFindingResumeData(getFindings(doc)))
    return table(getFindingResumeData(getFindings(doc)), FINDING_RESUME_TITLES)
  },

  [REPORT_HEADER]: (doc: MdDoc) => renderReportHeader(doc)
}
