import { table } from '../html'
import { removeWhiteSpace } from './test.helpers'

describe('html', () => {
  describe('table', () => {
    const A: string = 'a'
    const B: string = 'b'
    const fields = { [A]: 'foo', [B]: 'bar' }
    const data = [{ [A]: 'test_a', [B]: 'test_b' }]
    const html = table(data, fields)
    console.log(html)
    const expected =
      '<table >' +
      '<tr>' +
      `<th  class="field-${A}"  data-value="${fields[A]}">${fields[A]}</th>` +
      `<th  class="field-${B}" data-value="${fields[B]}">${fields[B]}</th>` +
      '</tr>' +
      '<tr>' +
      `<td class="field-${A}" data-value="${data[0][A]}">${data[0][A]}</td>` +
      `<td class="field-${B}" data-value="${data[0][B]}">${data[0][B]}</td>` +
      '</tr>' +
      '</table>'

    it('should rended a table', () => {
      expect(removeWhiteSpace(`${html}`)).toBe(removeWhiteSpace(expected))
    })
  })
})
