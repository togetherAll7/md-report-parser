

const getFieldAttributes = (name, value) => { return { class: `field-${name}` } }

export const tag = (t, content, attrs) => {
  if (Array.isArray(content)) content = content.join('\n')
  if (typeof content === 'boolean') content = `${content}`
  content = content || ''
  if (typeof content !== 'string') throw new Error('Content should be a string')
  let a = attrs ? Object.entries(attrs).map(([n, v]) => `${n}="${v}"`).join(' ') : ''
  if (content.trim().split(' ').length === 1) a += ` data-value="${content.trim()}"`
  return `<${t} ${a}>${content}</${t}>`
}
export const dl = (data, attrs) => tag('dl', Object.entries(data)
  .map(([name, value]) => tag('div', `${tag('dt', name)} ${tag('dd', value)}`, getFieldAttributes(name, value))), attrs)