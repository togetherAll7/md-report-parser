import * as fs from 'fs'
import * as path from 'path'

export const removeXMLdec = (xml: string) =>
  xml.replace(/^<\?xml\s+version="1\.0"\s+encoding="utf-8"\s*\?>/i, '')

export const removeXmlComments = (xml: string) =>
  xml.replace(/<!--[\s\S]*?-->/g, '')

export const cleanSVG = (svg: string) => {
  svg = removeXMLdec(svg)
  svg = removeXmlComments(svg)
  svg = svg.replace(/^\s*\n/gm, '')
  return svg
}

export const compileSvgs = (dir: string) => {
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
  return tsContent
}

export const writeCompiledSvg = (dir: string, out: string) => {
  const tsContent = compileSvgs(dir)
  fs.writeFileSync(out, tsContent, 'utf-8')
}
