/*jshint node:true, indent:2, curly:true eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, trailing:true, white:true */
/*global XT:true, Globalize:true, enyo:true, _:true */

(function () {

  enyo.kind({
    name: "XV.Input",
    published: {
      value: null
    },
    events: {
      "onValueChange": ""
    },
    components: [
      {name: "input", kind: "onyx.Input", onchange: "inputChanged"}
    ],
    inputChanged: function (inSender, inEvent) {
      var input = this.$.input.getValue(),
        value = this.validate(input);
      if (value !== false) {
        this.setValue(value);
      } else {
        this.setValue(null);
        this.valueChanged("");
      }
    },
    setDisabled: function (value) {
      this.$.input.setDisabled(value);
    },
    setValue: function (value, options) {
      options = options || {};
      var oldValue = this.getValue(),
        inEvent;
      if (oldValue !== value) {
        this.value = value;
        this.valueChanged(value);
        inEvent = { value: value, originator: this };
        if (!options.silent) { this.doValueChange(inEvent); }
      }
    },
    validate: function (value) {
      return value;
    },
    valueChanged: function (value) {
      this.$.input.setValue(value);
      return value;
    }
  });
  
  enyo.kind({
    name: "XV.InputWidget",
    kind: "XV.Input",
    components: [
      {kind: "onyx.InputDecorator", components: [
        {name: "input", kind: "onyx.Input", onchange: "inputChanged"}
      ]}
    ]
  });
  
}());