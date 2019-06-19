import React from 'react'
import { Link } from 'react-router-dom'
import ValidationSummary from '../components/validation/validation-summary'
import * as routes from '../constants/routes'
import {
  TextField,
  TextareaField,
  SelectField,
  ReadOnlyField,
  DatepickerField,
  SelectResourceField
} from '../components/field'
import './compliance-detail.css'

const ComplianceDetail = props => {

  return (
    <div>
      <ValidationSummary id="compliance-validation-summary" validationErrors={props.ui.ValidationErrors} />
      <div className="row">
        <div className="col-md-9">
          <form className="form-horizontal">

            <div className="col-md-6">
              <TextField
                label='Rule'
                entitlement={props.entitlements['Rule']}
                hasError={props.ui.ValidationErrors['Rule']}
                id='compliance-rule'
                required
                onChange={(e) => props.actions.handleRuleChange(e.target.value)}
                value={props.compliance.Rule}
                inputClassName='col-md-6'
                labelClassName='col-md-6'
              />
              <TextField
                label='Section Title'
                entitlement={props.entitlements['SectionTitle']}
                hasError={props.ui.ValidationErrors['SectionTitle']}
                id='compliance-section-title'
                required
                onChange={(e) => props.actions.handleSectionTitleChange(e.target.value)}
                value={props.compliance.SectionTitle}
                inputClassName='col-md-6'
                labelClassName='col-md-6'
              />
              <TextField
                label='Subsection Title'
                entitlement={props.entitlements['SubsectionTitle']}
                hasError={props.ui.ValidationErrors['SubsectionTitle']}
                id='compliance-subsection-title'
                onChange={(e) => props.actions.handleSubsectionTitleChange(e.target.value)}
                value={props.compliance.SubsectionTitle}
                inputClassName='col-md-6'
                labelClassName='col-md-6'
              />
              <TextField
                label='Implementation'
                entitlement={props.entitlements['Implementation']}
                hasError={props.ui.ValidationErrors['Implementation']}
                id='compliance-implementation'
                onChange={(e) => props.actions.handleImplementationChange(e.target.value)}
                value={props.compliance.Implementation}
                inputClassName='col-md-6'
                labelClassName='col-md-6'
              />
            </div>
            <div className="col-md-6">
              <SelectField
                label='Compliance'
                entitlement={props.entitlements['CompliantStatusId']}
                hasError={props.ui.ValidationErrors['CompliantStatusId']}
                id='compliance-compliant'
                required
                onChange={(e) => props.actions.handleCompliantStatusChange(e.target.value)}
                value={props.compliance.CompliantStatusId}
                inputClassName='col-md-6'
                labelClassName='col-md-5'
              >
                <option value="">Select</option>
                {
                  props.compliance.CompliantStatusList &&
                  props.compliance.CompliantStatusList.map((option, index) => {
                    return (
                      <option key={index} value={option.ResourceId}>{option.ResourceName}</option>
                    )
                  })
                }
              </SelectField>
              <SelectField
                label='Maturity Level'
                entitlement={props.entitlements['CmmiStatusId']}
                hasError={props.ui.ValidationErrors['CmmiStatusId']}
                id='compliance-cmmi'
                required
                onChange={(e) => props.actions.handleCmmiStatusChange(e.target.value)}
                value={props.compliance.CmmiStatusId}
                inputClassName='col-md-6'
                labelClassName='col-md-5'
              >
                {
                  props.compliance.CmmiStatusList &&
                  props.compliance.CmmiStatusList.map((option, index) => {
                    return (
                      <option key={index} value={option.ResourceId}>{option.ResourceName}</option>
                    )
                  })
                }
              </SelectField>
              <TextareaField
                label='Current State'
                entitlement={props.entitlements['CurrentState']}
                hasError={props.ui.ValidationErrors['CurrentState']}
                id='compliance-current-state'
                rows='3'
                onChange={(e) => props.actions.handleCurrentStateChange(e.target.value)}
                value={props.compliance.CurrentState}
                inputClassName='col-md-6'
                labelClassName='col-md-5'
              />
            </div>

            <br />

            <div className="col-md-12">
              <TextareaField
                label='Subsection Text'
                entitlement={props.entitlements['SubsectionText']}
                hasError={props.ui.ValidationErrors['SubsectionText']}
                id='compliance-subsection-text'
                rows='4'
                onChange={(e) => props.actions.handleSubsectionTextChange(e.target.value)}
                value={props.compliance.SubsectionText}
                inputClassName='col-md-8'
                labelClassName='col-md-3'
              />
              <TextareaField
                label='Implementation Text'
                entitlement={props.entitlements['ImplementationSpecificText']}
                hasError={props.ui.ValidationErrors['ImplementationSpecificText']}
                id='compliance-implementation-specific-text'
                rows='4'
                onChange={(e) => props.actions.handleImplementationSpecificTextChange(e.target.value)}
                value={props.compliance.ImplementationSpecificText}
                inputClassName='col-md-8'
                labelClassName='col-md-3'
              />
              <TextareaField
                label='Reference Notes'
                entitlement={props.entitlements['ReferenceNotes']}
                hasError={props.ui.ValidationErrors['ReferenceNotes']}
                id='compliance-reference-notes'
                rows='4'
                onChange={(e) => props.actions.handleReferenceNotesChange(e.target.value)}
                value={props.compliance.ReferenceNotes}
                inputClassName='col-md-8'
                labelClassName='col-md-3'
              />
              <TextareaField
                label='Remediation Notes'
                entitlement={props.entitlements['RemediationNotes']}
                hasError={props.ui.ValidationErrors['RemediationNotes']}
                id='compliance-remediation-notes'
                rows='4'
                onChange={(e) => props.actions.handleRemediationNotesChange(e.target.value)}
                value={props.compliance.RemediationNotes}
                inputClassName='col-md-8'
                labelClassName='col-md-3'
              />
            </div>

          </form>
        </div>
        <div className="col-md-3 gutter">
          <div className="container-fluid">
            {
              (props.compliance.UpdatedBy || props.compliance.UpdatedDate || props.compliance.ImportedBy || props.compliance.ImportedDate) &&
              <h4>Information</h4>
            }
            {
              props.compliance.UpdatedBy &&
              <ReadOnlyField
                entitlement={0}
                title="Updated By"
                id="compliance-updated-by"
                value={props.compliance.UpdatedBy}
              />
            }
            {
              props.compliance.UpdatedDate &&
              <ReadOnlyField
                entitlement={0}
                title="Updated Date"
                id="compliance-updated-date"
                value={props.compliance.UpdatedDate}
              />
            }
            {
              props.compliance.ImportedBy &&
              <ReadOnlyField
                entitlement={0}
                title="Imported By"
                id="compliance-imported-by"
                value={props.compliance.ImportedBy}
              />
            }
            {
              props.compliance.ImportedDate &&
              <ReadOnlyField
                entitlement={0}
                title="Imported Date"
                id="compliance-imported-date"
                value={props.compliance.ImportedDate}
              />
            }

            <h4>Assignments</h4>
            <form>
              <SelectField
                label='Remediation Status'
                entitlement={props.entitlements['RemediationStatusId']}
                hasError={props.ui.ValidationErrors['RemediationStatusId']}
                id='compliance-remediation-status'
                onChange={(e) => props.actions.handleRemediationStatusChange(e.target.value)}
                value={props.compliance.RemediationStatusId}
              >
                <option value="">Select</option>
                {
                  props.compliance.RemediationStatusList &&
                  props.compliance.RemediationStatusList.map((option, index) => {
                    return (
                      <option key={index} value={option.ResourceId}>{option.ResourceName}</option>
                    )
                  })
                }
              </SelectField>

              <SelectResourceField
                resourceId={props.compliance.ResourceId}
                groupId={props.compliance.GroupId}
                resourceList={props.compliance.ResourceList}
                groupList={props.compliance.GroupList}
                entitlement={props.entitlements.RemediationResource}
                onChangeAction={props.actions.handleResourceAssignSave}
                hasError={props.ui.ValidationErrors.RemediationResource}
              />

              <DatepickerField
                id='compliance-remediation-date'
                label='Remediation Date'
                entitlement={props.entitlements['RemediationDate']}
                hasError={props.ui.ValidationErrors['RemediationDate']}
                visible={props.ui.showRemediationDatePicker}
                value={props.compliance.RemediationDate}
                onChange={(e) => props.actions.handleMitigationDateChange(e.target.value)}
                onClick={(e) => props.actions.handleMitigationDateClick()}
                onSelected={(value) => props.actions.handleMitigationDateSelected(value)}
                onClose={(e) => props.actions.handleMitigationDateClose()}
              />
            </form>
          </div>
        </div>
      </div>

      <div className="container-fluid">
        <br />
        <div className="pull-right">
          <button
            id="compliance-save-button"
            className="btn btn-default"
            disabled={props.compliance.IsFetching}
            onClick={(e) => props.actions.update(props.compliance, props.history, props.engagementId, props.match.params.schemeId)}
          >
            Save Compliance Rule
          </button>
          <Link
            id="compliance-cancel-button"
            to={`${routes.COMPLIANCE_PAGE}/t${props.match.params.schemeId}/${props.engagementId}/${props.match.params.schemeId}`}
            className="btn btn-alternate">
            Cancel
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ComplianceDetail
