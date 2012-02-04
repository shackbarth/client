/*global XM global require */

var vows = require('vows'),
    assert = require('assert');

require('../xv-core');

XV.country = new Object;

XV.country.createHash  = { 
  guid: 1999, 
  abbreviation: 'EB',
  name: 'Elbonia',
  currencyName: 'Chit',
  currencySymbol: '!',
  currencyAbbreviation: 'CHT',
  currencyNumber: 666
};

XV.country.updateHash  = {  
  name: 'Ebania'
};

var countrySuite = vows.describe('XT Core Country Tests');

countrySuite.addBatch({
  "XM.Country": {
    "Validate Class" : {
      topic: function() {
        return XM.Country;
      },
      'is not null': function (recordType) {
        assert.isNotNull(recordType);
      },
      'is of type SC.Record': function(recordType) {
        assert.isKindOf(recordType, SC.Record);
      }
    },
    "-> CREATE" : {
      topic: XV.record.create(XM.Country, XV.country.createHash),
      'status is READY_NEW' : assert.status(SC.Record.READY_NEW),
      'guid is number' : assert.propertyIsNumber('guid'),
      'abbreviation is "EB"' : assert.property('abbreviation','EB'),
      'abbreviation is "EB"' : assert.property('abbreviation','EB'),
      "-> commit" : {
        topic: XV.record.commit(),
        'status is READY_CLEAN' : assert.status(SC.Record.READY_CLEAN),
        "-> READ" : {
          topic: XV.record.refresh(),
          'status is READY_CLEAN' : assert.status(SC.Record.READY_CLEAN),
          'abbreviation is "EB"' : assert.property('abbreviation','EB'),
          "-> UPDATE" : {
            topic: XV.record.update(XV.country.updateHash),
            'status is READY_DIRTY' : assert.status(SC.Record.READY_DIRTY),
            'abbreviation is "EB"' : assert.property('abbreviation','EB'),
            "-> commit" : {
              topic: XV.record.commit(),
              'status is READY_CLEAN' : assert.status(SC.Record.READY_CLEAN),
              "-> READ" : {
                topic: XV.record.refresh(),
                'status is READY_CLEAN' : assert.status(SC.Record.READY_CLEAN),
                'abbreviation is "EB"' : assert.property('abbreviation','EB'),
                "-> DELETE" : {
                  topic: XV.record.destroy(),
                  'status is DESTROYED_DIRTY' : assert.status(SC.Record.DESTROYED_DIRTY),
                  "-> commit" : {
                    topic: XV.record.commit(SC.Record.DESTROYED_CLEAN),
                    'status is DESTROYED_CLEAN' : assert.status(SC.Record.DESTROYED_CLEAN)
                  }
                }
              }
            }
          }
        }
      }
    }
  }
});


module.exports = countrySuite;