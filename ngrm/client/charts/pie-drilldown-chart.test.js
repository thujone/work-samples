import React from 'react'
import { shallow, mount } from 'enzyme'
import PieDrilldownChart from './pie-drilldown-chart'
import ReactHighcharts from 'react-highcharts'
import * as factory from './chart-factory'

describe("Pie Drilldown Chart", () => {
  let props
  let mockConfig = {
    setting: 'value'
  }

  beforeEach(() => {
    factory.createPieChartConfig = jest.fn().mockReturnValue(mockConfig)

    props = {
      id: 'id',
      title: 'title',
      subtitle: 'subtitle',
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
    const subject = shallow(<PieDrilldownChart {...props} />)

    const wrapper = subject.find('div')
    expect(wrapper.props().id).toEqual('id')
    expect(wrapper.props().className).toEqual('col-md-6')

    const pieChart = wrapper.find(ReactHighcharts)
    expect(pieChart.props().isPureConfig).toBeDefined()
    expect(factory.createPieChartConfig).toHaveBeenCalledWith(props.title, props.subtitle, props.height)
    expect(pieChart.props().config.setting).toEqual('value')
    expect(pieChart.props().config.chart.events.drilldown).toEqual(props.onDrilldownClick)
    expect(pieChart.props().config.chart.events.drillup).toEqual(props.onDrillupClick)
  })

})
