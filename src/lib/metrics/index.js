import { datadogLogs } from '@datadog/browser-logs'

import { getGlobalConfig, setGlobalConfig, addGlobalContext } from '../utils/globalConfig'
import { METRIC_TYPES, LOGGER_NAME } from '../utils/constants'

const initializeDatadog = (key, ...props) => {
  datadogLogs.init({
    clientToken: key,
    datacenter: 'us',
    forwardErrorsToLogs: false,
    sampleRate: 100,
    ...props,
  })
}

const initializeGlobalConfig = (appName, config) => {
  setGlobalConfig(config)
  addGlobalContext({ app_name: appName })
}

const initializeLogger = () => {
  const { context } = getGlobalConfig()
  datadogLogs.createLogger(LOGGER_NAME, { context })
}

const getLogger = () => datadogLogs.getLogger(LOGGER_NAME)

const sendMetric = (type, name, tags) => {
  const { initialized } = getGlobalConfig()

  if (!initialized) {
    return console.warn('Metrics not initialized, skipping...')
  }

  try {
    return getLogger().log(name, { metric_type: type, tags })
  } catch (e) {
    return console.error('Failed to send metric', e)
  }
}

export const init = (appName, key, config, ...props) => {
  if (!key) {
    return console.error('A client key is required to use metrics.')
  }

  initializeDatadog(key, ...props)
  initializeGlobalConfig(appName, { initialized: true, ...config })
  initializeLogger()
}

export const count = (...props) => sendMetric(METRIC_TYPES.COUNT, ...props)
