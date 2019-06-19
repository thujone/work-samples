import React from 'react'
import PropTypes from 'prop-types'
import Chart from './chart'
import * as factory from './chart-factory'

export default class PieChart extends React.Component {

  constructor(props) {
    super(props)
    const { title, subtitle, height, legend } = props
    const config = factory.createPieChartConfig(title, subtitle, height)
    this.state = {
      ...config,
      legend: {
        enabled: legend
      }
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

PieChart.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  legend: PropTypes.bool,
  className: PropTypes.string,
  chart: PropTypes.object,
  onClick: PropTypes.func
}
