import {
  createFindingTemplates,
  FindingTemplatesOptions
} from './templates/findingTemplates'
import { REVERSE_FIELDS } from './constants'
import { PlaceholderObj } from './placeholders'

export type TemplateParts = {
  name: string
  fields: string[] | undefined
  sort: string[] | undefined
}

export const sortData = (data: any, sort: string[], valueCb?: Function) => {
  let [field] = sort
  let sortOrder = 1
  if (field[0] === REVERSE_FIELDS) {
    sortOrder = -1
    field = field.slice(1)
  }

  if (!data.sort) {
    return data
  }
  const getFieldValue = (d: any, field: string) => {
    return typeof valueCb === 'function' ? valueCb(d, field) : d[field]
  }
  return data.sort((a: { [key: string]: any }, b: { [key: string]: any }) => {
    let result = 0
    const aValue = getFieldValue(a, field)
    const bValue = getFieldValue(b, field)
    if (aValue < bValue) {
      result = -1
    } else if (aValue > bValue) {
      result = 1
    }
    return result * sortOrder
  })
}

export const renderTemplate = (
  phData: PlaceholderObj,
  data: any,
  options?: FindingTemplatesOptions
) => {
  const templates = createFindingTemplates(options)
  const { name, sort, fields } = phData
  const template = templates[name as keyof typeof templates]
  if (!template) {
    throw new Error(`Unknown template: ${name}`)
  }
  return template(data, fields, sort) || ''
}
