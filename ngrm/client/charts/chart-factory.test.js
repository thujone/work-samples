import * as factory from './chart-factory'

const expectBaseConfigMembers = (config, title, subtitle, height) => {
  expect(config.credits.enabled).toEqual(false)
  expect(config.title.text).toEqual(title)
  expect(config.subtitle.text).toEqual(subtitle)
  expect(config.chart.height).toEqual(height)
  expect(config.colors).toEqual(factory.defaultColors)
  expect(config.tooltip.useHTML).toEqual(true)
  expect(config.tooltip.hideDelay).toEqual(200)
  expect(config.tooltip.headerFormat).toEqual('<span style="color:{point.color}">{point.key}</span>')
  expect(config.plotOptions.series.dataLabels.enabled).toEqual(true)
  expect(config.plotOptions.series.dataLabels.format).toEqual('{point.y}')
  expect(config.plotOptions.series.dataLabels.distance).toEqual(10)
  expect(config.plotOptions.series.dataLabels.style.textOutline).toEqual(false)
  expect(config.drilldown.drillUpButton.relativeTo).toEqual('spacingBox')
  expect(config.drilldown.drillUpButton.position.align).toEqual('right')
  expect(config.drilldown.drillUpButton.position.verticalAlign).toEqual('top')
  expect(config.drilldown.drillUpButton.position.x).toEqual(10)
  expect(config.drilldown.drillUpButton.position.y).toEqual(50)
}

