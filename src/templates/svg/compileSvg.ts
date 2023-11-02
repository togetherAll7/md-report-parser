import * as fs from 'fs'
import * as path from 'path'

const svgPath = __dirname
const outputTsFile = `${__dirname}/index.ts`

const removeXMLdec = (xml: string) =>
  xml.replace(/^<\?xml\s+version="1\.0"\s+encoding="utf-8"\s*\?>/i, '')

const removeXmlComments = (xml: string) => xml.replace(/<!--[\s\S]*?-->/g, '')

const cleanSVG = (svg: string) => {
  svg = removeXMLdec(svg)
  svg = removeXmlComments(svg)
  svg = svg.replace(/^\s*\n/gm, '')
  return svg
}

function compileSvgs(dir: string, out: string) {
  const files = fs.readdirSync(dir)
  const svgFiles = files.filter((file) => path.extname(file) === '.svg')
  const svgVariables: string[] = []

  svgFiles.forEach((file) => {
    const svgContent = cleanSVG(fs.readFileSync(path.join(dir, file), 'utf-8'))

    const variableName = path
      .basename(file, '.svg')
      .replace(/[^a-zA-Z0-9]/g, '_')
    svgVariables.push(`export const ${variableName} = \`${svgContent}\``)
  })

  const tsContent = svgVariables.join('\n\n')

  fs.writeFileSync(out, tsContent, 'utf-8')
}

try {
  compileSvgs(svgPath, outputTsFile)
  console.log(`SVGs have been compiled into ${outputTsFile}`)
} catch (err) {
  console.error('Error compiling SVGs:', err)
}
