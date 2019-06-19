import React from 'react'
import PropTypes from 'prop-types'
import Chart from './chart'
import * as factory from './chart-factory'

export default class ColumnChart extends React.Component {

  constructor(props) {
    super(props)
    const { title, subtitle, xTitle, yTitle, height, legend } = props
    const config = factory.createColumnChartConfig(title, subtitle, xTitle, yTitle, height)
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

ColumnChart.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  xTitle: PropTypes.string,
  yTitle: PropTypes.string,
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  legend: PropTypes.bool,
  className: PropTypes.string,
  chart: PropTypes.object,
  onClick: PropTypes.func
}