import {
  FINDING,
  FINDING_ID_DEFAULT_PREFIX,
  FINDING_ID_PREFIX_MIN_LENGTH,
  FINDING_ID_SEPARATOR,
  FINDING_ID_ZERO_PADDING,
  FINDING_SECTIONS,
  FINDING_TITLE_LEVEL,
  FIXED,
  HIGH,
  IMPACT,
  LIKELIHOOD,
  RISK,
  TOTAL_RISK,
  ID,
  TITLE,
  NONE,
  TOTAL,
  FIXED_PERCENT,
  MEDIUM,
  LOW,
  TXT_PLACEHOLDER,
  REPORTED,
  SORTED_FINDING_FIELDS,
  STATUS,
  CONDITION,
  IMPACT_KEY,
  LIKELIHOOD_KEY,
  RISK_KEY,
  REMEDIATION
} from './constants'
import {
  createMdBlock,
  MdBlock,
  MdDoc,
  sortBlocks,
  iterateBlocks
} from './mdModel'
import { flipObject, camelCaseToText, toCamelCase } from './utils'

export type FindingMetadata = {
  id?: string
  impact: string
  likelihood: string
  risk?: string
  impactRate?: number
  likelihoodRate?: number
  riskRate?: number
  status?: string
  location?: string
  remediation?: FindingStatus
}

export enum FindingStatus {
  open = 'Open',
  fixed = 'Fixed',
  partiallyFixed = 'Partially Fixed',
  acknowledged = 'Acknowledged',
  deferred = 'Deferred'
}

export enum Condition {
  ok = '√',
  warning = '⚠',
  problem = 'X'
}

interface ArraySortCallback<TypeOne> {
  (param1: TypeOne, param2: TypeOne): number
}

const validateValues = (value: string, values: {}, def: string) =>
  Object.keys(values).includes(value) ? value : def

const validateImpact = (value: string, def = HIGH) =>
  validateValues(value, IMPACT, def)

const validateLikelihood = (value: any, def = HIGH): string =>
  validateValues(value, LIKELIHOOD, def)

export const isFindingType = (str: string): boolean => str === FINDING

export const isValidIdPrefix = (str: string | undefined) =>
  typeof str === 'string' && str.length >= FINDING_ID_PREFIX_MIN_LENGTH

export const isFindingId = (str: string | undefined): boolean =>
  str
    ? new RegExp(
        `^[A-Z]{${FINDING_ID_PREFIX_MIN_LENGTH},}${FINDING_ID_SEPARATOR}[0-9]`,
        'i'
      ).test(str)
    : false

export const splitFindingId = (id: string | undefined) =>
  id ? id.split(FINDING_ID_SEPARATOR) : []

export const parseFindingId = (
  id: string
): { prefix: string; numeral: number } => {
  let [prefix, n] = splitFindingId(id)
  const numeral = parseInt(n || '1')
  if (prefix.length < FINDING_ID_PREFIX_MIN_LENGTH || !prefix) {
    prefix = FINDING_ID_DEFAULT_PREFIX
  }
  return { prefix, numeral }
}

export const createFindingId = (prefixOrId?: string, n: number = 0) => {
  let [prefix, prev] = isFindingId(prefixOrId)
    ? splitFindingId(prefixOrId)
    : [
        isValidIdPrefix(prefixOrId) ? prefixOrId : FINDING_ID_DEFAULT_PREFIX,
        '1'
      ]

  const next = `${parseInt(prev) + n}`.padStart(FINDING_ID_ZERO_PADDING, '0')
  return `${prefix}${FINDING_ID_SEPARATOR}${next}`
}

export const calculateTotalRisk = ({ impact, likelihood }: FindingMetadata) => {
  impact = validateImpact(impact)
  likelihood = validateLikelihood(likelihood)
  const impactRate = IMPACT[impact as keyof typeof IMPACT]
  const likelihoodRate = LIKELIHOOD[likelihood as keyof typeof LIKELIHOOD]
  const riskRate = Math.floor((impactRate + likelihoodRate) / 2)
  const risk = RISK[riskRate as keyof typeof RISK]
  const flippedImpact = flipObject(IMPACT)
  const flippedLikelihood = flipObject(LIKELIHOOD)
  impact = flippedImpact[impactRate as keyof typeof flippedImpact]
  likelihood =
    flippedLikelihood[likelihoodRate as keyof typeof flippedLikelihood]
  return { impact, likelihood, risk, impactRate, likelihoodRate, riskRate }
}

export const calculateCondition = (
  remediation: FindingStatus,
  totalRisk: string
): Condition => {
  if (remediation === FindingStatus.fixed) {
    return Condition.ok
  }
  if (totalRisk === HIGH || totalRisk === MEDIUM) {
    if (remediation === FindingStatus.open) {
      return Condition.problem
    }
    return Condition.warning
  }
  if (remediation === FindingStatus.partiallyFixed) {
    return Condition.ok
  }
  return Condition.warning
}

const NEW_FINDING_MODEL = {
  id: createFindingId(),
  likelihood: HIGH,
  impact: HIGH,
  title: 'Untitled Finding',
  remediation: FindingStatus.open,
  location: ''
}

export const parseFinding = (data: FindingMetadata) => {
  const { impact, likelihood, risk } = calculateTotalRisk(data)
  const condition = calculateCondition(data.remediation || FindingStatus.open, risk)
  return sortFindingFields(
    Object.assign(
      { ...data },
      {
        [IMPACT_KEY]: impact,
        [LIKELIHOOD_KEY]: likelihood,
        [RISK_KEY]: risk,
        [REMEDIATION]: data.remediation,
        [STATUS]: condition
      }
    )
  )
}

