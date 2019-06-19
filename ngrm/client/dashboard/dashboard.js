import React, { Component } from 'react'
import PropTypes from 'prop-types'
import BrandingContainer from '../containers/branding-selector/branding-container'
import { GaugeChart, FilterableColumnChart, ChartSwitcher } from '../components/charts'
import AlertSummary from '../components/alert-summary'
import './dashboard.css'

export default class Dashboard extends Component {

  constructor(props) {
    super(props)

    this.state = {
      engagementId: null
    }

    this.update = (engagementId) => {
      this.setState({ engagementId })
      props.actions.getDashboardCharts(engagementId)
    }
  }

  componentDidMount() {
    const { engagementId } = this.props

    if (engagementId) {
      this.update(engagementId)
    }
  }

  componentDidUpdate() {
    const { engagementId } = this.props

    if (engagementId && this.state.engagementId !== engagementId) {
      this.update(engagementId)
    }
  }

  render() {
    const { charts } = this.props

    return (
      <div>
        <BrandingContainer />

        {this.props.engagementId && this.props.engagementId >= 0 &&
        <div>
          <div className="row">
            <div className="col-md-7">
              <AlertSummary />
            </div>

            <div className="col-md-5">
              <GaugeChart
                id="overall-risk-chart"
                title="Overall Risk Score"
                subtitle={charts.riskScore}
                height="250"
                className="panel panel-default"
                chart={charts.riskGaugeChart}
              />
            </div>
          </div>

          <div id='risks-and-vulns-chart' className={'row group-wrapper ' + (charts.showRisksAndVulnsChart ? 'show-chart' : 'hide-chart')}>
            <FilterableColumnChart
              id="mitigation-summary-risks-and-vulns"
              chartWrapperId="mitigation-summary-risks-and-vulns-wrapper"
              className="col-md-12"
              title="Remediation Summary"
              filterLabel="Phase"
              height="450"
              charts={charts.mitigationSummaryRisksAndVulns}
              isDualAxis={true}
            />
            <ChartSwitcher
              showChartSwitcher={this.props.actions.showChartSwitcher}
              hideChartSwitcher={this.props.actions.hideChartSwitcher}
              switchToRisksAndVulns={this.props.actions.showRisksAndVulnsChart}
              switchToRisks={this.props.actions.showRisksChart}
              switchToVulns={this.props.actions.showVulnsChart}
              visible={charts.showChartSwitcher}
            />
          </div>

          <div id='vulns-chart' className={'row group-wrapper ' + (charts.showVulnsChart ? 'show-chart' : 'hide-chart')}>
            <FilterableColumnChart
              id="mitigation-summary-chart"
              chartWrapperId="mitigation-summary-chart-wrapper"
              className="col-md-12"
              title="Remediation Summary"
              filterLabel="Risk Title"
              height="450"
              charts={charts.mitigationSummaryChart}
            />
            <ChartSwitcher
              showChartSwitcher={this.props.actions.showChartSwitcher}
              hideChartSwitcher={this.props.actions.hideChartSwitcher}
              switchToRisksAndVulns={this.props.actions.showRisksAndVulnsChart}
              switchToRisks={this.props.actions.showRisksChart}
              switchToVulns={this.props.actions.showVulnsChart}
              visible={charts.showChartSwitcher}
            />
          </div>

          <div id='risks-chart' className={'row group-wrapper ' + (charts.showRisksChart ? 'show-chart' : 'hide-chart')}>
          <FilterableColumnChart
            id="mitigation-summary-risks-by-phase"
            chartWrapperId="mitigation-summary-risks-by-phase-wrapper"
            className="col-md-12"
            title="Remediation Summary"
            filterLabel="Phase"
            height="450"
            charts={charts.mitigationSummaryRisksByPhase}
          />
          <ChartSwitcher
            showChartSwitcher={this.props.actions.showChartSwitcher}
            hideChartSwitcher={this.props.actions.hideChartSwitcher}
            switchToRisksAndVulns={this.props.actions.showRisksAndVulnsChart}
            switchToRisks={this.props.actions.showRisksChart}
            switchToVulns={this.props.actions.showVulnsChart}
            visible={charts.showChartSwitcher}
          />
        </div>
        </div>
        }
  
      </div>
    )
  }
}

Dashboard.propTypes = {
  engagementId: PropTypes.string,
  charts: PropTypes.object,
  actions: PropTypes.shape({
    getDashboardCharts: PropTypes.func.isRequired
  })
}
