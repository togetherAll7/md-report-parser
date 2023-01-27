import {
  FindingMetadata,
  isFindingId,
  calculateTotalRisk,
  parseFinding,
  createFindingBlock,
  isFindingBlock,
  sortFindingsByRisk,
  iterateFindings,
  reindexFindings,
  createFindingId,
  parseFindingId,
  getFindingResume,
  getFindingResumeData
} from '../Findings'
import {
  FINDING,
  FINDING_ID_DEFAULT_PREFIX,
  FINDING_ID_SEPARATOR,
  FINDING_SECTIONS,
  FIXED,
  HIGH,
  LOW,
  MEDIUM,
  OPEN,
  REPORTED,
  NONE
} from '../constants'
import { createMdBlock, isMdBlock, MdBlock, MdDoc, mdDocToMd } from '../mdModel'
import { arrayUnique } from '../utils'

import { getFile, removeEmptyLines } from './test.helpers'
import MdToObj from '../MdToObj'

const example = getFile('example.md')

const testRisk = [
  [HIGH, LOW, MEDIUM],
  [HIGH, MEDIUM, MEDIUM],
  [HIGH, HIGH, HIGH],
  [MEDIUM, LOW, LOW],
  [MEDIUM, MEDIUM, MEDIUM],
  [MEDIUM, HIGH, MEDIUM],
  [LOW, LOW, LOW],
  [LOW, MEDIUM, LOW],
  [LOW, HIGH, MEDIUM]
].map(([likelihood, impact, totalRisk]) => {
  return { likelihood, impact, totalRisk }
})

