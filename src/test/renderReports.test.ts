import RenderReports from '../renderReports'
import { getOptions } from '../mdModel'

const { metadataBlockTypeName } = getOptions()
const renderReports = RenderReports({ metadataBlockTypeName })

describe('renderReports', () => {
  describe('Object', () => {
    it('Object methods', () => {
      expect(typeof renderReports).toBe('object')
      expect(Object.keys(renderReports)).toStrictEqual([
        'render',
        'metadataRenderer',
        'createTitle'
      ])
    })
  })
})
