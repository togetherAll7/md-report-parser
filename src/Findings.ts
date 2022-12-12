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
  PARTIALLY_FIXED,
  TOTAL,
  NOT_FIXED,
  OPEN,
  FIXED_PERCENT,
  MEDIUM,
  LOW,
  TXT_PLACEHOLDER
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
  totalRisk?: string
  impactRate?: number
  likelihoodRate?: number
  riskRate?: number
  fixed?: boolean
  location?: string
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
  const totalRisk = RISK[riskRate as keyof typeof RISK]
  const flippedImpact = flipObject(IMPACT)
  const flippedLikelihood = flipObject(LIKELIHOOD)
  impact = flippedImpact[impactRate as keyof typeof flippedImpact]
  likelihood =
    flippedLikelihood[likelihoodRate as keyof typeof flippedLikelihood]
  return { impact, likelihood, totalRisk, impactRate, likelihoodRate, riskRate }
}

const NEW_FINDING_MODEL = {
  id: createFindingId(),
  title: 'Untitled Finding',
  location: '',
  likelihood: HIGH,
  impact: HIGH,
  fixed: false
}

export const parseFinding = (data: FindingMetadata) => {
  const { impact, likelihood, totalRisk } = calculateTotalRisk(data)
  const fixed = data.fixed ? true : false
  return Object.assign({ ...data }, { impact, likelihood, totalRisk, fixed })
}

export const FINDING_MODEL = parseFinding(NEW_FINDING_MODEL)

export const findingFields = Object.keys(FINDING_MODEL)

export const isFindingBlock = (block: MdBlock) => isFindingType(block.blockType)

export const createFindingBlock = (
  metadata: FindingMetadata,
  placeholders?: boolean
): MdBlock => {
  metadata = parseFinding(metadata)
  const blockType = `h${FINDING_TITLE_LEVEL}`
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

interface Sarasa {
  [key: string]: string
}

export const FINDING_LIST_TITLES = findingFields.reduce(
  (v: { [k: string]: string }, a: string) => {
    v[a] = camelCaseToText(a)
    return v
  },
  {}
)

export const FINDING_RESUME_RISKS = [HIGH, MEDIUM, LOW]
export const FINDING_RESUME_FIELDS = [OPEN, FIXED, TOTAL]

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
    const perRiskFindings = findings.filter((f) => f.totalRisk === risk)
    const total = perRiskFindings.length
    const fixed = perRiskFindings.filter((f) => f.fixedKey === FIXED).length
    const partiallyFixed = perRiskFindings.filter(
      (f) => f.fixedKey === PARTIALLY_FIXED
    ).length

    resume[risk] = {
      [TOTAL]: total,
      [FIXED]: fixed,
      [NOT_FIXED]: total ? total - fixed : 0,
      [PARTIALLY_FIXED]: partiallyFixed,
      [OPEN]: total ? total - fixed - partiallyFixed : 0,
      [FIXED_PERCENT]: fixed ? `${Math.ceil((fixed * 100) / total)}%` : NONE
    }
  }

  return resume
}

export const getFindingResumeData = (findings: any[]) => {
  const data = getFindingResume(findings)
  if (!data) {
    return []
  }
  return FINDING_RESUME_FIELDS.map((field) =>
    FINDING_RESUME_RISKS.reduce((v: { [key: string]: string }, risk) => {
      v[risk] = data[risk][field]
      return v
    }, {})
  )
}
