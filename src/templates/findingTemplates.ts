import {
  CUSTOMER_NAME,
  FINDING_HEADER,
  FINDING_LIST,
  FINDING_RESUME,
  PRODUCT_NAME,
  REPORT_DATE,
  REPORT_HEADER,
  REPORT_TYPE,
  REPORT_VERSION,
  FH_COL,
  FH_ROW
} from '../constants'
import { logo } from '../templates/logo'
import { table, tag, ul, dl, div } from '../html'
import { filterObjectFields, toCamelCase } from '../utils'
import {
  findingFields,
  getFindings,
  FINDING_LIST_TITLES,
  getFindingResumeData,
  FINDING_RESUME_TITLES,
  FINDING_RESUME_FIELDS,
  getFindingFieldValueAttributes,
  getFindingWrapperId
} from '../Findings'
import { MdDoc, getDocMetadata } from '../mdModel'
import { link } from '../html'
import * as svg from './svg'

const findingRenderFields = findingFields.filter(
  (f) => !['title', 'id'].includes(f)
)

const linkFindingTitle = (value: any, fieldName: string, data: any) =>
  fieldName === 'title'
    ? link(value, `#${getFindingWrapperId(data.id)}`)
    : value

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
  [FINDING_HEADER]: (data: ArrayLike<unknown> | { [s: string]: unknown }) => {
    const dlAttrs = { class: 'finding-header-data' }
    const colAttrs = { class: FH_COL }
    const rowAttrs = { class: FH_ROW }

    const { status, id, title, impact, likelihood, risk, resolution } =
      data as any
    const riskData = dl(
      { impact, likelihood },
      { class: 'small' },
      getFindingFieldValueAttributes
    )
    const statusIconName = toCamelCase(`status ${status}`)
    const riskChart = svg.riskChart

    const statusIcon = (svg as { [key: string]: string })[statusIconName]

    const colA = dl(
      { status, statusIcon, resolution },
      dlAttrs,
      getFindingFieldValueAttributes
    )

    const colB = dl(
      { risk, riskChart, riskData },
      dlAttrs,
      getFindingFieldValueAttributes
    )

    const locationContent = div(
      dl(
        filterObjectFields(data, ['location']),
        dlAttrs,
        getFindingFieldValueAttributes
      ),
      rowAttrs
    )

    return div(
      div(div(colA, colAttrs) + div(colB, colAttrs), rowAttrs) +
        locationContent,
      {
        class: FINDING_HEADER
      }
    )
  },
  [FINDING_LIST]: (doc: MdDoc) => {
    const { id, title, risk, status } = FINDING_LIST_TITLES
    return table(
      getFindings(doc),
      { id, title, risk, status },
      undefined,
      undefined,
      linkFindingTitle
    )
  },

  [FINDING_RESUME]: (doc: MdDoc) => {
    const titles = FINDING_RESUME_TITLES
    const data = Object.entries(getFindingResumeData(getFindings(doc))).reduce(
      (v: any[], [status, d]) => {
        const x = Object.entries(d).reduce(
          (xv: { [key: string]: any }, [risk, value]) => {
            xv[risk] =
              tag('div', status, { class: 'label' }) +
              tag('div', value, { class: 'value' })
            return xv
          },
          {}
        )
        v.push(x)
        return v
      },
      []
    )
    return table(
      Object.values(data),
      titles,
      undefined,
      FINDING_RESUME_FIELDS.map((f) => {
        return { class: f }
      })
    )
  },

  [REPORT_HEADER]: (doc: MdDoc) => renderReportHeader(doc)
}
