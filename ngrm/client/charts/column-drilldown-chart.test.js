import React from 'react'
import { shallow, mount } from 'enzyme'
import ColumnDrilldownChart from './column-drilldown-chart'
import ReactHighcharts from 'react-highcharts'
import * as factory from './chart-factory'

describe("Column Drilldown Chart", () => {
  let props
  let mockConfig = {
    setting: 'value'
  }

  beforeEach(() => {
    factory.createColumnChartConfig = jest.fn().mockReturnValue(mockConfig)

    props = {
      id: 'id',
      title: 'title',
      subtitle: 'subtitle',
      xTitle: 'xTitle',
      yTitle: 'yTitle',
      height: 'height',
      className: 'col-md-6',
      chart: {
        Series: 'seriesData',
        DrilldownSeries: 'drilldownSeriesData'
      },
      onClick: jest.fn(),
      onDrilldownClick: jest.fn(),
      onDrillupClick: jest.fn()
    }
  })

  it("should render with props", () => {
    const subject = shallow(<ColumnDrilldownChart {...props} />)

    const wrapper = subject.find('div')
    expect(wrapper.props().id).toEqual('id')
    expect(wrapper.props().className).toEqual('col-md-6')

    const pieChart = wrapper.find(ReactHighcharts)
    expect(pieChart.props().isPureConfig).toBeDefined()
    expect(factory.createColumnChartConfig).toHaveBeenCalledWith(props.title, props.subtitle, props.xTitle, props.yTitle, props.height)
    expect(pieChart.props().config.setting).toEqual('value')
    expect(pieChart.props().config.chart.events.drilldown).toEqual(props.onDrilldownClick)
    expect(pieChart.props().config.chart.events.drillup).toEqual(props.onDrillupClick)
  })

})
