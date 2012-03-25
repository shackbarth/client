// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

sc_require('mixins/_invoice');

/**
  @class

  @extends XM.Document
*/
XM.Invoice = XM.Document.extend(XM._Invoice,
  /** @scope XM.Invoice.prototype */ {
  
  numberPolicySetting: 'InvcNumberGeneration',
  
  /* @private */
  creditsLength: 0,
  
  /* @private */
  creditsLengthBinding: SC.Binding.from('*credits.length').noDelay(),
  
  /** @private */
  taxesLength: 0,
  
  /** @private */
  taxesLengthBinding: SC.Binding.from('*taxes.length').noDelay(),
  
  /* @private */
  linesLength: 0,
  
  /* @private */
  linesLengthBinding: SC.Binding.from('*lines.length').noDelay(),
  
  subTotal: 0,
  
  lineTax: 0,
  
  freightTax: 0,
  
  miscTax: 0,
  
  /**
    An array of tax codes an with summarized amounts for line items.
  */
  lineTaxDetail: [],

  /**
    An array of tax codes an with amounts for freight.
  */  
  freightTaxDetail: [],

  /**
    An array of tax codes an with amounts for line items.
  */
  miscTaxDetail: [],
  
  isPosted: SC.Record.attr(Boolean, {
    isEditable: false,
  }),
  
  // .................................................
  // CALCULATED PROPERTIES
  //
  
  /**
    Credit allocated to the invoice.
  */
  credit: function() {
    var credits = this.get('credits'),
        credit = 0;
    for(var i = 0; i < credits.get('length'); i++) {
      credit = credit + credits.objectAt(i).get('amount');
    }
    return credit;
  }.property('creditsLength').cacheable(),
  
  totalTax: function() {
    var lineTax = this.get('lineTax'),
        freightTax = this.get('freightTax'),
        miscTax = this.get('miscTax');
    return lineTax + freightTax + miscTax; 
  }.property('lineTax', 'freightTax', 'miscTax').cacheable(),
  
  total: function() {
    var subTotal = this.get('subTotal'),
        freight = this.get('freight'),
        totalTax = this.get('totalTax');
    return subTotal + freight + totalTax; 
  }.property('subTotal', 'freight', 'totalTax').cacheable(),
  
  //..................................................
  // METHODS
  //
  
  post: function() {
    return false;
  },
  
  void: function() {
    return false;
  },

  //..................................................
  // OBSERVERS
  //
  
  /**
    Set the enabled state of billto attributes.
    
    @param {Boolean) is editable
  */
  setFreeFormBilltoEnabled: function(isEditable) {
    this.billtoName.set('isEditable', isEditable);
    this.billtoPhone.set('isEditable', isEditable);
    this.billtoAddress1.set('isEditable', isEditable);
    this.billtoAddress2.set('isEditable', isEditable);
    this.billtoAddress3.set('isEditable', isEditable);
    this.billtoCity.set('isEditable', isEditable); 
    this.billtoState.set('isEditable', isEditable);
    this.billtoPostalCode.set('isEditable', isEditable);
    this.billtoCountry.set('isEditable', isEditable);
  },

  /**
    Set the enabled state of billto attributes.
    
    @param {Boolean) iseditable
  */  
  setFreeFormShiptoEnabled: function(isEditable) {
    this.shiptoName.set('isEditable', isEditable);
    this.shiptoPhone.set('isEditable', isEditable);
    this.shiptoAddress1.set('isEditable', isEditable);
    this.shiptoAddress2.set('isEditable', isEditable);
    this.shiptoAddress3.set('isEditable', isEditable);
    this.shiptoCity.set('isEditable', isEditable); 
    this.shiptoState.set('isEditable', isEditable);
    this.shiptoPostalCode.set('isEditable', isEditable);
    this.shiptoCountry.set('isEditable', isEditable);
  },
  
  validate: function() {
    var errors = arguments.callee.base.apply(this, arguments), 
        val, err;

    // Validate Lines
    val = this.get('linesLength');
    err = XM.errors.findProperty('code', 'xt1010');
    this.updateErrors(err, !val);

    // Validate Total
    val = this.get('total');
    err = XM.errors.findProperty('code', 'xt1009');
    this.updateErrors(err, val < 0);

    return errors;
  }.observes('linesLength', 'total'),
  
  /**
    Populates customer defaults when customer changes.
  */
  customerDidChange: function() {
    console.log("***** CUSTOMER CHANGED ****"); 
    var customer = this.get('customer'),
        isFreeFormBillto = customer ? customer.get('isFreeFormBillto') : false,
        status = this.get('status');
    // only set defaults if the user made the change  
    if(status != SC.Record.READY_NEW && 
       status != SC.Record.READY_DIRTY) return

    // pass defaults in
    this.setFreeFormBilltoEnabled(true);
    if(customer) {
      var address = customer.getPath('billingContact.address');
          
      // set defaults 
      this.setIfChanged('salesRep', customer.getPath('salesRep'));
      this.setIfChanged('commission', customer.get('commission'));
      this.setIfChanged('terms', customer.get('terms'));
      this.setIfChanged('taxZone', customer.get('taxZone'));
      this.setIfChanged('currency', customer.get('currency'));
      this.setIfChanged('shipCharge', customer.get('shipCharge'));
      this.setIfChanged('shipto', customer.get('shipto'));
      this.setIfChanged('shipVia', customer.get('shipVia'));     
      this.setIfChanged('billtoName', customer.get('name'));
      this.setIfChanged('billtoPhone', customer.getPath('billingContact.phone'));
      if(address) {
        this.setIfChanged('billtoAddress1', address.get('line1'));
        this.setIfChanged('billtoAddress2', address.get('line2'));
        this.setIfChanged('billtoAddress3', address.get('line3'));
        this.setIfChanged('billtoCity', address.get('city')); 
        this.setIfChanged('billtoState', address.get('state'));
        this.setIfChanged('billtoPostalCode', address.get('postalCode'));
        this.setIfChanged('billtoCountry', address.get('country'));
      }
    } else {
    
      // clear defaults
      this.setIfChanged('salesRep', null);
      this.setIfChanged('commission', 0);
      this.setIfChanged('terms', null);
      this.setIfChanged('taxZone', null);
      this.setIfChanged('shipto', null);
    } 
    this.setFreeFormBilltoEnabled(isFreeFormBillto);
  }.observes('customer'),
  
  /**
    Populates shipto defaults when shipto changes.
  */
  shiptoDidChange: function() {
    var shipto = this.get('shipto'),
        customer = this.get('customer'),
        isFreeFormShipto = customer ? customer.get('isFreeFormShipto') : false,
        status = this.get('status');

    // only set defaults if the user made the change    
    if(status !== SC.Record.READY_NEW && 
       status !== SC.Record.READY_DIRTY) return

    // set defaults
    this.setFreeFormShiptoEnabled(true);
    if(shipto) {
      var address = shipto.get('address');
      this.setIfChanged('salesRep', shipto.get('salesRep'));
      this.setIfChanged('commission', shipto.get('commission'));
      this.setIfChanged('taxZone', shipto.get('taxZone'));
      this.setIfChanged('shipCharge', shipto.get('shipCharge'));
      this.setIfChange('shipVia', shipto.get('shipVia'));  
      this.setIfChange('shiptoName', shipto.get('name'));
      this.setIfChange('shiptoPhone', shipto.getPath('contact.phone'));
      if(address) {
        this.setIfChange('shiptoAddress1', address.get('line1'));
        this.setIfChange('shiptoAddress2', address.get('line2'));
        this.setIfChange('shiptoAddress3', address.get('line3'));
        this.setIfChange('shiptoCity', address.get('city')); 
        this.setIfChange('shiptoState', address.get('state'));
        this.setIfChange('shiptoPostalCode', address.get('postalCode'));
        this.setIfChange('shiptoCountry', address.get('country'));
      }
    } else if(customer) {
      this.setIfChange('salesRep', customer.get('salesRep'));
      this.setIfChange('taxZone', customer.get('taxZone'));
      this.setIfChange('currency', customer.get('currency'));
      this.setIfChange('shipCharge', customer.get('shipCharge'));
    } else if(!shipto) {
      this.setIfChange('shiptoName', '');
      this.setIfChange('shiptoAddress1', '');
      this.setIfChange('shiptoAddress2', '');
      this.setIfChange('shiptoAddress3', '');
      this.setIfChange('shiptoCity', ''); 
      this.setIfChange('shiptoState', '');
      this.setIfChange('shiptoPostalCode', '');
      this.setIfChange('shiptoCountry', '');
      this.setIfChange('shiptoPhone', '');
    }
    this.setFreeFormShiptoEnabled(isFreeFormShipto);
  }.observes('shipto'),
  
  /**
    Recalculate line item tax and sales totals.
  */
  linesDidChange: function() {
    var lines = this.get('lines'),
        taxDetail = [],
        taxTotal = 0, subTotal = 0;

    // first sub total sales and taxes
    for(var i = 0; i < lines.get('length'); i++) {
      var line = lines.objectAt(i),
          taxes = line.get('taxes'),
          extendedPrice = line.get('extendedPrice');

      // line sub total
      subTotal = subTotal + extendedPrice;

      // taxes
      for(var n = 0; n < taxes.get('length'); n++) {
        var lineTax = taxes.objectAt(n),
            taxCode = lineTax.get('taxCode'),
            tax = lineTax.get('tax') - 0,
            codeTotal = taxDetail.findProperty('taxCode', taxCode);
        
        // summarize by tax code 
        if(codeTotal) {
          codeTotal.tax = codeTotal.tax + tax;
        } else {
          codeTotal = {};    
          codeTotal.taxCode = taxCode;
          codeTotal.tax = tax;
          taxDetail.push(codeTotal);
        }   
      }
    }
    
    this.setIfChanged('subTotal', subTotal);
    
    // next round and sum up each tax code for total
    for(var i = 0; i < taxDetail.length; i++) {
      var codeTotal = taxDetail.objectAt(i);
      
      codeTotal.tax = SC.Math.round(codeTotal.tax, XM.MONEY_SCALE);
      taxTotal = taxTotal + codeTotal.tax;
    }
    this.setIfChanged('lineTax', taxTotal);
    this.setIfChanged('lineTaxDetail', taxDetail);
  }.observes('linesLength', 'taxZone'),

  taxesDidChange: function() {    
    var taxes = this.get('taxes'), 
        miscTaxDetail = [], freightTaxDetail = [],
        miscTax = 0, freightTax = 0;

    // Loop through header taxes and allocate
    for(var i = 0; i < taxes.get('length'); i++) {
      var hist = taxes.objectAt(i),
          type = hist.getPath('taxType.id'),
          tax = SC.Math.round(hist.get('tax'), XM.MONEY_SCALE),
          taxCode = hist.get('taxCode'),
          codeTax = {};
      if(type === XM.TaxType.ADJUSTMENT) {
        miscTax = miscTax + tax;
        codeTax.taxCode = taxCode;
        codeTax.tax = tax;
        miscTaxDetail.push(codeTax);   
      } else if (type === XM.TaxType.FREIGHT) {
        freightTax = freightTax + tax;
        codeTax.taxCode = taxCode;
        codeTax.tax = tax;
        freightTaxDetail.push(codeTax); 
      }
    }    
    this.setIfChanged('miscTax', miscTax);
    this.setIfChanged('miscTaxDetail', miscTaxDetail);
    this.setIfChanged('freightTax', freightTax);
    this.setIfChanged('freightTaxDetail', freightTaxDetail);
  }.observes('taxesLength', 'taxZone'),

  statusDidChange: function() {
    if(this.get('status') === SC.Record.READY_CLEAN) {
      this.customer.set('isEditable', false);
    }
  }.observes('status')

});

/**
  Post an invoice.
  
  @param {XM.Invoice} invoice
  @returns Number
*/
XM.Invoice.post = function(invoice, callback) { 
  if(!SC.kindOf(invoice, XM.Invoice) ||
     invoice.get('isPosted')) return false; 
  var that = this, dispatch;
  dispatch = XM.Dispatch.create({
    className: 'XM.Invoice',
    functionName: 'post',
    parameters: invoice.get('id'),
    target: that,
    action: callback
  });
  invoice.get('store').dispatch(dispatch);
  return this;
}
