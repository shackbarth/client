// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.BankReconciliationItem
  @mixin

  This code is automatically generated and will be over-written. Do not edit directly.
*/
XM._BankReconciliationItem = {
  /** @scope XM.BankReconciliationItem.prototype */
  
  className: 'XM.BankReconciliationItem',

  

  // .................................................
  // PRIVILEGES
  //

  privileges: {
    "all": {
      "create": true,
      "read": true,
      "update": true,
      "delete": true
    }
  },

  //..................................................
  // ATTRIBUTES
  //
  
  /**
    @type Number
  */
  guid: SC.Record.attr(Number),

  /**
    @type XM.BankReconciliation
  */
  bankReconciliation: SC.Record.toOne('XM.BankReconciliation', {
    label: '_bankReconciliation'.loc()
  }),

  /**
    @type String
  */
  sourceType: SC.Record.attr(String, {
    label: '_sourceType'.loc()
  }),

  /**
    @type Number
  */
  source: SC.Record.attr(Number, {
    label: '_source'.loc()
  }),

  /**
    @type Number
  */
  amount: SC.Record.attr(Number, {
    label: '_amount'.loc()
  }),

  /**
    @type Number
  */
  currencyRate: SC.Record.attr(Number, {
    label: '_currencyRate'.loc()
  })

};