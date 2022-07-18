

export const flipObject = (obj) => {
  return Object.entries(obj).reduce((v, a) => {
    const [key, value] = a
    v[value] = key
    return v
  }, {})
}

export const filterObjectFields = (data, fields) => Object.entries(data)
  .filter(([field]) => fields.includes(field))
  .reduce((v, [field, value]) => {
    v[field] = value
    return v
  }, {})

