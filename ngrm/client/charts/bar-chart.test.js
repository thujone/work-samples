import React from 'react'
import { shallow, mount } from 'enzyme'
import BarChart from './bar-chart'
import ReactHighcharts from 'react-highcharts'
import * as factory from './chart-factory'

describe("Bar Chart", () => {
  let props
  let mockConfig = {
    setting: 'value'
  }

  beforeEach(() => {
    factory.createBarChartConfig = jest.fn().mockReturnValue(mockConfig)

    props = {
      id: 'id',
      title: 'title',
      subtitle: 'subtitle',
      xTitle: 'xTitle',
      yTitle: 'yTitle',
      height: 'height',
      xMax: 'xMax',
      yMax: 'yMax',
      yTickInterval: 'yTickInterval',
      className: 'col-md-6',
      chart: { Series: 'seriesData' },
      onClick: jest.fn()
    }
  })

  it("should render with props", () => {
    const subject = shallow(<BarChart {...props} />)

    const wrapper = subject.find('div')
    expect(wrapper.props().id).toEqual('id')
    expect(wrapper.props().className).toEqual('col-md-6')

    const pieChart = wrapper.find(ReactHighcharts)
    expect(pieChart.props().isPureConfig).toBeDefined()
    expect(factory.createBarChartConfig).toHaveBeenCalledWith(props.title, props.subtitle, props.xTitle, props.yTitle, props.height, props.xMax, props.yMax, props.yTickInterval)
    expect(pieChart.props().config.setting).toEqual('value')
  })

})
