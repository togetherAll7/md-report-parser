import { FIELD_LABELS } from './constants'
import { camelCaseToKebab } from './utils'

const getFieldAttributes = (name: string, value: unknown) => {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  return { class: `field-${camelCaseToKebab(name)}` }
}

type TagAttributes = ArrayLike<unknown> | { [s: string]: unknown } | undefined

const isAutoClosedTag = (tag: string) => ['img', 'input'].includes(tag)

export const tag = (
  t: string,
  content?: unknown,
  attrs?: TagAttributes,
  label?: string | undefined
) => {
  if (Array.isArray(content)) {
    content = content.join('\n')
  }

  if (['boolean', 'number'].includes(typeof content)) {
    content = `${content}`
  }
  content = content || ''

  if (typeof content !== 'string') {
    throw new Error(
      `Content should be a string, (typeof content = ${typeof content})`
    )
  }
  let a = attrs
    ? Object.entries(attrs)
        .map(([n, v]) => `${n}="${v}"`)
        .join(' ')
    : ''
  if (content && content.trim().split(' ').length === 1) {
    a += ` data-value="${content.trim()}"`
  }
  return (
    `<${t} ${a} ` + (isAutoClosedTag(t) ? '/>' : `>${label || content}</${t}>`)
  )
}

export const div = (
  content?: unknown,
  attrs?: TagAttributes,
  label?: string | undefined
) => tag('div', content, attrs, label)

export const link = (
  content: unknown,
  destination: string,
  attrs?: { [s: string]: unknown },
  label?: string | undefined
) => {
  attrs = attrs || {}
  attrs['href'] = destination
  return tag('a', content, attrs, label)
}

const getFieldLabel = (
  fieldName: string,
  value: unknown
): string | undefined => {
  const labels = FIELD_LABELS[fieldName] || {}
  return value && labels ? labels[`${value}`] : undefined
}

const getFieldData = (data: any, fieldName: string) => {
  const value = `${data[fieldName]}`
  const attrs = getFieldAttributes(fieldName, value)
  const label = getFieldLabel(fieldName, data[fieldName])
  return { value, attrs, label }
}

export const getDlContent = (
  data: ArrayLike<unknown> | { [s: string]: unknown },
  dtAttrsCb?: (name: string, value: any) => TagAttributes | undefined
) =>
  Object.entries(data).map(([name, value]) => {
    const label = getFieldLabel(name, value)
    return tag(
      'div',
      `${tag('dt', name)} ${tag(
        'dd',
        value,
        dtAttrsCb ? dtAttrsCb(name, value) : undefined,
        label
      )}`,
      getFieldAttributes(name, value)
    )
  })

export const dl = (
  data: ArrayLike<unknown> | { [s: string]: unknown },
  attrs: { class: string },
  dtAttrsCb?: (name: string, value: any) => TagAttributes | undefined
) => tag('dl', getDlContent(data, dtAttrsCb), attrs)

export const table = (
  data: any[],
  fields: { [key: string]: string },
  attrs?: { class: string },
  rowAttrs?: any[],
  valueCb?: (value: any, fieldName: string, d?: any) => any
) => {
  if (!data.length) {
    return
  }

  const fieldNames = Object.keys(fields)
  const header = tag(
    'tr',
    fieldNames.map((fieldName) => {
      const { value, attrs } = getFieldData(fields, fieldName)
      return tag('th', value, attrs)
    })
  )
  const cells = data
    .map((d, i) =>
      tag(
        'tr',
        fieldNames.map((fieldName) => {
          let { value, attrs, label } = getFieldData(d, fieldName)
          value = valueCb ? valueCb(value, fieldName, d) : value
          return tag('td', value, attrs, label)
        }),
        rowAttrs ? rowAttrs[i] : undefined
      )
    )
    .join('')
  return tag('table', `${header}${cells}`, attrs)
}

interface ObjData {
  [key: string]: string
}

export const ul = (data: ObjData | string[], attrs?: TagAttributes) => {
  const isArray = Array.isArray(data)
  const values = Object.entries(data).map(([field, value]) => {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const att = isArray ? {} : { 'data-field': field }
    return { field, value, att }
  })

  return tag(
    'ul',
    values.map(({ value, att }) => tag('li', value, att)),
    attrs
  )
}
