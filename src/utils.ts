export const flipObject = (obj: {
  [s: string]: any
}): { [k: string]: string } => {
  return Object.entries(obj).reduce((v: { [k: string]: string }, a) => {
    const [key, value] = a
    v[value] = key
    return v
  }, {})
}

export const filterObjectFields = (
  data: { [s: string]: any },
  fields: string | string[]
) =>
  Object.entries(data)
    .filter(([field]) => fields.includes(field))
    .reduce((v: { [k: string]: string }, [field, value]) => {
      v[field] = value
      return v
    }, {})

export const arrayUnique = (arr: any[]) =>
  arr.filter((v, i, self) => self.indexOf(v) === i)

export const camelCaseToKebab = (str: string) =>
  str
    .replace(/((?<=[a-z\d])[A-Z]|(?<=[A-Z\d])[A-Z](?=[a-z]))/g, '-$1')
    .toLowerCase()

export const camelCaseToText = (str: string) =>
  str.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())

export const toCamelCase = (str: string) => {
  return str
    .toLowerCase()
    .replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function (match, index) {
      if (+match === 0) {
        return '' // or if (/\s+/.test(match)) for white spaces
      }
      return index === 0 ? match.toLowerCase() : match.toUpperCase()
    })
}

export const getMonthName = (d: Date) =>
  d.toLocaleString('default', { month: 'long' })

export const getReportDate = (d?: Date) => {
  d = d || new Date()
  return `${getMonthName(d)} ${d.getFullYear()}`
}

export const escapeHtml = (str: string): string => {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export const containsHtml = (str: string): boolean => {
  const htmlRegExp = /<[^>]*>/g // Matches any character between '<' and '>'
  return htmlRegExp.test(str)
}
