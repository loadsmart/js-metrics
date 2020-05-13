import { datadogLogs } from '@datadog/browser-logs'

import { getGlobalConfig, setGlobalConfig } from '../utils/globalConfig'
import { METRIC_TYPES, LOGGER_NAME } from '../utils/constants'

export default class Metrics {
  init(appName, key, config, ...props) {
    if (!key) {
      return console.error('A client key is required to use metrics.')
    }

    this.initializeDatadog(key, ...props)
    this.initializeGlobalConfig(appName, config)
    this.initializeLogger()
  }

  initializeLogger() {
    const { context } = getGlobalConfig()
    datadogLogs.createLogger(LOGGER_NAME, context)
  }

  initializeGlobalConfig(appName, config) {
    setGlobalConfig(config)
    addGlobalContext({ app_name: appName })
  }

  initializeDatadog(key, ...props) {
    datadogLogs.init({
      clientToken: key,
      datacenter: 'us',
      forwardErrorsToLogs: false,
      sampleRate: 100,
      ...props,
    })
  }

  getLogger() {
    return datadogLogs.getLogger(LOGGER_NAME)
  }

  sendMetric(type, name, tags) {
    return this.getLogger().log(name, { metric_type: type, tags })
  }

  count(...props) {
    return this.sendMetric(METRIC_TYPES.COUNT, ...props)
  }
}
