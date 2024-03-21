import { writeCompiledSvg } from '../../svgUtils'
const svgPath = __dirname
const outputTsFile = `${__dirname}/index.ts`

try {
  writeCompiledSvg(svgPath, outputTsFile)
  console.log(`SVGs have been compiled into ${outputTsFile}`)
} catch (err) {
  console.error('Error compiling SVGs:', err)
}
