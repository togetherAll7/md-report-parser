

export const flipObject = (obj) => {
  return Object.entries(obj).reduce((v, a) => {
    const [key, value] = a
    v[value] = key
    return v
  }, {})
}