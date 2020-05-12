import { datadogLogs } from '@datadog/browser-logs'

import { getGlobalConfig, setGlobalConfig } from '../utils/globalConfig'
import { METRIC_TYPES } from '../utils/constants'

export default class Metrics {
  init(key, config, ...props) {
    if (!key) {
      return console.error('A client key is required to use metrics.')
    }

    this.initializeDatadog(config, ...props)
    this.initializeLoggers()
  }

  initializeDatadog(config, ...props) {
    datadogLogs.init({
      clientToken: key,
      datacenter: 'us',
      forwardErrorsToLogs: false,
      sampleRate: 100,
      ...props,
    })
    setGlobalConfig(config)
  }

  initializeLoggers() {
    for(const METRIC_TYPE of METRIC_TYPES) {
      this.createLogger(METRIC_TYPE)
    }
  }

  createLogger(type) {
    const { context: configContext } = getGlobalConfig()
    const context = {
      ...configContext,
      metric_type: type,
    }

    return datadogLogs.createLogger(type, context)
  }

  getLogger(type) {
    return datadogLogs.getLogger(type)
  }

  sendMetric(type, name, tags) {
    return this.getLogger(type).log(name, { tags })
  }

  count(...props) {
    return this.sendMetric(METRIC_TYPES.COUNT, ...props)
  }

  rate(...props) {
    return this.sendMetric(METRIC_TYPES.RATE, ...props)
  }

  gauge(...props) {
    return this.sendMetric(METRIC_TYPES.GAUGE, ...props)
  }

  set(...props) {
    return this.sendMetric(METRIC_TYPES.SET, ...props)
  }

  histogram(...props) {
    return this.sendMetric(METRIC_TYPES.HISTOGRAM, ...props)
  }

  distribution(...props) {
    return this.sendMetric(METRIC_TYPES.DISTRIBUTION, ...props)
  }
}
