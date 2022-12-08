import { FINDING_HEADER, FINDING_LIST, FINDING_RESUME } from '../constants'
import { dl, table } from '../html'
import { filterObjectFields } from '../utils'
import {
  findingFields,
  getFindings,
  FINDING_LIST_TITLES,
  getFindingResumeData,
  FINDING_RESUME_TITLES
} from '../Findings'
import { MdDoc } from '../mdModel'

const findingRenderFields = findingFields.filter(
  (f) => !['title', 'id'].includes(f)
)

export default {
  [FINDING_HEADER]: (data: ArrayLike<unknown> | { [s: string]: unknown }) =>
    dl(filterObjectFields(data, findingRenderFields), {
      class: 'finding-header'
    }),

  [FINDING_LIST]: (doc: MdDoc) => table(getFindings(doc), FINDING_LIST_TITLES),

  [FINDING_RESUME]: (doc: MdDoc) =>
    table(getFindingResumeData(getFindings(doc)), FINDING_RESUME_TITLES)
}
