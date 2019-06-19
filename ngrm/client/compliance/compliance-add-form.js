import React from 'react'
import ValidationSummary from '../components/validation/validation-summary'
import {
  TextField
} from '../components/field'
import './compliance-add-form.css'

class ComplianceAddForm extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      name: ''
    }
  }

  handleNameChange(name) {
    this.setState({ name })
  }

  render() {
    return (
      <div>
        <ValidationSummary
          id="compliance-add-form-validation-summary"
          validationErrors={this.props.ui.ValidationErrors}
        />

        <form className="form-inline">
          <TextField
            label='Name'
            entitlement={this.props.entitlements['Add']}
            hasError={this.props.ui.ValidationErrors['Name']}
            id='compliance-add-name'
            required
            onChange={(e) => this.handleNameChange(e.target.value)}
            value={this.state.name}
            inputClassName='col-md-10 input-wrapper'
            labelClassName='col-md-2'
          />

          <button
            id="compliance-scheme-add-button"
            type="button"
            className="btn btn-alternate"
            onClick={(e) => this.props.actions.addComplianceScheme(this.props.engagementId, this.state.name, this.props.history)}
          >
            Save
          </button>
        </form>
      </div>
    )
  }
}
export default ComplianceAddForm
