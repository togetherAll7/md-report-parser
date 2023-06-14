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
  getFindingResumeData,
  FINDING_MODEL,
  sortFindingFields,
  isAllowedInfoImpact,
  createFindigsExampleMetadata
} from '../Findings'
import {
  ALLOWED_INFO_IMPACT,
  FINDING,
  FINDING_ID_DEFAULT_PREFIX,
  FINDING_ID_SEPARATOR,
  FINDING_SECTIONS,
  HIGH,
  INFO,
  LIKELIHOOD,
  LOW,
  MEDIUM,
  NONE,
  REPORTED,
  RESOLUTION,
  SORTED_FINDING_FIELDS,
  DEFAULT_INFO_IMPACT,
  FINDING_STATUS,
  CONDITION,
  CONDITIONS,
  IMPACT
} from '../constants'
import { createMdBlock, isMdBlock, MdBlock, MdDoc, mdDocToMd } from '../mdModel'
import { arrayUnique } from '../utils'

import { getFile, removeEmptyLines } from './test.helpers'
import MdToObj from '../MdToObj'
import { LIKELIHOOD_KEY } from '../constants'
import { TOTAL_RISK } from '../constants'
import { RISK_KEY } from '../constants'
import { IMPACT_KEY } from '../constants'
import { STATUS } from '../constants'

const example = getFile('example.md')
// likelihood, impact, totalRisk
const testRisk = [
  [HIGH, LOW, MEDIUM],
  [HIGH, MEDIUM, MEDIUM],
  [HIGH, HIGH, HIGH],
  [MEDIUM, LOW, LOW],
  [MEDIUM, MEDIUM, MEDIUM],
  [MEDIUM, HIGH, MEDIUM],
  [LOW, LOW, LOW],
  [LOW, MEDIUM, LOW],
  [LOW, HIGH, MEDIUM],
  [NONE, '', INFO],
  ['', '', INFO]
]
  .concat(ALLOWED_INFO_IMPACT.map((impact) => [NONE, impact, INFO]))
  .map(([likelihood, impact, totalRisk]) => {
    return { likelihood, impact, totalRisk }
  })

