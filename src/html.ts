const getFieldAttributes = (name: string, value: unknown) => {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  return { class: `field-${name}` }
}

type TagAttributes = ArrayLike<unknown> | { [s: string]: unknown } | undefined

const isAutoClosedTag = (tag: string) => ['img', 'input'].includes(tag)

export const tag = (t: string, content?: unknown, attrs?: TagAttributes) => {
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
  return `<${t} ${a} ` + (isAutoClosedTag(t) ? '/>' : `>${content}</${t}>`)
}
export const dl = (
  data: ArrayLike<unknown> | { [s: string]: unknown },
  attrs: { class: string }
) =>
  tag(
    'dl',
    Object.entries(data).map(([name, value]) =>
      tag(
        'div',
        `${tag('dt', name)} ${tag('dd', value)}`,
        getFieldAttributes(name, value)
      )
    ),
    attrs
  )

const getFieldData = (data: any, fieldName: string) => {
  const value = `${data[fieldName]}`
  const attrs = getFieldAttributes(fieldName, value)
  return { value, attrs }
}

export const table = (
  data: any[],
  fields: { [key: string]: string },
  attrs?: { class: string },
  rowAttrs?: any[]
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
          const { value, attrs } = getFieldData(d, fieldName)
          return tag('td', value, attrs)
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
