import React from 'react'
import { shallow, mount } from 'enzyme'
import GaugeChart from './gauge-chart'
import ReactHighcharts from 'react-highcharts'
import * as factory from './chart-factory'

describe("Gauge Chart", () => {
  let props
  const mockConfig = {
    setting: 'value'
  }

  beforeEach(() => {
    factory.createGaugeChartConfig = jest.fn().mockReturnValue(mockConfig)

    props = {
      id: 'id',
      title: 'title',
      subtitle: 'subtitle',
      height: 'height',
      className: 'col-md-6',
      chart: { Series: 'seriesData' }
    }
  })

  it("should render with props", () => {
    const subject = shallow(<GaugeChart {...props} />)

    const wrapper = subject.find('div')
    expect(wrapper.props().id).toEqual('id')
    expect(wrapper.props().className).toEqual('col-md-6')

    const gaugeChart = wrapper.find(ReactHighcharts)
    expect(gaugeChart.props().isPureConfig).toEqual(true)
    expect(factory.createGaugeChartConfig).toHaveBeenCalledWith(props.title, props.height)
    expect(gaugeChart.props().config.setting).toEqual('value')
  })
})
