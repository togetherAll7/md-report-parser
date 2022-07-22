
import { dl } from '../html'
import { filterObjectFields } from '../utils'
import { findingFields } from '../Findings'

const findingRenderFields = findingFields.filter(f => !['title', 'id'].includes(f))

const findingHeader = (data: ArrayLike<unknown> | { [s: string]: unknown }) => dl(filterObjectFields(data, findingRenderFields), { class: 'finding-header' })

export default { findingHeader }
