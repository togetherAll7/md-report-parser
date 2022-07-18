
import { dl } from '../src/html'
import { filterObjectFields } from '../src/utils'
import { findingFields } from '../src/Findings'

const findingRenderFields = findingFields.filter(f => f !== 'title')
const findingHeader = (data) => dl(filterObjectFields(data, findingRenderFields), { class: 'finding-header' })

export default { findingHeader }
