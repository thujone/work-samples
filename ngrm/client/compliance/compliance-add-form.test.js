import React from 'react'
import { shallow } from 'enzyme'
import { Link } from 'react-router-dom'
import ValidationSummary from '../components/validation/validation-summary'
import {
  TextField
} from '../components/field'
import ComplianceAddForm from './compliance-add-form'


describe("Compliance Add Form", () => {

  let props

  beforeEach(() => {
    props = {
      history: [],
      engagementId: "engagementId",
      entitlements: {},
      ui: {
        ValidationErrors: {}
      },
      actions: {
        addComplianceScheme: jest.fn()
      }
    }
  })

  it("should render validation summary", () => {
    let subject = shallow(<ComplianceAddForm {...props} />)
    let validationSummary = subject.find(ValidationSummary)
    expect(validationSummary.props().id).toEqual("compliance-add-form-validation-summary")
    expect(validationSummary.props().validationErrors).toEqual(props.ui.ValidationErrors)
  })

  it("should render Name text field", () => {
    props.entitlements['Add'] = 1
    props.ui.ValidationErrors['Name'] = { name: 'errors' }

    let subject = shallow(<ComplianceAddForm {...props} />)
    let field = subject.findWhere(f => f.props().label === "Name")
    expect(field.props().id).toEqual("compliance-add-name")
    expect(field.props().labelClassName).toEqual("col-md-2")
    expect(field.props().required).toEqual(true)
    expect(field.props().entitlement).toEqual(1)
    expect(field.props().hasError).toBeTruthy()
    expect(field.props().value).toEqual("")
    expect(field.props().inputClassName).toEqual("col-md-10 input-wrapper")
  })

  it("should handle Name on change", () => {
    let event = {
      target: {
        value: "Value"
      }
    }

    let subject = shallow(<ComplianceAddForm {...props} />)
    let field = subject.findWhere(f => f.props().label === "Name")
    field.props().onChange(event)
    expect(subject.state('name')).toEqual("Value")
  })

  it("should render save button", () => {
    let subject = shallow(<ComplianceAddForm {...props} />)
    let saveButton = subject.find("#compliance-scheme-add-button")
    expect(saveButton.props().className).toEqual("btn btn-alternate")
  })

  it("should handle save button on click", () => {
    let subject = shallow(<ComplianceAddForm {...props} />)
    subject.find("#compliance-scheme-add-button").simulate("click")
    expect(props.actions.addComplianceScheme).toHaveBeenCalledWith(props.engagementId, subject.state('name'), props.history)
  })

})
