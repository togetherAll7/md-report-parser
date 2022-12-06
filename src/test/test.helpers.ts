import fs from 'fs'
import path from 'path'

export const getFile = (fileName: string) =>
  fs.readFileSync(path.resolve(__dirname, `./${fileName}`)).toString()

/**
 *  NOTE: The md -> md converter doesn't honor the empty lines.
 *  It could be an issue
 */
export const removeEmptyLines = (str: string) =>
  str
    .split('\n')
    .filter((x) => x)
    .join('\n')

export const removeNewLines = (str: string) =>
  str.replace(/\r?\n|\r/g, '').trim()

export const removeWhiteSpace = (str: string) => str.replace(/\s/g, '')
