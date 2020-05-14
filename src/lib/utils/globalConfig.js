import { INITIAL_CONFIG } from './constants'

export const getGlobalConfig = () => window.LS_METRICS_CONFIG || INITIAL_CONFIG

export const setGlobalConfig = config => window.LS_METRICS_CONFIG = { ...getGlobalConfig(), ...config, context: { ...getGlobalConfig().context, ...config.context } }

export const addGlobalContext = context => {
  const { context: globalContext, ...globalConfig } = getGlobalConfig()
  setGlobalConfig({ ...globalConfig, context: { ...globalContext, ...context } })
}
