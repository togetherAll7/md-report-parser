import {
  FINDING_HEADER,
  FINDING_LIST,
  FINDING_RESUME,
  REPORT_HEADER
} from '../constants'
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
  const { reportType, customerName, productName, date, version } = metadata
  return (
    tag('div', tag('img', '', { src: 'logo.svg', alt: 'logo' }), {
      class: 'logo'
    }) +
    tag('div', productName, { class: 'title' }) +
    tag('div', reportType, { class: 'subtitle' }) +
    tag('div', ul({ version, customerName, date }), { class: 'foot' })
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

  [FINDING_RESUME]: (doc: MdDoc) =>
    table(getFindingResumeData(getFindings(doc)), FINDING_RESUME_TITLES),

  [REPORT_HEADER]: (doc: MdDoc) => renderReportHeader(doc)
}
