import { metadataToMd } from '../metadata'

describe('Metadata', () => {
  describe('metadataToMd', () => {
    it('should convert a metadata obj to md', () => {
      const title = 'test'
      const id = 'xxx-1'
      const metadata = { title, id }
      const md = `title: ${title}\nid: ${id}\n`
      expect(metadataToMd(metadata)).toBe(md)
    })
  })
})
