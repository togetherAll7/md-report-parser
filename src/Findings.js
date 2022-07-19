import { HIGH, IMPACT, RISK, LIKELIHOOD } from './constants'
import { flipObject } from './utils'


const validateValues = (value, values, def) => Object.keys(values).includes(value) ? value : def
const validateImpact = (value, def = HIGH) => validateValues(value, IMPACT, def)
const validateLikelihood = (value, def = HIGH) => validateValues(value, LIKELIHOOD, def)

export const calculateTotalRisk = ({ impact, likelihood } = {}) => {
  impact = validateImpact(impact)
  likelihood = validateLikelihood(likelihood)
  const impactRate = parseInt(IMPACT[impact])
  const likelihoodRate = parseInt(LIKELIHOOD[likelihood])
  const riskRate = Math.floor((impactRate + likelihoodRate) / 2)
  const totalRisk = RISK[riskRate]
  impact = flipObject(IMPACT)[impactRate]
  likelihood = flipObject(LIKELIHOOD)[likelihoodRate]
  return { impact, likelihood, totalRisk }
}

const finding = {
  id: 'xxx-1',
  title: 'Untitled Finding',
  location: '',
  likelihood: HIGH,
  impact: HIGH,
  fixed: false
}

export const parseFinding = (data) => {
  const { impact, likelihood, totalRisk } = calculateTotalRisk(data)
  const fixed = data.fixed ? true : false
  return Object.assign({ ...data }, { impact, likelihood, totalRisk, fixed })
}

export const findingModel = parseFinding(finding)

export const findingFields = Object.keys(findingModel)