describe('findings', () => {
  describe('isFindingId', () => {
    const ok = ['xxx-001', 'abcdefghijk-123', 'abc-100'].map((x) => [x, true])
    const bad = [
      '',
      '0',
      'a',
      '-1',
      'aa-001',
      'aa bb-123',
      'aaa-',
      'ab-12'
    ].map((x) => [x, false])
    for (const [test, result] of [...ok, ...bad]) {
      it(`"${test}": should be ${result}`, () => {
        expect(isFindingId(test as string)).toBe(result)
      })
    }
  })

  describe('calculateTotalRisk', () => {
    for (const { likelihood, impact, totalRisk } of testRisk) {
      const params = { likelihood, impact }
      it(`${JSON.stringify(params)}, should result ${JSON.stringify({
        totalRisk
      })}`, () => {
        expect(calculateTotalRisk(params).totalRisk).toBe(totalRisk)
      })
    }
  })

  describe('parseFindingId', () => {
    const decoId = (prefix: any, numeral: any) => {
      return { prefix, numeral }
    }

    it('should parse ids', () => {
      expect(parseFindingId('xxx-0001')).toStrictEqual(decoId('xxx', 1))
      expect(parseFindingId('xxx-0010')).toStrictEqual(decoId('xxx', 10))
      expect(parseFindingId('xx-0010')).toStrictEqual(
        decoId(FINDING_ID_DEFAULT_PREFIX, 10)
      )
      expect(parseFindingId('xxx-----0010')).toStrictEqual(decoId('xxx', 1))
      expect(parseFindingId('-0001')).toStrictEqual(
        decoId(FINDING_ID_DEFAULT_PREFIX, 1)
      )
      expect(parseFindingId('-1')).toStrictEqual(
        decoId(FINDING_ID_DEFAULT_PREFIX, 1)
      )
      expect(parseFindingId('0')).toStrictEqual(
        decoId(FINDING_ID_DEFAULT_PREFIX, 1)
      )
      expect(parseFindingId('xxx-')).toStrictEqual(decoId('xxx', 1))
      expect(parseFindingId('aaaa')).toStrictEqual(decoId('aaaa', 1))
    })
  })

  describe('createFindingId', () => {
    it('should create a finding id with default values', () => {
      const id = createFindingId()
      expect(typeof id).toBe('string')
      if (id) {
        const [prefix, n] = id?.split(FINDING_ID_SEPARATOR)
        expect(prefix).toBe(FINDING_ID_DEFAULT_PREFIX)
        expect(n).toBe('001')
      }
    })

    it('should return the same id', () => {
      const id = 'XXX-099'
      const newId = createFindingId(id)
      expect(newId).toBe(id)
    })

    it('should honor the id prefix by increasing the id number', () => {
      expect(createFindingId('XXX')).toBe('XXX-001')
      expect(createFindingId('XXX-022')).toBe('XXX-022')
      expect(createFindingId('XXX-22')).toBe('XXX-022')
      expect(createFindingId('XXX-022', 0)).toBe('XXX-022')
      expect(createFindingId('XXX-22', 1)).toBe('XXX-023')
      expect(createFindingId('XXX-022', 1)).toBe('XXX-023')
      expect(createFindingId('XXX-022', 3)).toBe('XXX-025')
    })
  })

  describe('createFindingBlock', () => {
    it('should return a finding block', () => {
      const block = createFindingBlock(parseFinding(testRisk[0]))
      expect(isMdBlock(block)).toBe(true)
      expect(isFindingBlock(block)).toBe(true)
      const { metadata } = block
      expect(parseFinding(metadata as FindingMetadata)).toStrictEqual(metadata)
      expect(block.children?.map((x) => x.metadata.title)).toStrictEqual(
        FINDING_SECTIONS
      )
    })
  })

  describe('sortFindingsByRisk', () => {
    const blocks = testRisk
      .map(parseFinding)
      .map((meta) => createFindingBlock(meta))

    it('should sort findings by risk', () => {
      const sorted = sortFindingsByRisk([...blocks])
      const risk = sorted.map(({ metadata }) => metadata.totalRisk)
      expect(arrayUnique(risk)).toStrictEqual([HIGH, MEDIUM, LOW])
    })
  })

  describe('iterateFindings', () => {
    const impact = LOW
    const likelihood = MEDIUM
    const prefix = 'ISSUE-001'
    const findings = [...Array(5)].map((x, i) =>
      createFindingBlock({
        impact,
        likelihood,
        id: createFindingId(prefix, i)
      })
    )
    const blocks = [...Array(4)].map((x) =>
      createMdBlock({ blockType: 'test', metadata: {} })
    )

    it('should filter findings', () => {
      const newFindings: any[] = []
      const test = [...blocks, ...findings]
      iterateFindings(test, (f: any) => {
        newFindings.push(f)
        return f
      })

      expect(test.length !== findings.length).toBe(true)
      expect(newFindings).toStrictEqual(findings)
    })
  })

  describe('reindexFindings', () => {
    const prefix = 'ISS'
    const ids = [3, 8, 7, 2, 2, 4]
    const findings = ids
      .map((n) => {
        return { id: `${prefix}-${n}`, impact: HIGH, likelihood: MEDIUM }
      })
      .map((x) => parseFinding(x as FindingMetadata))
      .map((metadata) => {
        return { blockType: FINDING, metadata }
      })

    const expected = ids.map((x, i) =>
      createFindingId(`${prefix}-${ids[0]}`, i)
    )

    it('should reindex findings', () => {
      const reindexed = reindexFindings([...findings])
      expect(reindexed.map(({ metadata }) => metadata.id)).toStrictEqual(
        expected
      )
      expect(reindexFindings([...reindexed])).toStrictEqual(reindexed)
    })

    it('should reindex findings (multiple prefixes)', () => {
      const pa = 'aaa'
      const pb = 'bbb'
      const ids = [
        createFindingId(pa, 8),
        createFindingId(pb, 100),
        createFindingId(pa, 2),
        createFindingId(pb, 1),
        createFindingId(pb, 8)
      ]

      const expected = [
        createFindingId(pa, 8),
        createFindingId(pb, 100),
        createFindingId(pa, 9),
        createFindingId(pb, 101),
        createFindingId(pb, 102)
      ]

      const findings = ids.map((id) => {
        const metadata = parseFinding({ id, impact: HIGH, likelihood: LOW })
        return {
          blockType: FINDING,
          metadata
        }
      })
      const reindexed = reindexFindings([...findings])

      expect(reindexed.map(({ metadata }) => metadata.id)).toStrictEqual(
        expected
      )
      expect(reindexFindings([...reindexed])).toStrictEqual(reindexed)
    })

    it('should reindex findings (example.md)', () => {
      const reindexed = reindexFindings(MdToObj()(example))
      const findings: MdDoc = []
      iterateFindings(reindexed, (block: MdBlock) => {
        findings.push(block)
        return block
      })

      expect(findings.length > 0).toBe(true)
      const ids = findings.map((f) => f.metadata.id).map(parseFindingId)
      const numerals = ids.map(({ numeral }) => numeral)
      expect([...numerals].sort()).toStrictEqual(numerals)
    })
  })

  describe('getfindingResumeData', () => {
    const data = [
      [HIGH, HIGH, true],
      [MEDIUM, MEDIUM, true],
      [LOW, LOW, true],
      [HIGH, HIGH, false],
      [MEDIUM, MEDIUM, false],
      [LOW, LOW, false],
      [HIGH, HIGH, NONE],
      [MEDIUM, MEDIUM, NONE],
      [LOW, LOW, NONE]
    ].map(([likelihood, impact, fixed]) => {
      return { likelihood, impact, fixed }
    })
    const findings = data.map((f: any) => parseFinding(f))

    const resumeData = getFindingResumeData(findings)
    it(`should return [${OPEN}] findings`, () => {
      expect(resumeData[OPEN]).toStrictEqual({
        [HIGH]: 1,
        [MEDIUM]: 1,
        [LOW]: 1
      })
    })

    it(`should return [${FIXED}] findings`, () => {
      expect(resumeData[FIXED]).toStrictEqual({
        [HIGH]: 2,
        [MEDIUM]: 2,
        [LOW]: 2
      })
    })
    it(`should return [${REPORTED}] findings`, () => {
      expect(resumeData[REPORTED]).toStrictEqual({
        [HIGH]: 3,
        [MEDIUM]: 3,
        [LOW]: 3
      })
    })
  })
})
