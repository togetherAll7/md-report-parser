import * as Diff from 'diff'

export function diff (oldStr, newStr) {
  // return Diff.diffChars(oldStr, newStr)
  const lines = Diff.diffLines(oldStr, newStr, { newlineIsToken: true })
return lines
}


const a = "Habia una vez una baca.\n"
const b = "Habia una vez una vaca.\n En la quebrada"





console.log(diff(a, b))