export const sortFindingFields = (finding: any) => {
  const newFinding: { [key: string]: any } = {}
  for (const f of SORTED_FINDING_FIELDS) {
    newFinding[f] = finding[f]
  }
  return { ...newFinding, ...finding }
}

export const FINDING_MODEL = parseFinding(NEW_FINDING_MODEL)

export const findingFields = Object.keys(FINDING_MODEL)

export const isFindingBlock = (block: MdBlock) => isFindingType(block.blockType)

export const createFindingBlock = (
  metadata: FindingMetadata,
  placeholders?: boolean
): MdBlock => {
  metadata = parseFinding(metadata)
  const subtitleLevel = FINDING_TITLE_LEVEL + 1
  const blockType = `h${subtitleLevel}`
  const md = placeholders ? `${TXT_PLACEHOLDER}\n` : ''
  const children = FINDING_SECTIONS.map((title) =>
    createMdBlock({ blockType, metadata: { title }, md })
  )
  return createMdBlock({ blockType: FINDING, metadata, children })
}

const sortFindings = (
  doc: MdDoc,
  sortCb: ArraySortCallback<MdBlock>
): MdDoc => {
  const filterCb = (a: MdBlock, b: MdBlock) =>
    isFindingBlock(a) && isFindingBlock(b)

  return sortBlocks(doc, sortCb, filterCb)
}

export const iterateFindings = (doc: MdDoc, cb: Function) => {
  return iterateBlocks(doc, (block: MdBlock) => {
    if (isFindingBlock(block)) {
      cb(block)
    }
    return block
  })
}

export const sortFindingsByRisk = (doc: MdDoc): MdDoc =>
  sortFindings(doc, (a, b) => {
    const [{ riskRate: ar }, { riskRate: br }] = [a.metadata, b.metadata].map(
      (b) => calculateTotalRisk(parseFinding(b as FindingMetadata))
    )
    return br - ar
  })

export const reindexFindings = (doc: MdDoc): MdDoc => {
  interface Pmap {
    [key: string]: number
  }

  let map: Pmap = {}

  iterateFindings(doc, (block: MdBlock) => {
    const { metadata } = block
    let { prefix, numeral } = parseFindingId(metadata.id)
    if (!map[prefix]) {
      map[prefix] = numeral
    }
    block.metadata.id = createFindingId(prefix, map[prefix] - 1)
    map[prefix] = map[prefix] + 1
    return block
  })
  return doc
}

export const getFindings = (doc: MdDoc) => {
  const findings: any[] = []
  iterateFindings(doc, (f: any) => findings.push(f))
  return findings.map(({ metadata }) => metadata)
}

export const findingListFieds = [ID, TITLE, TOTAL_RISK, FIXED]

export const FINDING_LIST_TITLES = findingFields.reduce(
  (v: { [k: string]: string }, a: string) => {
    v[a] = camelCaseToText(a)
    return v
  },
  {}
)

export const FINDING_RESUME_RISKS = [HIGH, MEDIUM, LOW]
export const FINDING_RESUME_FIELDS: string[] = Object.values(FindingStatus)
  .map((s) => s.toString())
  .concat([REPORTED])
export const MANDATORY_RESUME_FIELDS = [
  FindingStatus.open.toString(),
  FindingStatus.fixed.toString(),
  REPORTED
]

export const FINDING_RESUME_TITLES = FINDING_RESUME_RISKS.reduce(
  (v: { [k: string]: string }, a) => {
    v[a] = `${a} risk`
    return v
  },
  {}
)

export const getFindingResume = (findings: any[]) => {
  const resume: { [key: string]: any } = {}
  if (!findings.length) {
    return
  }
  for (const risk of Object.values(RISK)) {
    const perRiskFindings = findings.filter((f) => f.risk === risk)
    const total = perRiskFindings.length
    const grouped = groupByRemediation(perRiskFindings)
    resume[risk] = {
      [TOTAL]: total,
      [REPORTED]: total,
      ...grouped,
      [FIXED_PERCENT]: grouped[FindingStatus.fixed]
        ? `${Math.ceil((grouped[FindingStatus.fixed] * 100) / total)}%`
        : NONE
    }
  }
  return resume
}

const groupByRemediation = (findings: any[]) => {
  return findings.reduce((v: { [key: string]: any }, f) => {
    const remediation = f.remediation
    if (!v[remediation]) {
      v[remediation] = 0
    }
    v[remediation] = v[remediation] + 1
    return v
  }, {})
}

export const getFindingResumeData = (findings: any[]) => {
  const data = getFindingResume(findings)
  if (!data) {
    return []
  }

  const resume = FINDING_RESUME_FIELDS.reduce(
    (v: { [key: string]: any }, field: string) => {
      v[field] = FINDING_RESUME_RISKS.reduce(
        (v: { [key: string]: string }, risk) => {
          v[risk] = data[risk][field] || 0
          return v
        },
        {}
      )
      return v
    },
    {}
  )

  Object.keys(resume).forEach((k) => {
    if (!MANDATORY_RESUME_FIELDS.includes(k)) {
      // If all risks are 0, remove the field
      if (Object.values(resume[k]).every((v) => v === 0)) {
        delete resume[k]
      }
    }
  })

  return resume
}
