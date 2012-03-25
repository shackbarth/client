// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.IncidentImage
  @mixin

  This code is automatically generated and will be over-written. Do not edit directly.
*/
XM._IncidentImage = {
  /** @scope XM.IncidentImage.prototype */
  
  className: 'XM.IncidentImage',

  nestedRecordNamespace: XM,

  // .................................................
  // PRIVILEGES
  //

  privileges: {
    "all": {
      "create": true,
      "read": true,
      "update": false,
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
    @type XM.Incident
  */
  source: SC.Record.toOne('XM.Incident', {
    label: '_source'.loc()
  }),

  /**
    @type XM.ImageInfo
  */
  image: SC.Record.toOne('XM.ImageInfo', {
    isNested: true,
    label: '_image'.loc()
  }),

  /**
    @type String
  */
  purpose: SC.Record.attr(String, {
    label: '_purpose'.loc()
  })

};