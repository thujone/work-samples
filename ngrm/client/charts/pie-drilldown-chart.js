import React from 'react'
import PropTypes from 'prop-types'
import Chart from './chart'
import * as factory from './chart-factory'

export default class ColumnDrilldownChart extends React.Component {

  constructor(props) {
    super(props)
    const { title, subtitle, height, legend, onDrilldownClick, onDrillupClick } = props
    const config = factory.createPieChartConfig(title, subtitle, height)
    this.state = {
      ...config,
      legend: {
        enabled: legend
      },
      chart: {
        ...config.chart,
        events: {
          drilldown: onDrilldownClick,
          drillup: onDrillupClick
        }
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

ColumnDrilldownChart.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  legend: PropTypes.bool,
  className: PropTypes.string,
  chart: PropTypes.object,
  onClick: PropTypes.func,
  onDrilldownClick: PropTypes.func,
  onDrillupClick: PropTypes.func
}
