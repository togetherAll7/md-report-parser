
import templates from '../templates/index.js'

export const renderTemplate = (name, data) => {
  const template = templates[name]
  if (!template) throw new Error(`Unknown template: ${name}`)
  return template(data)
}