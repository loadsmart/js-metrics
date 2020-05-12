import { INITIAL_CONTEXT } from './constants'

export const getGlobalConfig = () => window.LS_METRICS_CONFIG || INITIAL_CONTEXT

export const setGlobalConfig = config => window.LS_METRICS_CONFIG = { ...getGlobalConfig(), ...config }
