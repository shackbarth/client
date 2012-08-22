/*jshint bitwise:true, indent:2, curly:true eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true white:true*/
/*global XT:true, XM:true, _:true, enyo:true, Globalize:true*/

(function () {

  // ..........................................................
  // ACCOUNT
  //

  enyo.kind({
    name: "XV.AccountInfoParameters",
    kind: "XV.ParameterWidget",
    components: [
      {kind: "onyx.GroupboxHeader", content: "_account".loc()},
      {attr: "isActive", label: "_showInactive".loc(), defaultKind: "XV.CheckboxWidget",
        getParameter: function () {
          var param;
          if (!this.getValue()) {
            param = {
              attribute: this.getAttr(),
              operator: '=',
              value: true
            };
          }
          return param;
        }
      },
      {label: "_number".loc(), attr: "number"},
      {label: "_name".loc(), attr: "name"},
      {kind: "onyx.GroupboxHeader", content: "_contact".loc()},
      {label: "_primaryContact".loc(), attr: "primaryContact.name"},
      {label: "_primaryEmail".loc(), attr: "primaryContact.primaryEmail"},
      {kind: "onyx.GroupboxHeader", content: "_address".loc()},
      {label: "_phone".loc(), attr: ["primaryContact.phone", "primaryContact.alternate", "primaryContact.fax"]},
      {label: "_street".loc(), attr: ["primaryContact.address.line1", "primaryContact.address.line2", "primaryContact.address.line3"]},
      {label: "_city".loc(), attr: "primaryContact.address.city"},
      {label: "_postalCode".loc(), attr: "primaryContact.address.postalCode"},
      {label: "_state".loc(), attr: "primaryContact.address.state"},
      {label: "_country".loc(), attr: "primaryContact.address.country"},
      {kind: "onyx.GroupboxHeader", content: "_userAccount".loc()},
      {label: "_owner".loc(), attr: "owner", defaultKind: "XV.UserAccountWidget"}
    ]
  });

  // ..........................................................
  // CONTACT
  //

  enyo.kind({
    name: "XV.ContactInfoParameters",
    kind: "XV.ParameterWidget",
    components: [
      {kind: "onyx.GroupboxHeader", content: "_contact".loc()},
      {attr: "isActive", label: "_showInactive".loc(), defaultKind: "XV.CheckboxWidget",
        getParameter: function () {
          var param;
          if (!this.getValue()) {
            param = {
              attribute: this.getAttr(),
              operator: '=',
              value: true
            };
          }
          return param;
        }
      },
      {label: "_name".loc(), attr: "name"},
      {label: "_primaryEmail".loc(), attr: "primaryEmail"},
      {label: "_phone".loc(), attr: ["phone", "alternate", "fax"]},
      {kind: "onyx.GroupboxHeader", content: "_address".loc()},
      {label: "_street".loc(), attr: ["address.line1", "address.line2", "address.line3"]},
      {label: "_city".loc(), attr: "address.city"},
      {label: "_state".loc(), attr: "address.state"},
      {label: "_postalCode".loc(), attr: "address.postalCode"},
      {label: "_country".loc(), attr: "address.country"},
      {kind: "onyx.GroupboxHeader", content: "_userAccount".loc()},
      {label: "_owner".loc(), attr: "owner", defaultKind: "XV.UserAccountWidget"}
    ]
  });

  // ..........................................................
  // INCIDENT
  //

  enyo.kind({
    name: "XV.IncidentInfoParameters",
    kind: "XV.ParameterWidget",
    components: [
      {kind: "onyx.GroupboxHeader", content: "_incident".loc()},
      {label: "_number".loc(), attr: "number",
        getParameter: function () {
          var param,
            value = this.getValue() - 0;
          if (value && _.isNumber(value)) {
            param = {
              attribute: this.getAttr(),
              operator: '=',
              value: value
            };
          }
          return param;
        }
      },
      {label: "_description".loc(), attr: "description"},
      {label: "_category".loc(), attr: "category",
        defaultKind: "XV.IncidentCategoryDropdown"},
      {label: "_account".loc(), attr: "account", defaultKind: "XV.AccountWidget"},
      {label: "_contact".loc(), attr: "contact", defaultKind: "XV.ContactWidget"},
      {kind: "onyx.GroupboxHeader", content: "_status".loc()},
      {label: "_priority".loc(), attr: "priority",
        defaultKind: "XV.PriorityDropdown"},
      {label: "_severity".loc(), attr: "severity",
        defaultKind: "XV.IncidentSeverityDropdown"},
      {label: "_resolution".loc(), attr: "resolution",
          defaultKind: "XV.IncidentResolutionDropdown"},
      {kind: "onyx.GroupboxHeader", content: "_userAccounts".loc()},
      {label: "_owner".loc(), attr: "owner", defaultKind: "XV.UserAccountWidget"},
      {label: "_assignedTo".loc(), attr: "assignedTo", defaultKind: "XV.UserAccountWidget"},
      {kind: "onyx.GroupboxHeader", content: "_created".loc()},
      {label: "_startDate".loc(), attr: "created", operator: ">=",
        defaultKind: "XV.DateWidget"},
      {label: "_endDate".loc(), attr: "created", operator: "<=",
        defaultKind: "XV.DateWidget"}
    ]
  });
  
  // ..........................................................
  // CONTACT
  //

  enyo.kind({
    name: "XV.ItemInfoParameters",
    kind: "XV.ParameterWidget",
    components: [
      {kind: "onyx.GroupboxHeader", content: "_item".loc()},
      {attr: "isActive", label: "_showInactive".loc(), defaultKind: "XV.CheckboxWidget",
        getParameter: function () {
          var param;
          if (!this.getValue()) {
            param = {
              attribute: this.getAttr(),
              operator: '=',
              value: true
            };
          }
          return param;
        }
      },
      {label: "_number".loc(), attr: "number"},
      {label: "_description".loc(), attr: ["description1", "description2"]}
    ]
  });

  // ..........................................................
  // OPPORTUNITY
  //

  enyo.kind({
    name: "XV.OpportunityInfoParameters",
    kind: "XV.ParameterWidget",
    components: [
      {kind: "onyx.GroupboxHeader", content: "_opportunity".loc()},
      {label: "_showInactive".loc(), attr: "isActive",
        defaultKind: "XV.CheckboxWidget",
        getParameter: function () {
          var param;
          if (!this.getValue()) {
            param = {
              attribute: this.getAttr(),
              operator: '=',
              value: true
            };
          }
          return param;
        }
      },
      {label: "_name".loc(), attr: "name"},
      {label: "_account".loc(), attr: "account", defaultKind: "XV.AccountWidget"},
      {label: "_contact".loc(), attr: "contact", defaultKind: "XV.ContactWidget"},
      {kind: "onyx.GroupboxHeader", content: "_status".loc()},
      {label: "_stage".loc(), attr: "opportunityStage",
        defaultKind: "XV.OpportunityStageDropdown"},
      {label: "_priority".loc(), attr: "priority",
        defaultKind: "XV.PriorityDropdown"},
      {label: "_type".loc(), attr: "opportunityType",
        defaultKind: "XV.OpportunityTypeDropdown"},
      {label: "_source".loc(), attr: "opportunitySource",
        defaultKind: "XV.OpportunitySourceDropdown"},
      {kind: "onyx.GroupboxHeader", content: "_userAccounts".loc()},
      {label: "_owner".loc(), attr: "owner", defaultKind: "XV.UserAccountWidget"},
      {label: "_assignedTo".loc(), attr: "assignedTo", defaultKind: "XV.UserAccountWidget"},
      {kind: "onyx.GroupboxHeader", content: "_targetClose".loc()},
      {label: "_startDate".loc(), attr: "targetClose", operator: ">=",
        defaultKind: "XV.DateWidget"},
      {label: "_endDate".loc(), attr: "targetClose", operator: "<=",
        defaultKind: "XV.DateWidget"}
    ]
  });

  // ..........................................................
  // PROJECT
  //

  enyo.kind({
    name: "XV.ProjectInfoParameters",
    kind: "XV.ParameterWidget",
    components: [
      {kind: "onyx.GroupboxHeader", content: "_project".loc()},
      {label: "_showCompleted".loc(), attr: "status", defaultKind: "XV.CheckboxWidget",
        getParameter: function () {
          var param;
          if (!this.getValue()) {
            param = {
              attribute: this.getAttr(),
              operator: '!=',
              value: 'C'
            };
          }
          return param;
        }
      },
      {label: "_number".loc(), attr: "number"},
      {label: "_name".loc(), attr: "name"},
      {label: "_account".loc(), attr: "account", defaultKind: "XV.AccountWidget"},
      {label: "_contact".loc(), attr: "contact", defaultKind: "XV.ContactWidget"},
      {kind: "onyx.GroupboxHeader", content: "_status".loc()},
      {label: "_status".loc(), attr: "status",
        defaultKind: "XV.ProjectStatusDropdown"},
      {kind: "onyx.GroupboxHeader", content: "_userAccounts".loc()},
      {label: "_owner".loc(), attr: "owner", defaultKind: "XV.UserAccountWidget"},
      {label: "_assignedTo".loc(), attr: "assignedTo", defaultKind: "XV.UserAccountWidget"},
      {kind: "onyx.GroupboxHeader", content: "_dueDate".loc()},
      {label: "_startDate".loc(), attr: "dueDate", operator: ">=",
        defaultKind: "XV.DateWidget"},
      {label: "_endDate".loc(), attr: "dueDate", operator: "<=",
        defaultKind: "XV.DateWidget"}
    ]
  });

  // ..........................................................
  // TO DO
  //

  enyo.kind({
    name: "XV.ToDoInfoParameters",
    kind: "XV.ParameterWidget",
    components: [
      {kind: "onyx.GroupboxHeader", content: "_toDo".loc()},
      {label: "_showCompleted".loc(), attr: "status", defaultKind: "XV.CheckboxWidget",
        getParameter: function () {
          var param;
          if (!this.getValue()) {
            param = {
              attribute: this.getAttr(),
              operator: '!=',
              value: 'C'
            };
          }
          return param;
        }
      },
      {label: "_name".loc(), attr: "name"},
      {label: "_description".loc(), attr: "description"},
      {kind: "onyx.GroupboxHeader", content: "_userAccounts".loc()},
      {label: "_owner".loc(), attr: "owner", defaultKind: "XV.UserAccountWidget"},
      {label: "_assignedTo".loc(), attr: "assignedTo", defaultKind: "XV.UserAccountWidget"},
      {kind: "onyx.GroupboxHeader", content: "_dueDate".loc()},
      {label: "_startDate".loc(), attr: "dueDate", operator: ">=", defaultKind: "XV.DateWidget"},
      {label: "_endDate".loc(), attr: "dueDate", operator: "<=", defaultKind: "XV.DateWidget"}
    ]
  });

}());