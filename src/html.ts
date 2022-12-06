const getFieldAttributes = (name: string, value: unknown) => {
  return { class: `field-${name}` }
}

export const tag = (
  t: string,
  content: unknown,
  attrs?: ArrayLike<unknown> | { [s: string]: unknown } | undefined
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
  if (content.trim().split(' ').length === 1) {
    a += ` data-value="${content.trim()}"`
  }
  return `<${t} ${a}>${content}</${t}>`
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

export const table = (
  data: any[],
  fields: { [key: string]: string },
  attrs?: { class: string }
) => {
  if (!data.length) {
    return
  }

  const fieldNames = Object.keys(fields)
  const header = tag(
    'tr',
    fieldNames.map((fieldName) => tag('th', `${fields[fieldName]}`))
  )
  const cells = data
    .map((d) =>
      tag(
        'tr',
        fieldNames.map((fieldName) => tag('td', d[fieldName]))
      )
    )
    .join('')
  return tag('table', `${header}${cells}`, attrs)
}
