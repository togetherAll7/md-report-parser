
export const tag = (t, content, attrs) => {
  if (Array.isArray(content)) content = content.join('\n')
  content = content || ''
  if (typeof content !== 'string') throw new Error('Content should be a string')
  const a = attrs ? Object.entries(attrs).map(([n, v]) => `${n}="${v}"`).join(' ') : ''
  return `<${t} ${a}>${content}</${t}>`
}
export const dl = (data, attrs) => tag('dl', Object.entries(data).map(([name, value]) => `${tag('dt', name)} ${tag('dd', value)}`), attrs)