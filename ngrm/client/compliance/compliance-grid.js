import React from 'react'
import * as endpoints from '../constants/endpoints'
import * as routes from '../constants/routes'
import TableView, {
  TextCell,
  SortableHeader,
  TextFilterHeader,
  SelectFilterHeader,
  stringComparator,
  dateComparator,
  textFilter,
  Pager,
  TotalCount,
  DetailLinkCell,
  equalsFilter
} from '../components/table'
import { SecuredLinkButton as LinkButton } from '../components/buttons/link-button'
import { SecureExportButton as ExportButton } from '../components/buttons/export-button'
import FileImport from '../components/file-import'
import { PieChart } from '../components/charts'
import './compliance-grid.css'

class ComplianceGrid extends React.Component {

  componentDidMount() {
    this.clearFilters()
  }

  createEvent(value) {
    return { target: { value } }
  }

  clearFilters() {
    this.props.table.handleFilterChange("SectionTitle", textFilter)(this.createEvent(""))
    this.props.table.handleFilterChange("Rule", textFilter)(this.createEvent(""))
    this.props.table.handleFilterChange("CmmiStatus", textFilter)(this.createEvent(""))
    this.props.table.handleFilterChange("Compliant", textFilter)(this.createEvent(""))
    this.props.table.handleFilterChange("RemediationResource", textFilter)(this.createEvent(""))
    this.props.table.handleFilterChange("RemediationDate", textFilter)(this.createEvent(""))
  }

