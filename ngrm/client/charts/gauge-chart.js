import React from 'react'
import PropTypes from 'prop-types'
import Chart from './chart'
import * as factory from './chart-factory'

export default class GaugeChart extends React.Component {

  constructor(props) {
    super(props)
    const { title, height } = props
    const config = factory.createGaugeChartConfig(title, height)
    this.state = {
      ...config
    }
  }

  componentDidUpdate() {
    factory.componentDidUpdate(this)
  }

  render() {
    const { id, className } = this.props

    return (
      <div id={id} className={className}>
        <Chart
          ref="chart"
          isPureConfig={true}
          config={this.state}
        />
      </div>
    )
  }
}

GaugeChart.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  className: PropTypes.string,
  chart: PropTypes.object
}
