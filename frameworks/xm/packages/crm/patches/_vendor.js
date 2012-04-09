// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @patch

  This code is automatically generated and will be over-written. Do not edit directly.
*/
SC.Patch.create( /** @scope XM.Vendor.prototype */ { 
  
  target: 'XM.Vendor',

  body: {
  
    /**
      @type XM.Account
    */
    account: SC.Record.toOne('XM.Account', {
      label: '_account'.loc()
    })

  }

});