  render() {
    const props = this.props

    return (
      <div className='container-fluid'>
        <div className="row">
          <PieChart
            id="maturity-chart"
            title="Maturity Levels"
            subtitle="Click the slice to view by maturity"
            height="300"
            legend={true}
            className="col-md-6"
            chart={props.charts.byMaturityLevelChart}
            onClick={(e) => {
              this.clearFilters()
              props.table.handleFilterChange("CmmiStatus", equalsFilter)(this.createEvent(e.point.name))
            }}
          />
          <PieChart
            id="compliance-chart"
            title="Gap Review"
            subtitle="Click the slice to view by gap"
            height="300"
            legend={true}
            className="col-md-6"
            chart={props.charts.byGapReviewChart}
            onClick={(e) => {
              this.clearFilters()
              props.table.handleFilterChange("Compliant", equalsFilter)(this.createEvent(e.point.name))
            }}
          />
        </div>

        <div className="table-btn-action">
          <TotalCount
            totalRowCount={props.table.filteredAndSorted.length}
            id={'complianceTotalCount'}
            label={'Total compliance rule(s)'}
          />

          <ExportButton
            entitlement={props.entitlements['Export']}
            exportURL={endpoints.EXPORT_COMPLIANCE}
            ids={props.table.page.map(r => r.Id)}
            engagementId={props.engagementId}
            schemeId={props.schemeId}
            name='Compliance Rules'
          />

          {/* Id <= 0 returns new Compliance Rule */}
          {
            Number.isInteger(props.entitlements['Add']) &&
            <LinkButton
              id="compliance-add-button"
              visible
              entitlement={props.entitlements['Add']}
              route={`${routes.COMPLIANCE_PAGE}/${props.engagementId}/${props.schemeId}/0`}
              className="btn btn-primary pull-right"
              label="Add Compliance Rule"
            />
          }

          {
            Number.isInteger(props.entitlements['Import']) &&
            <div className="pull-right">
              <FileImport
                id="complianceGridImport"
                accept=".csv"
                expand_label="Import"
                save_label="Import CSV"
                saving_label="Uploading Compliance"
                engagementId={props.engagementId}
                schemeId={props.schemeId}
                onUpload={props.actions.handleUpload(props.table)}
              />
            </div>
          }

          <div className="clearfix"></div>
        </div>

        <hr />

        <TableView
          headers={
            [
              {
                component: SortableHeader,
                props: {
                  title: "Title",
                  sort: props.table.sort["SectionTitle"],
                  onClick: props.table.handleSort("SectionTitle", stringComparator)
                }
              },
              {
                component: SortableHeader,
                props: {
                  title: "Rule",
                  sort: props.table.sort["Rule"],
                  onClick: props.table.handleSort("Rule", stringComparator)
                }
              },
              {
                component: SortableHeader,
                props: {
                  title: "Maturity Level",
                  sort: props.table.sort["CmmiStatusId"],
                  onClick: props.table.handleSort("CmmiStatusId", stringComparator)
                }
              },
              {
                component: SortableHeader,
                props: {
                  title: "Compliance",
                  sort: props.table.sort["CompliantStatusId"],
                  onClick: props.table.handleSort("CompliantStatusId", stringComparator)
                }
              },
              {
                component: SortableHeader,
                props: {
                  title: "Resource",
                  sort: props.table.sort["RemediationResource"],
                  onClick: props.table.handleSort("RemediationResource", stringComparator)
                }
              },
              {
                component: SortableHeader,
                props: {
                  title: "Remediation",
                  sort: props.table.sort["RemediationDate"],
                  onClick: props.table.handleSort("RemediationDate", dateComparator)
                }
              }

            ]
          }
          filters={[
            {
              component: TextFilterHeader,
              props: {
                onChange: props.table.handleFilterChange("SectionTitle", textFilter),
                value: props.table.filters['SectionTitle'] ? props.table.filters['SectionTitle'].value : ''
              }
            },
            {
              component: TextFilterHeader,
              props: {
                onChange: props.table.handleFilterChange("Rule", textFilter),
                value: props.table.filters['Rule'] ? props.table.filters['Rule'].value : ''
              }
            },
            {
              component: SelectFilterHeader,
              props: {
                children: ['', 'N/A', 'None', 'Initial', 'Repeatable', 'Defined', 'Managed', 'Optimizing'].map((val, i) => <option key={i} value={val}>{val}</option>),
                onChange: props.table.handleFilterChange("CmmiStatus", equalsFilter),
                value: props.table.filters['CmmiStatus'] ? props.table.filters['CmmiStatus'].value : ''
              }
            },
            {
              component: SelectFilterHeader,
              props: {
                children: ['', 'Unknown', 'N/A', 'Compliant', 'Non-Compliant', 'Not Tested'].map((val, i) => <option key={i} value={val}>{val}</option>),
                onChange: props.table.handleFilterChange("Compliant", equalsFilter),
                value: props.table.filters['Compliant'] ? props.table.filters['Compliant'].value : ''
              }
            },
            {
              component: TextFilterHeader,
              props: {
                onChange: props.table.handleFilterChange("RemediationResource", textFilter),
                value: props.table.filters['RemediationResource'] ? props.table.filters['RemediationResource'].value : ''
              }
            },
            {
              component: TextFilterHeader,
              props: {
                onChange: props.table.handleFilterChange("RemediationDate", textFilter),
                value: props.table.filters['RemediationDate'] ? props.table.filters['RemediationDate'].value : ''
              }
            }
          ]}
          cells={row => [
            {
              component: TextCell,
              props: {
                item: row,
                col: { field: 'SectionTitle' }
              }
            },
            {
              component: DetailLinkCell,
              props: {
                item: row,
                col: { field: 'Rule' },
                path: `${routes.COMPLIANCE_PAGE}/${props.selectedEngagement}/${props.schemeId}/${row.Id}`
              }
            },
            {
              component: TextCell,
              props: {
                item: row,
                col: { field: 'CmmiStatus' }
              }
            },
            {
              component: TextCell,
              props: {
                item: row,
                col: { field: 'Compliant' }
              }
            },
            {
              component: TextCell,
              props: {
                item: row,
                col: { field: 'RemediationResource' }
              }
            },
            {
              component: TextCell,
              props: {
                item: row,
                col: { field: 'RemediationDate' }
              }
            }
          ]
          }
          page={props.table.page}
          onDelete={Number.isInteger(props.entitlements['Remove']) ? props.table.deleteRow : null}
        />

        <Pager
          {...props.table}
          totalRowCount={props.table.filteredAndSorted.length}
        />
      </div>
    )
  }
} // class ComplianceGrid

export default ComplianceGrid
