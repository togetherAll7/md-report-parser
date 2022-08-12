import { HIGH, IMPACT, RISK, LIKELIHOOD, FINDING } from './constants'
import { flipObject } from './utils'

const validateValues = (value: string, values: {}, def: string) =>
  Object.keys(values).includes(value) ? value : def

const validateImpact = (value: string, def = HIGH) =>
  validateValues(value, IMPACT, def)

const validateLikelihood = (value: any, def = HIGH): string =>
  validateValues(value, LIKELIHOOD, def)

type RiskData = {
  impact: string
  likelihood: string
  totalRisk?: string
  impactRate?: number
  likelihoodRate?: number
  riskRate?: number
}

export const isFindingType = (str: string): boolean => str === FINDING

export const calculateTotalRisk = ({ impact, likelihood }: RiskData) => {
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
  id: 'xxx-1',
  title: 'Untitled Finding',
  location: '',
  likelihood: HIGH,
  impact: HIGH,
  fixed: false
}

export const parseFinding = (data: {
  impact: any
  likelihood: any
  fixed?: boolean
}) => {
  const { impact, likelihood, totalRisk } = calculateTotalRisk(data)
  const fixed = data.fixed ? true : false
  return Object.assign({ ...data }, { impact, likelihood, totalRisk, fixed })
}

export const findingModel = parseFinding(finding)

export const findingFields = Object.keys(findingModel)