describe("Chart Factory", () => {

  describe("addSeriesClickHandler", () => {
    it("should add click handler when series data exists", () => {
      const series = [{
        cursor: '',
        data: [{ events: {} }]
      }]
      factory.addSeriesClickHandler(series, 'onClick')

      expect(series[0].cursor).toEqual('pointer')
      expect(series[0].data[0].events.click).toEqual('onClick')
    })

    it("should not add click handler when series data missing", () => {
      const series = []
      factory.addSeriesClickHandler(series, 'onClick')

      expect(series).toHaveLength(0)
    })
  })

  describe("createConfig", () => {
    it("should return base config object", () => {
      const config = factory.createConfig('title', 'subtitle', 'height')

      expectBaseConfigMembers(config, 'title', 'subtitle', 'height')
    })
  })

  describe("createPieChartConfig", () => {
    it("should return config object", () => {
      const config = factory.createPieChartConfig('title', 'subtitle', 'height')

      expectBaseConfigMembers(config, 'title', 'subtitle', 'height')
      expect(config.chart.type).toEqual('pie')
      expect(config.tooltip.pointFormat).toEqual('<div><b>{point.percentage:.1f}%</b> of total {series.name}</div>')
      expect(config.plotOptions.pie.showInLegend).toEqual(true)
    })
  })

  describe("createBarChartConfig", () => {
    it("should return config object", () => {
      const config = factory.createBarChartConfig('title', 'subtitle', 'xTitle', 'yTitle', 'height')

      expectBaseConfigMembers(config, 'title', 'subtitle', 'height')
      expect(config.chart.type).toEqual('bar')
      expect(config.tooltip.pointFormat).toEqual('<div><b>{point.severityName}</b></div>')
      expect(config.xAxis.type).toEqual('category')
      expect(config.xAxis.title.text).toEqual('xTitle')
      expect(config.yAxis.title.text).toEqual('yTitle')
    })
  })

  describe("createColumnChartConfig", () => {
    it("should return config object", () => {
      const config = factory.createColumnChartConfig('title', 'subtitle', 'xTitle', 'yTitle', 'height')

      expectBaseConfigMembers(config, 'title', 'subtitle', 'height')
      expect(config.chart.type).toEqual('column')
      expect(config.tooltip.pointFormatter).toBeInstanceOf(Function)
      expect(config.xAxis.type).toEqual('category')
      expect(config.xAxis.title.text).toEqual('xTitle')
      expect(config.xAxis.labels.useHTML).toEqual(true)
      expect(config.xAxis.labels.reserveSpace).toEqual(true)
      expect(config.xAxis.labels.align).toEqual('center')
      expect(config.xAxis.labels.formatter).toBeInstanceOf(Function)
      expect(config.yAxis.title.text).toEqual('yTitle')
    })

    it("should handle formatting tooltip", () => {
      const config = factory.createColumnChartConfig('title', 'subtitle', 'xTitle', 'yTitle', 'height')
      const point = {
        y: 2,
        series: {
          name: 'seriesName',
          yData: [1, 2] // percentage = y/sum (2/3) = 66.7%
        },
        pointFormatter: config.tooltip.pointFormatter
      }

      const format = point.pointFormatter()
      expect(format).toEqual('<div><b>66.7%</b> of total seriesName</div>')
    })

    it("should handle formatting labels to word wrap", () => {
      const config = factory.createColumnChartConfig('title', 'subtitle', 'xTitle', 'yTitle', 'height')
      const point = {
        value: 'some/value',
        formatter: config.xAxis.labels.formatter
      }

      const format = point.formatter()
      expect(format).toEqual('some / value')
    })

    it("should handle formatting labels over max length", () => {
      const config = factory.createColumnChartConfig('title', 'subtitle', 'xTitle', 'yTitle', 'height')
      let value = ''
      for (let i = 0; i <= factory.xAxisLabelMaxLength; i++) {
        value += '*'
      }
      const point = {
        value,
        formatter: config.xAxis.labels.formatter
      }

      const format = point.formatter()
      expect(format).toEqual(`<span title="${point.value}">********************************...</span>`)
    })
  })

  describe("createGaugeChartConfig", () => {
    it("should return config object", () => {
      const config = factory.createGaugeChartConfig('title', 'height')

      //expectBaseConfigMembers(config, 'title', '', 'height')
      expect(config.chart.type).toEqual(undefined)
      expect(config.tooltip.enabled).toEqual(false)
      expect(config.plotOptions.series.shadow).toEqual(false)
      expect(config.plotOptions.series.borderColor).toEqual(null)
      expect(config.plotOptions.series.borderWidth).toEqual(1)
      expect(config.plotOptions.pie.dataLabels.distance).toEqual(-18)
      expect(config.plotOptions.pie.dataLabels.style.textOutline).toEqual(false)
      expect(config.plotOptions.pie.dataLabels.style.fontSize).toEqual('26px')
      expect(config.plotOptions.pie.dataLabels.style.textOutline).toEqual(false)
      expect(config.plotOptions.pie.size).toEqual('230%')
      expect(config.plotOptions.pie.startAngle).toEqual(-90)
      expect(config.plotOptions.pie.endAngle).toEqual(90)
      expect(config.plotOptions.pie.center).toEqual(['50%', '105%'])
      expect(config.plotOptions.pie.shadow).toEqual(false)
      expect(config.plotOptions.pie.states.hover.enabled).toEqual(false)
      expect(config.title.align).toEqual('left')
      expect(config.title.y).toEqual(20)
      expect(config.subtitle.align).toEqual('center')
      expect(config.subtitle.verticalAlign).toEqual('bottom')
      expect(config.subtitle.y).toEqual(-40)
      expect(config.subtitle.style).toEqual({ "fontSize": "48px", "color": "#333" })
    })
  })

  describe("createFilterableComlumnChartConfig", () => {
    it("should return config object", () => {
      const config = factory.createFilterableColumnChartConfig('title', 'subtitle', 'height')

      //expectBaseConfigMembers(config, 'title', 'subtitle', 'height')
      expect(config.chart.type).toEqual('column')
      expect(config.legend.verticalAlign).toEqual('top')
      expect(config.legend.y).toEqual(-28)
      expect(config.title.y).toEqual(-100)
      expect(config.plotOptions.series.shadow).toEqual(false)
      expect(config.plotOptions.series.pointPadding).toEqual(0)
      expect(config.plotOptions.series.groupPadding).toEqual(.085)
      expect(config.tooltip.pointFormatter).toBeInstanceOf(Function)
      expect(config.xAxis.type).toEqual('category')
      expect(config.xAxis.tickInterval).toEqual(1)
      expect(config.xAxis.tickWidth).toEqual(0)
      expect(config.xAxis.gridLineWidth).toEqual(1)
      expect(config.xAxis.labels.style.fontSize).toEqual('12px')
      expect(config.xAxis.labels.useHTML).toEqual(true)
      expect(config.xAxis.labels.reserveSpace).toEqual(true)
      expect(config.xAxis.labels.align).toEqual('center')
      expect(config.xAxis.labels.formatter).toBeInstanceOf(Function)
      expect(config.yAxis.title.text).toEqual(null)
      expect(config.yAxis.labels.style.fontSize).toEqual('12px')
      expect(config.yAxis.className).toEqual('y-labels')
      expect(config.yAxis.align).toEqual('center')
      expect(config.yAxis.tickInterval).toEqual(10)
      expect(config.yAxis.tickPosition).toEqual('inside')
      expect(config.yAxis.showFirstLabel).toEqual(false)
      expect(config.yAxis.showLastLabel).toEqual(false)
    })

    it("should handle formatting tooltip", () => {
      const config = factory.createFilterableColumnChartConfig('title', 'subtitle', 'height')
      const point = {
        y: 25,
        pointFormatter: config.tooltip.pointFormatter
      }
      const format = point.pointFormatter()
      expect(format).toEqual('<div><b>25</b> Vulnerabilities</div>')
    })
  })

  describe.skip("componentDidUpdate", () => {
    let component, mockSeries, mockDrilldown

    beforeEach(() => {
      mockSeries = [{ data: [{ events: {} }] }]
      mockDrilldown = [{ data: [{ events: {} }] }]
      component = {
        state: {
          series: [],
          drilldown: { series: [] }
        },
        refs: {},
        props: {
          chart: {
            Series: [],
            DrilldownSeries: []
          },
          subtitle: 'subtitle',
          id: 'id',
          onClick: () => { }
        },
        setState: jest.fn()
      }
    })

    it("should not setState when chart is undefined", () => {
      component.props.chart = undefined
      factory.componentDidUpdate(component)
      expect(component.setState).not.toHaveBeenCalled()
    })

    it("should add click handler for series", () => {
      component.props.chart.Series = mockSeries
      factory.componentDidUpdate(component)
      expect(component.props.chart.Series[0].data[0].events.click).toEqual(component.props.onClick)
    })

    it("should add click handler for drilldown", () => {
      component.props.chart.DrilldownSeries = mockDrilldown
      factory.componentDidUpdate(component)
      expect(component.props.chart.DrilldownSeries[0].data[0].events.click).toEqual(component.props.onClick)
    })

    it("should setState when chart series has changed", () => {
      component.props.chart.Series = mockSeries
      factory.componentDidUpdate(component)
      expect(component.setState).toHaveBeenCalledWith({
        series: component.props.chart.Series,
        subtitle: { text: component.props.subtitle }
      })
    })

    it("should not setState when chart series has not changed", () => {
      component.state.series = mockSeries
      component.props.chart.Series = mockSeries
      factory.componentDidUpdate(component)
      expect(component.setState).not.toHaveBeenCalled()
    })

    it("should setState when chart drilldown has changed", () => {
      component.state.series = mockSeries
      component.props.chart.Series = mockSeries
      component.props.chart.DrilldownSeries = mockDrilldown
      factory.componentDidUpdate(component)
      expect(component.setState).toHaveBeenCalledWith({
        series: component.props.chart.Series,
        subtitle: { text: component.props.subtitle },
        drilldown: { series: component.props.chart.DrilldownSeries }
      })
    })

    it("should not setState when chart drilldown has not changed", () => {
      component.state.series = mockSeries
      component.props.chart.Series = mockSeries
      component.state.drilldown.series = mockDrilldown
      component.props.chart.DrilldownSeries = mockDrilldown
      factory.componentDidUpdate(component)
      expect(component.setState).not.toHaveBeenCalled()
    })
  })

})
