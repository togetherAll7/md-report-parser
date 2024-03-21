import { INFO, LOW, MEDIUM, HIGH, FINDING_STATUS } from '../constants'
import { parseFinding, sortDataByRisk } from '../Findings'
import { createFindingTemplates } from '../templates/findingTemplates'

describe('templates', () => {
  const templates = createFindingTemplates()
  const values = it('templates should be an object', () => {
    expect(typeof templates).toBe('object')
  })

  it('templates should contain functions', () => {
    for (const x of Object.values(templates).map((v) => typeof v)) {
      expect(x).toBe('function')
    }
  })
})

describe('sortDataByRisk', () => {
  const data = [
    [HIGH, HIGH, FINDING_STATUS.fixed],
    [MEDIUM, MEDIUM, FINDING_STATUS.fixed],
    [LOW, LOW, FINDING_STATUS.fixed],
    [HIGH, HIGH, FINDING_STATUS.acknowledged],
    [MEDIUM, MEDIUM, FINDING_STATUS.acknowledged],
    [LOW, LOW, FINDING_STATUS.acknowledged],
    [HIGH, HIGH, FINDING_STATUS.deferred],
    [MEDIUM, MEDIUM, FINDING_STATUS.deferred],
    [INFO, INFO, FINDING_STATUS.deferred],
    [HIGH, HIGH, FINDING_STATUS.open],
    [MEDIUM, MEDIUM, FINDING_STATUS.open],
    [LOW, LOW, FINDING_STATUS.open],
    [INFO, INFO, FINDING_STATUS.partiallyFixed],
    [MEDIUM, MEDIUM, FINDING_STATUS.partiallyFixed],
    [LOW, LOW, FINDING_STATUS.partiallyFixed]
  ].map(([likelihood, impact, resolution]) => {
    return { likelihood, impact, resolution }
  })
  const findings = data.map((f: any) => parseFinding(f))
  const expected = [INFO, LOW, MEDIUM, HIGH]

  it('should sort findings by risk', () => {
    const sorted = sortDataByRisk(findings, true)
    const risks = [...new Set(sorted.map((x: any) => x.risk))]
    expect(risks).toStrictEqual(expected)
  })

  it('should sort findings by risk in reverse order', () => {
    const sorted = sortDataByRisk(findings)
    const risks = [...new Set(sorted.map((x: any) => x.risk))]
    expect(risks).toStrictEqual(expected.reverse())
  })
})
