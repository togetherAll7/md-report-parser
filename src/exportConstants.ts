import * as CONSTANTS from './constants'
import { writeFile } from 'fs/promises'
const FILE_PATH = './constants.json'

saveConstants()

async function saveConstants() {
  try {
    const json = JSON.stringify(CONSTANTS)
    await writeFile(FILE_PATH, json)
    process.exit(0)
  } catch (err) {
    console.error(err)
    process.exit(9)
  }
}
