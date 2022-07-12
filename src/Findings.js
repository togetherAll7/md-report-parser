import { HIGH, IMPACT, LOW, MEDIUM, RISK, LIKELIHOOD } from './constants'
import { flipObject } from './utils'

const validateHMLValue = (value, def = HIGH) => [HIGH, MEDIUM, LOW].includes(value) ? value : def

export const calculateTotalRisk = ({ impact, likelihood } = {}) => {
  impact = validateHMLValue(impact)
  likelihood = validateHMLValue(likelihood)
  const impactRate = parseInt(IMPACT[impact])
  const likelihoodRate = parseInt(LIKELIHOOD[likelihood])
  const riskRate = Math.floor((impactRate + likelihoodRate) / 2)
  const totalRisk = RISK[riskRate]
  impact = flipObject(IMPACT)[impactRate]
  likelihood = flipObject(LIKELIHOOD)[likelihoodRate]
  return { impact, likelihood, totalRisk }
}

