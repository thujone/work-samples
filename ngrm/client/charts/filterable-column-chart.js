import React from 'react'
import PropTypes from 'prop-types'
import Chart from './chart'
import * as factory from './chart-factory'
import FilterList from '../filter-list/filter-list'

export default class FilterableColumnChart extends React.Component {

  constructor(props) {
    super(props)
    const { title, xTitle, height, isDualAxis = false } = props
    let config
    if (!isDualAxis) {
      config = factory.createFilterableColumnChartConfig(title, xTitle, height)
    } else {
      config = factory.createDualAxisChartConfig(title, xTitle, height)
    }
    console.log('config', config);
    this.state = {
      ...config
    }
    this.onClickItem = this.onClickItem.bind(this)
  }

  componentDidUpdate() {
    const { state, props } = this
    const chartIds = props.charts ? Object.keys(props.charts) : []
    factory.componentDidUpdate(this)

    if (state.series && chartIds.length === 0) {
      this.setState({
        series: undefined,
        seriesName: undefined
      })
      return
    }

    if (state.series || chartIds.length === 0)
      return

    const chartId = chartIds[0]
    const chart = props.charts[chartId]
    this.setState({
      series: chart.Series,
      seriesName: chart.Name
    })
  }

  onClickItem(item) {
    const chartId = item.value
    const chart = this.props.charts[chartId]
    this.setState({
      series: chart.Series,
      seriesName: chart.Name
    })
  }

  render() {
    const { id, className, title, chartWrapperId, charts, filterLabel } = this.props
    return (
      <div id={id} className={className + ' filterable-column-chart panel panel-default'}>
        <div className="filterable-chart-info col-md-3">
          <h1>{title}</h1>
          {charts && Object.keys(charts).length > 0 &&
            <FilterList
              title={filterLabel}
              list={Object.keys(charts).map(id => ({ label: charts[id].Name, value: id }))}
              onClickItem={this.onClickItem}
            />
          }
        </div>
        <div className="filterable-chart col-md-9" id={chartWrapperId}>
          <Chart
            ref="chart-2"
            isPureConfig={true}
            config={this.state}
          />
        </div>
      </div>
    )
  }
}

FilterableColumnChart.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  xTitle: PropTypes.string,
  yTitle: PropTypes.string,
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  className: PropTypes.string,
  charts: PropTypes.object,
  onClick: PropTypes.func
}
