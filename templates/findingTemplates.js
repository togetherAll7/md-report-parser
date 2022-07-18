
import { dl } from '../src/html'
import { filterObjectFields } from '../src/utils'
import { findingFields } from '../src/Findings'

const findingRenderFields = findingFields.filter(f => !['title', 'id'].includes(f))

const findingHeader = (data) => dl(filterObjectFields(data, findingRenderFields), { class: 'finding-header' })

export default { findingHeader }
