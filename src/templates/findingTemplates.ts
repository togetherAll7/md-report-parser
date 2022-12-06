import { FINDING_HEADER, FINDING_LIST, FINDING_RESUME } from '../constants'
import { dl } from '../html'
import { filterObjectFields } from '../utils'
import { findingFields } from '../Findings'
import * as pug from 'pug'
import path from 'path'

const findingRenderFields = findingFields.filter(
  (f) => !['title', 'id'].includes(f)
)

const getTemplate = (name: string) => path.join(__dirname, name)
const renderPug = (name: string, data: any) =>
  pug.renderFile(getTemplate(name), data)

export default {
  [FINDING_HEADER]: (data: ArrayLike<unknown> | { [s: string]: unknown }) =>
    dl(filterObjectFields(data, findingRenderFields), {
      class: 'finding-header'
    }),

  [FINDING_LIST]: (data: ArrayLike<unknown>) =>
    renderPug('findingList.pug', data),

  [FINDING_RESUME]: (data: ArrayLike<unknown>) =>
    renderPug('findingResume.pug', data)
}