describe('findings', () => {
  describe('Sort finding fields', () => {
    const findingCases = [FINDING_MODEL, { risk: LOW }, {}, { id: 'x' }]
    for (const testFinding of findingCases) {
      it('should order the finding fields', () => {
        expect(Object.keys(sortFindingFields(testFinding))).toStrictEqual(
          SORTED_FINDING_FIELDS
        )
      })
    }
  })

  describe('parseFinding', () => {
    it('should return finding default values', () => {
      const finding = parseFinding({ impact: '', likelihood: '' })
      expect(Object.keys(finding)).toStrictEqual(Object.keys(FINDING_MODEL))
      expect(finding[LIKELIHOOD_KEY]).toBe(NONE)
      expect(finding[IMPACT_KEY]).toBe(DEFAULT_INFO_IMPACT)
      expect(finding[RISK_KEY]).toBe(INFO)
      expect(finding[RESOLUTION]).toBe(FINDING_STATUS.open)
      expect(finding[STATUS]).toBe(CONDITIONS.warning)
    })

    it('should return finding default values for INFO findings', () => {
      const finding = parseFinding({ impact: NONE, likelihood: NONE })
      expect(Object.keys(finding)).toStrictEqual(Object.keys(FINDING_MODEL))
      expect(finding[LIKELIHOOD_KEY]).toBe(NONE)
      expect(finding[IMPACT_KEY]).toBe(DEFAULT_INFO_IMPACT)
      expect(finding[RISK_KEY]).toBe(INFO)
      expect(finding[RESOLUTION]).toBe(FINDING_STATUS.open)
      expect(finding[STATUS]).toBe(CONDITIONS.warning)
    })
  })

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
        const result = calculateTotalRisk(params)
        expect(result.risk).toBe(totalRisk)
        if (!likelihood) {
          expect(result.risk).toBe(INFO)
        }
        if (result.risk === INFO) {
          expect(isAllowedInfoImpact(result.impact)).toBe(true)
        }
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
      expect(arrayUnique(risk)).toStrictEqual([HIGH, MEDIUM, LOW, INFO])
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
      [HIGH, HIGH, FINDING_STATUS.fixed],
      [MEDIUM, MEDIUM, FINDING_STATUS.fixed],
      [LOW, LOW, FINDING_STATUS.fixed],
      [HIGH, HIGH, FINDING_STATUS.acknowledged],
      [MEDIUM, MEDIUM, FINDING_STATUS.acknowledged],
      [LOW, LOW, FINDING_STATUS.acknowledged],
      [HIGH, HIGH, FINDING_STATUS.deferred],
      [MEDIUM, MEDIUM, FINDING_STATUS.deferred],
      [LOW, LOW, FINDING_STATUS.deferred],
      [HIGH, HIGH, FINDING_STATUS.open],
      [MEDIUM, MEDIUM, FINDING_STATUS.open],
      [LOW, LOW, FINDING_STATUS.open],
      [HIGH, HIGH, FINDING_STATUS.partiallyFixed],
      [MEDIUM, MEDIUM, FINDING_STATUS.partiallyFixed],
      [LOW, LOW, FINDING_STATUS.partiallyFixed]
    ].map(([likelihood, impact, resolution]) => {
      return { likelihood, impact, resolution }
    })
    const findings = data.map((f: any) => parseFinding(f))

    const resumeData = getFindingResumeData(findings)
    it(`should return [${FINDING_STATUS.open}] findings`, () => {
      expect(resumeData[FINDING_STATUS.open]).toStrictEqual({
        [HIGH]: 1,
        [MEDIUM]: 1,
        [LOW]: 1
      })
    })
    it(`should return [${FINDING_STATUS.acknowledged}] findings`, () => {
      expect(resumeData[FINDING_STATUS.acknowledged]).toStrictEqual({
        [HIGH]: 1,
        [MEDIUM]: 1,
        [LOW]: 1
      })
    })
    it(`should return [${FINDING_STATUS.deferred}] findings`, () => {
      expect(resumeData[FINDING_STATUS.deferred]).toStrictEqual({
        [HIGH]: 1,
        [MEDIUM]: 1,
        [LOW]: 1
      })
    })
    it(`should return [${FINDING_STATUS.fixed}] findings`, () => {
      expect(resumeData[FINDING_STATUS.fixed]).toStrictEqual({
        [HIGH]: 1,
        [MEDIUM]: 1,
        [LOW]: 1
      })
    })
    it(`should return [${FINDING_STATUS.partiallyFixed}] findings`, () => {
      expect(resumeData[FINDING_STATUS.partiallyFixed]).toStrictEqual({
        [HIGH]: 1,
        [MEDIUM]: 1,
        [LOW]: 1
      })
    })
    it(`should return [${REPORTED}] findings`, () => {
      expect(resumeData[REPORTED]).toStrictEqual({
        [HIGH]: 5,
        [MEDIUM]: 5,
        [LOW]: 5
      })
    })
  })

  describe('getfindingResumeDataWithCeroFields', () => {
    const data = [[HIGH, HIGH, FINDING_STATUS.partiallyFixed]].map(
      ([likelihood, impact, resolution]) => {
        return { likelihood, impact, resolution }
      }
    )
    const findings = data.map((f: any) => parseFinding(f))

    const resumeData = getFindingResumeData(findings)
    it(`should return [${FINDING_STATUS.open}] findings`, () => {
      expect(resumeData[FINDING_STATUS.open]).toStrictEqual({
        [HIGH]: 0,
        [MEDIUM]: 0,
        [LOW]: 0
      })
    })
    it(`should return no [${FINDING_STATUS.acknowledged}] findings`, () => {
      expect(resumeData[FINDING_STATUS.acknowledged]).toBeUndefined()
    })
    it(`should return no [${FINDING_STATUS.deferred}] findings`, () => {
      expect(resumeData[FINDING_STATUS.deferred]).toBeUndefined()
    })
    it(`should return [${FINDING_STATUS.fixed}] findings`, () => {
      expect(resumeData[FINDING_STATUS.fixed]).toStrictEqual({
        [HIGH]: 0,
        [MEDIUM]: 0,
        [LOW]: 0
      })
    })
    it(`should return [${FINDING_STATUS.partiallyFixed}] findings`, () => {
      expect(resumeData[FINDING_STATUS.partiallyFixed]).toStrictEqual({
        [HIGH]: 1,
        [MEDIUM]: 0,
        [LOW]: 0
      })
    })
    it(`should return [${REPORTED}] findings`, () => {
      expect(resumeData[REPORTED]).toStrictEqual({
        [HIGH]: 1,
        [MEDIUM]: 0,
        [LOW]: 0
      })
    })
  })

  describe('Create Findings Metadata Example', () => {
    const total =
      Object.keys(IMPACT).length *
      Object.keys(LIKELIHOOD).length *
      Object.keys(FINDING_STATUS).length
    const findings = createFindigsExampleMetadata()
    it('findings.length should be equal to all posible combinations', () => {
      expect(findings.length).toBe(total)
    })
  })
})
