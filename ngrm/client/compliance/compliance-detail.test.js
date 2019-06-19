import React from 'react'
import { shallow } from 'enzyme'
import { Link } from 'react-router-dom'
import ValidationSummary from '../components/validation/validation-summary'
import { SelectResourceField } from '../components/field'
import ComplianceDetail from './compliance-detail'
import * as routes from '../constants/routes'

describe("Compliance Detail", () => {
  let props

  beforeEach(() => {
    props = {
      history: [],
      match: {
        params: {
          schemeId: 'schemeId',
          complianceId: 'complianceId'
        }
      },
      engagementId: "engagementId",
      entitlements: {},
      compliance:{
        Rule: "rule",
        SectionTitle: "sectionTitle",
        SubsectionTitle: "subsectionTitle",
        SubsectionText: "subsectionText",
        CompliantStatusId: "compliantStatusId",
        CmmiStatusId: "cmmiStatusId",
        Implementation: "implementation",
        ImplementationSpecificText: "implementationSpecificText",
        CurrentState: "currentState",
        ReferenceNotes: "referenceNotes",
        RemediationNotes: "remediationNotes",
        UpdatedBy: "updatedBy",
        UpdatedDate: "updatedDate",
        ImportedBy: "importedBy",
        ImportedDate: "importedDate",
        RemediationStatusId: "remediationStatusId",
        RemediationDate: "mitigationDate"
      },
      ui: {
        ValidationErrors: {},
        showRemediationDatePicker: false
      },
      actions: {
        update: jest.fn(),
        handleRuleChange: jest.fn(),
        handleSectionTitleChange: jest.fn(),
        handleSubsectionTitleChange: jest.fn(),
        handleSubsectionTextChange: jest.fn(),
        handleCompliantStatusChange: jest.fn(),
        handleCmmiStatusChange: jest.fn(),
        handleImplementationChange: jest.fn(),
        handleImplementationSpecificTextChange: jest.fn(),
        handleCurrentStateChange: jest.fn(),
        handleReferenceNotesChange: jest.fn(),
        handleRemediationNotesChange: jest.fn(),
        handleRemediationStatusChange: jest.fn(),
        handleMitigationDateChange: jest.fn(),
        handleMitigationDateSelected: jest.fn(),
        handleMitigationDateClick: jest.fn(),
        handleMitigationDateClose: jest.fn(),
        handleResourceAssignSave: jest.fn()
      }
    }
  })

  it("should render validation summary", () => {
    let subject = shallow(<ComplianceDetail {...props} />)
    let validationSummary = subject.find(ValidationSummary)
    expect(validationSummary.props().id).toEqual("compliance-validation-summary")
    expect(validationSummary.props().validationErrors).toEqual(props.ui.ValidationErrors)
  })

  it("should render Rule text field", () => {
    props.entitlements['Rule'] = 1
    props.ui.ValidationErrors['Rule'] = {name:'errors'}

    let subject = shallow(<ComplianceDetail {...props} />)
    let field = subject.findWhere(f => f.props().label === "Rule")
    expect(field.props().id).toEqual("compliance-rule")
    expect(field.props().labelClassName).toEqual("col-md-6")
    expect(field.props().required).toEqual(true)
    expect(field.props().entitlement).toEqual(1)
    expect(field.props().hasError).toBeTruthy()
    expect(field.props().value).toEqual("rule")
    expect(field.props().inputClassName).toEqual("col-md-6")
  })

  it("should handle Rule on change", () => {
    let event = {
      target: {
        value: "Value"
      }
    }

    let subject = shallow(<ComplianceDetail {...props} />)
    let field = subject.findWhere(f => f.props().label === "Rule")
    field.props().onChange(event)
    expect(props.actions.handleRuleChange).toHaveBeenCalledWith("Value")
  })

  it("should render Section Title text field", () => {
    props.entitlements['SectionTitle'] = 1
    props.ui.ValidationErrors['SectionTitle'] = {name:'errors'}

    let subject = shallow(<ComplianceDetail {...props} />)
    let field = subject.findWhere(f => f.props().label === "Section Title")
    expect(field.props().id).toEqual("compliance-section-title")
    expect(field.props().labelClassName).toEqual("col-md-6")
    expect(field.props().required).toEqual(true)
    expect(field.props().entitlement).toEqual(1)
    expect(field.props().hasError).toBeTruthy()
    expect(field.props().value).toEqual("sectionTitle")
    expect(field.props().inputClassName).toEqual("col-md-6")
  })

  it("should handle Section Title on change", () => {
    let event = {
      target: {
        value: "Value"
      }
    }

    let subject = shallow(<ComplianceDetail {...props} />)
    let field = subject.findWhere(f => f.props().label === "Section Title")
    field.props().onChange(event)
    expect(props.actions.handleSectionTitleChange).toHaveBeenCalledWith("Value")
  })

  it("should render Subsection Title text field", () => {
    props.entitlements['SubsectionTitle'] = 1
    props.ui.ValidationErrors['SubsectionTitle'] = {name:'errors'}

    let subject = shallow(<ComplianceDetail {...props} />)
    let field = subject.findWhere(f => f.props().label === "Subsection Title")
    expect(field.props().id).toEqual("compliance-subsection-title")
    expect(field.props().labelClassName).toEqual("col-md-6")
    expect(field.props().required).not.toBeDefined()
    expect(field.props().entitlement).toEqual(1)
    expect(field.props().hasError).toBeTruthy()
    expect(field.props().value).toEqual("subsectionTitle")
    expect(field.props().inputClassName).toEqual("col-md-6")
  })

  it("should handle Subsection Title on change", () => {
    let event = {
      target: {
        value: "Value"
      }
    }

    let subject = shallow(<ComplianceDetail {...props} />)
    let field = subject.findWhere(f => f.props().label === "Subsection Title")
    field.props().onChange(event)
    expect(props.actions.handleSubsectionTitleChange).toHaveBeenCalledWith("Value")
  })

  it("should render Subsection Text textarea field", () => {
    props.entitlements['SubsectionText'] = 1
    props.ui.ValidationErrors['SubsectionText'] = {name:'errors'}

    let subject = shallow(<ComplianceDetail {...props} />)
    let field = subject.findWhere(f => f.props().label === "Subsection Text")
    expect(field.props().id).toEqual("compliance-subsection-text")
    expect(field.props().labelClassName).toEqual("col-md-3")
    expect(field.props().entitlement).toEqual(1)
    expect(field.props().hasError).toBeTruthy()
    expect(field.props().value).toEqual("subsectionText")
    expect(field.props().inputClassName).toEqual("col-md-8")
    expect(field.props().rows).toEqual("4")
  })

  it("should handle Subsection Text on change", () => {
    let event = {
      target: {
        value: "Value"
      }
    }

    let subject = shallow(<ComplianceDetail {...props} />)
    let field = subject.findWhere(f => f.props().label === "Subsection Text")
    field.props().onChange(event)
    expect(props.actions.handleSubsectionTextChange).toHaveBeenCalledWith("Value")
  })

  it("should render Compliant select field", () => {
    props.entitlements['CompliantStatusId'] = 1
    props.ui.ValidationErrors['CompliantStatusId'] = {name:'errors'}
    props.compliance.CompliantStatusList = [
      { ResourceId: "resourceId", ResourceName: "resourceName" }
    ]

    let subject = shallow(<ComplianceDetail {...props} />)
    let field = subject.findWhere(f => f.props().label === "Compliance")
    expect(field.props().id).toEqual("compliance-compliant")
    expect(field.props().labelClassName).toEqual("col-md-5")
    expect(field.props().required).toEqual(true)
    expect(field.props().entitlement).toEqual(1)
    expect(field.props().hasError).toBeTruthy()
    expect(field.props().value).toEqual("compliantStatusId")
    expect(field.props().inputClassName).toEqual("col-md-6")

    let options = field.find('option')
    expect(options.at(0).props().value).toEqual("")
    expect(options.at(0).text()).toEqual("Select")
    expect(options.at(1).props().value).toEqual("resourceId")
    expect(options.at(1).text()).toEqual("resourceName")
  })

  it("should handle Compliant on change", () => {
    let event = {
      target: {
        value: "Value"
      }
    }

    let subject = shallow(<ComplianceDetail {...props} />)
    let field = subject.findWhere(f => f.props().label === "Compliance")
    field.props().onChange(event)
    expect(props.actions.handleCompliantStatusChange).toHaveBeenCalledWith("Value")
  })

  it("should render CMMI select field", () => {
    props.entitlements['CmmiStatusId'] = 1
    props.ui.ValidationErrors['CmmiStatusId'] = {name:'errors'}
    props.compliance.CmmiStatusList = [
      { ResourceId: "resourceId", ResourceName: "resourceName" }
    ]

    let subject = shallow(<ComplianceDetail {...props} />)
    let field = subject.findWhere(f => f.props().label === "Maturity Level")
    expect(field.props().id).toEqual("compliance-cmmi")
    expect(field.props().labelClassName).toEqual("col-md-5")
    expect(field.props().required).toEqual(true)
    expect(field.props().entitlement).toEqual(1)
    expect(field.props().hasError).toBeTruthy()
    expect(field.props().value).toEqual("cmmiStatusId")
    expect(field.props().inputClassName).toEqual("col-md-6")

    let options = field.find('option')
    expect(options.at(0).props().value).toEqual("resourceId")
    expect(options.at(0).text()).toEqual("resourceName")
  })

  it("should handle CMMI on change", () => {
    let event = {
      target: {
        value: "Value"
      }
    }

    let subject = shallow(<ComplianceDetail {...props} />)
    let field = subject.findWhere(f => f.props().label === "Maturity Level")
    field.props().onChange(event)
    expect(props.actions.handleCmmiStatusChange).toHaveBeenCalledWith("Value")
  })

  it("should render Implementation text field", () => {
    props.entitlements['Implementation'] = 1
    props.ui.ValidationErrors['Implementation'] = {name:'errors'}

    let subject = shallow(<ComplianceDetail {...props} />)
    let field = subject.findWhere(f => f.props().label === "Implementation")
    expect(field.props().id).toEqual("compliance-implementation")
    expect(field.props().labelClassName).toEqual("col-md-6")
    expect(field.props().required).not.toBeDefined()
    expect(field.props().entitlement).toEqual(1)
    expect(field.props().hasError).toBeTruthy()
    expect(field.props().value).toEqual("implementation")
    expect(field.props().inputClassName).toEqual("col-md-6")
  })

  it("should handle Implementation on change", () => {
    let event = {
      target: {
        value: "Value"
      }
    }

    let subject = shallow(<ComplianceDetail {...props} />)
    let field = subject.findWhere(f => f.props().label === "Implementation")
    field.props().onChange(event)
    expect(props.actions.handleImplementationChange).toHaveBeenCalledWith("Value")
  })

  it("should render Implementation Specific Text textarea field", () => {
    props.entitlements['ImplementationSpecificText'] = 1
    props.ui.ValidationErrors['ImplementationSpecificText'] = {name:'errors'}

    let subject = shallow(<ComplianceDetail {...props} />)
    let field = subject.findWhere(f => f.props().label === "Implementation Text")
    expect(field.props().id).toEqual("compliance-implementation-specific-text")
    expect(field.props().labelClassName).toEqual("col-md-3")
    expect(field.props().entitlement).toEqual(1)
    expect(field.props().hasError).toBeTruthy()
    expect(field.props().value).toEqual("implementationSpecificText")
    expect(field.props().inputClassName).toEqual("col-md-8")
    expect(field.props().rows).toEqual("4")
  })

  it("should handle Implementation Specific Text on change", () => {
    let event = {
      target: {
        value: "Value"
      }
    }

    let subject = shallow(<ComplianceDetail {...props} />)
    let field = subject.findWhere(f => f.props().label === "Implementation Text")
    field.props().onChange(event)
    expect(props.actions.handleImplementationSpecificTextChange).toHaveBeenCalledWith("Value")
  })

  it("should render Current State textarea field", () => {
    props.entitlements['CurrentState'] = 1
    props.ui.ValidationErrors['CurrentState'] = {name:'errors'}

    let subject = shallow(<ComplianceDetail {...props} />)
    let field = subject.findWhere(f => f.props().label === "Current State")
    expect(field.props().id).toEqual("compliance-current-state")
    expect(field.props().labelClassName).toEqual("col-md-5")
    expect(field.props().entitlement).toEqual(1)
    expect(field.props().hasError).toBeTruthy()
    expect(field.props().value).toEqual("currentState")
    expect(field.props().inputClassName).toEqual("col-md-6")
    expect(field.props().rows).toEqual("3")
  })

  it("should handle Current State on change", () => {
    let event = {
      target: {
        value: "Value"
      }
    }

    let subject = shallow(<ComplianceDetail {...props} />)
    let field = subject.findWhere(f => f.props().label === "Current State")
    field.props().onChange(event)
    expect(props.actions.handleCurrentStateChange).toHaveBeenCalledWith("Value")
  })

  it("should render Reference Notes textarea field", () => {
    props.entitlements['ReferenceNotes'] = 1
    props.ui.ValidationErrors['ReferenceNotes'] = {name:'errors'}

    let subject = shallow(<ComplianceDetail {...props} />)
    let field = subject.findWhere(f => f.props().label === "Reference Notes")
    expect(field.props().id).toEqual("compliance-reference-notes")
    expect(field.props().labelClassName).toEqual("col-md-3")
    expect(field.props().entitlement).toEqual(1)
    expect(field.props().hasError).toBeTruthy()
    expect(field.props().value).toEqual("referenceNotes")
    expect(field.props().inputClassName).toEqual("col-md-8")
    expect(field.props().rows).toEqual("4")
  })

  it("should handle Reference Notes on change", () => {
    let event = {
      target: {
        value: "Value"
      }
    }

    let subject = shallow(<ComplianceDetail {...props} />)
    let field = subject.findWhere(f => f.props().label === "Reference Notes")
    field.props().onChange(event)
    expect(props.actions.handleReferenceNotesChange).toHaveBeenCalledWith("Value")
  })

  it("should render Remediation Notes textarea field", () => {
    props.entitlements['RemediationNotes'] = 1
    props.ui.ValidationErrors['RemediationNotes'] = {name:'errors'}

    let subject = shallow(<ComplianceDetail {...props} />)
    let field = subject.findWhere(f => f.props().label === "Remediation Notes")
    expect(field.props().id).toEqual("compliance-remediation-notes")
    expect(field.props().labelClassName).toEqual("col-md-3")
    expect(field.props().entitlement).toEqual(1)
    expect(field.props().hasError).toBeTruthy()
    expect(field.props().value).toEqual("remediationNotes")
    expect(field.props().inputClassName).toEqual("col-md-8")
    expect(field.props().rows).toEqual("4")
  })

  it("should handle Remediation Notes on change", () => {
    let event = {
      target: {
        value: "Value"
      }
    }

    let subject = shallow(<ComplianceDetail {...props} />)
    let field = subject.findWhere(f => f.props().label === "Remediation Notes")
    field.props().onChange(event)
    expect(props.actions.handleRemediationNotesChange).toHaveBeenCalledWith("Value")
  })

  it("should render Information heading", () => {
    let subject = shallow(<ComplianceDetail {...props} />)
    expect(subject.find('h4').at(0).text()).toEqual("Information")
  })

  it("should render Updated By readonly field", () => {
    let subject = shallow(<ComplianceDetail {...props} />)
    let field = subject.findWhere(f => f.props().title === "Updated By")
    expect(field.props().id).toEqual("compliance-updated-by")
    expect(field.props().entitlement).toEqual(0)
    expect(field.props().value).toEqual("updatedBy")
  })

  it("should render Updated Date readonly field", () => {
    let subject = shallow(<ComplianceDetail {...props} />)
    let field = subject.findWhere(f => f.props().title === "Updated Date")
    expect(field.props().id).toEqual("compliance-updated-date")
    expect(field.props().entitlement).toEqual(0)
    expect(field.props().value).toEqual("updatedDate")
  })

  it("should render Imported By readonly field", () => {
    let subject = shallow(<ComplianceDetail {...props} />)
    let field = subject.findWhere(f => f.props().title === "Imported By")
    expect(field.props().id).toEqual("compliance-imported-by")
    expect(field.props().entitlement).toEqual(0)
    expect(field.props().value).toEqual("importedBy")
  })

  it("should render Imported Date readonly field", () => {
    let subject = shallow(<ComplianceDetail {...props} />)
    let field = subject.findWhere(f => f.props().title === "Imported Date")
    expect(field.props().id).toEqual("compliance-imported-date")
    expect(field.props().entitlement).toEqual(0)
    expect(field.props().value).toEqual("importedDate")
  })

  it("should render Remediation Status select field", () => {
    props.entitlements['RemediationStatusId'] = 1
    props.ui.ValidationErrors['RemediationStatusId'] = {name:'errors'}
    props.compliance.RemediationStatusList = [
      { ResourceId: "resourceId", ResourceName: "resourceName" }
    ]

    let subject = shallow(<ComplianceDetail {...props} />)
    let field = subject.findWhere(f => f.props().label === "Remediation Status")
    expect(field.props().id).toEqual("compliance-remediation-status")
    expect(field.props().entitlement).toEqual(1)
    expect(field.props().hasError).toBeTruthy()
    expect(field.props().value).toEqual("remediationStatusId")

    let options = field.find('option')
    expect(options.at(0).props().value).toEqual("")
    expect(options.at(0).text()).toEqual("Select")
    expect(options.at(1).props().value).toEqual("resourceId")
    expect(options.at(1).text()).toEqual("resourceName")
  })

  it("should handle Remediation Status on change", () => {
    let event = {
      target: {
        value: "Value"
      }
    }

    let subject = shallow(<ComplianceDetail {...props} />)
    let field = subject.findWhere(f => f.props().label === "Remediation Status")
    field.props().onChange(event)
    expect(props.actions.handleRemediationStatusChange).toHaveBeenCalledWith("Value")
  })

  it("should render Remediation Date datepicker field", () => {
    props.entitlements['RemediationDate'] = 1
    props.ui.ValidationErrors['RemediationDate'] = {name:'errors'}
    props.ui.showRemediationDatePicker = true

    let subject = shallow(<ComplianceDetail {...props} />)
    let field = subject.findWhere(f => f.props().label === "Remediation Date")
    expect(field.props().id).toEqual("compliance-remediation-date")
    expect(field.props().entitlement).toEqual(1)
    expect(field.props().hasError).toBeTruthy()
    expect(field.props().value).toEqual("mitigationDate")
    expect(field.props().visible).toEqual(true)
  })

  it("should handle Remediation Date on change", () => {
    let event = {
      target: {
        value: "Value"
      }
    }

    let subject = shallow(<ComplianceDetail {...props} />)
    let field = subject.findWhere(f => f.props().label === "Remediation Date")
    field.props().onChange(event)
    expect(props.actions.handleMitigationDateChange).toHaveBeenCalledWith("Value")
  })

  it("should handle Remediation Date on selected", () => {
    let subject = shallow(<ComplianceDetail {...props} />)
    let field = subject.findWhere(f => f.props().label === "Remediation Date")
    field.props().onSelected("Value")
    expect(props.actions.handleMitigationDateSelected).toHaveBeenCalledWith("Value")
  })

  it("should handle Remediation Date on click", () => {
    let subject = shallow(<ComplianceDetail {...props} />)
    let field = subject.findWhere(f => f.props().label === "Remediation Date")
    field.props().onClick()
    expect(props.actions.handleMitigationDateClick).toHaveBeenCalled()
  })

  it("should handle Remediation Date on close", () => {
    let subject = shallow(<ComplianceDetail {...props} />)
    let field = subject.findWhere(f => f.props().label === "Remediation Date")
    field.props().onClose()
    expect(props.actions.handleMitigationDateClose).toHaveBeenCalled()
  })

  it("should render Remediation Resource select field", () => {
    props.entitlements['RemediationResource'] = 1
    props.ui.ValidationErrors['RemediationResource'] = {name:'errors'}
    props.compliance.ResourceId = 'resourceId'
    props.compliance.GroupId = 'groupId'
    props.compliance.ResourceList = ['resourceList']
    props.compliance.GroupList = ['groupList']
    props.actions.handleResourceAssignSave = jest.fn().mockReturnValue('changed')

    let subject = shallow(<ComplianceDetail {...props} />)
    let field = subject.find(SelectResourceField)
    expect(field.props().entitlement).toEqual(1)
    expect(field.props().hasError).toBeTruthy()
    expect(field.props().groupId).toEqual('groupId')
    expect(field.props().groupList[0]).toEqual('groupList')
    expect(field.props().resourceId).toEqual('resourceId')
    expect(field.props().resourceList[0]).toEqual('resourceList')
    expect(field.props().onChangeAction()).toEqual('changed')
  })


  it("should render save button", () => {
    let subject = shallow(<ComplianceDetail {...props} />)
    let saveButton = subject.find("#compliance-save-button")
    expect(saveButton.props().className).toEqual("btn btn-default")
  })

  it("should handle save button on click", () => {
    let subject = shallow(<ComplianceDetail {...props} />)
    subject.find("#compliance-save-button").simulate("click")
    expect(props.actions.update).toHaveBeenCalledWith(props.compliance, props.history, props.engagementId, props.match.params.schemeId)
  })

  it('should render Cancel button', () => {
    let subject = shallow(<ComplianceDetail {...props} />)
    let link = subject.find(Link)
    expect(link.props().id).toEqual("compliance-cancel-button")
    expect(link.props().to).toEqual(routes.COMPLIANCE_PAGE + '/t' + props.match.params.schemeId + '/' + props.engagementId + '/' + props.match.params.schemeId)
    expect(link.props().className).toEqual("btn btn-alternate")
  })
})
