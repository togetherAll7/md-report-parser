import {
  FINDING,
  FINDING_ID_DEFAULT_PREFIX,
  FINDING_ID_PREFIX_MIN_LENGTH,
  FINDING_ID_SEPARATOR,
  FINDING_ID_ZERO_PADDING,
  FINDING_SECTIONS,
  FINDING_TITLE_LEVEL,
  HIGH,
  IMPACT,
  LIKELIHOOD,
  RISK
} from './constants'
import {
  createMdBlock,
  MdBlock,
  MdDoc,
  sortBlocks,
  iterateBlocks
} from './mdModel'
import { flipObject } from './utils'

export type FindingMetadata = {
  id?: string
  impact: string
  likelihood: string
  totalRisk?: string
  impactRate?: number
  likelihoodRate?: number
  riskRate?: number
  fixed?: boolean
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

const finding = {
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

export const findingModel = parseFinding(finding)

export const findingFields = Object.keys(findingModel)

export const isFindingBlock = (block: MdBlock) => isFindingType(block.blockType)

export const createFindingBlock = (metadata: FindingMetadata): MdBlock => {
  metadata = parseFinding(metadata)
  const blockType = `h${FINDING_TITLE_LEVEL}`
  const children = FINDING_SECTIONS.map((title) =>
    createMdBlock({ blockType, metadata: { title } })
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
  const first = doc.find(
    (block) => isFindingBlock(block) && isFindingId(block.metadata.id)
  )
  const [prefix, n] = splitFindingId(first?.metadata.id || createFindingId())
  let next = parseInt(n) - 1
  iterateFindings(doc, (block: MdBlock) => {
    block.metadata.id = createFindingId(prefix, next++)
  })
  return doc
}
