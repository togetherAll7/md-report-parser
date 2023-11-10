import templates from './templates/index'
import {
  TEMPLATE_FIELDS_SEPARATOR,
  TEMPLATE_PARTS_SEPARATOR,
  REVERSE_FIELDS
} from './constants'

export type TemplateParts = {
  name: string
  fields: string[] | undefined
  sort: string[] | undefined
}

const parseTemplateFields = (fields: string): string[] | undefined => {
  if (!fields) {
    return undefined
  }
  return fields.split(TEMPLATE_FIELDS_SEPARATOR)
}

export const parseTemplateName = (templateName: string): TemplateParts => {
  const [name, unparsedFields, unparsedSort] = templateName.split(
    TEMPLATE_PARTS_SEPARATOR
  )
  const fields = parseTemplateFields(unparsedFields)
  const sort = parseTemplateFields(unparsedSort)
  return { name, fields, sort }
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

export const renderTemplate = (templateName: string, data: any) => {
  const { name, fields, sort } = parseTemplateName(templateName)
  const template = templates[name as keyof typeof templates]
  if (!template) {
    throw new Error(`Unknown template: ${name}`)
  }

  return template(data, fields, sort) || ''
}
