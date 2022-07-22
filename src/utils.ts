export const flipObject = (obj: { [s: string]: any }) : {[k:string]: string} => {
  return Object.entries(obj).reduce((v: {[k:string]: string}, a) => {
    const [key, value] = a
    v[value] = key
    return v
  }, {})
}

export const filterObjectFields = (data: { [s: string]: any}, fields: string | string[]) => Object.entries(data)
  .filter(([field]) => fields.includes(field))
  .reduce((v: {[k:string]: string }, [field, value]) => {
    v[field] = value
    return v
  }, {})

