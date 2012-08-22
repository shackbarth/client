/*jshint bitwise:true, indent:2, curly:true eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true white:true*/
/*global XT:true, XV:true, XM:true, _:true, enyo:true*/

(function () {

  enyo.kind({
    name: "XV.SearchContainer",
    kind: "Panels",
    classes: "app enyo-unselectable",
    published: {
      callback: null
    },
    events: {
      onPrevious: ""
    },
    handlers: {
      onItemTap: "itemTap",
      onParameterChange: "requery"
    },
    arrangerKind: "CollapsingArranger",
    components: [
      {name: "parameterPanel", kind: "FittableRows", classes: "left",
        components: [
        {kind: "onyx.Toolbar", classes: "onyx-menu-toolbar", components: [
          {kind: "onyx.Button", name: "backButton", content: "_back".loc(),
            ontap: "close"}
        ]},
        {name: "leftTitle", content: "_advancedSearch".loc(), classes: "xv-parameter-title"}
      ]},
      {name: "listPanel", kind: "FittableRows", components: [
        {kind: "onyx.Toolbar", name: "contentToolbar", components: [
          {kind: "onyx.Grabber"},
          {name: "rightLabel", content: "_search".loc(), style: "text-align: center"},
          {name: "search", kind: "onyx.InputDecorator", style: "float: right;",
            components: [
            {name: 'searchInput', kind: "onyx.Input", style: "width: 200px;",
              placeholder: "Search", onchange: "requery"},
            {kind: "Image", src: "assets/search-input-search.png"}
          ]}
        ]}
      ]}
    ],
    init: false,
    close: function (options) {
      this.doPrevious();
    },
    itemTap: function (inSender, inEvent) {
      var list = inEvent.list,
        value = list ? list.getModel(inEvent.index) : null;
        
      if (value) {
        if (this.callback) { this.callback(value); }
        this.close();
      }
    },
    fetch: function (options) {
      if (!this.init) { return; }
      options = options ? _.clone(options) : {};
      var list = this.$.list,
        query,
        input,
        parameterWidget,
        parameters;
      if (!list) { return; }
      query = list.getQuery() || {};
      input = this.$.searchInput.getValue();
      parameterWidget = this.$.parameterWidget;
      parameters = parameterWidget ? parameterWidget.getParameters() : [];
      options.showMore = _.isBoolean(options.showMore) ?
        options.showMore : false;

      // Build parameters
      if (input || parameters.length) {
        query.parameters = [];

        // Input search parameters
        if (input) {
          query.parameters = [{
            attribute: list.getSearchableAttributes(),
            operator: 'MATCHES',
            value: this.$.searchInput.getValue()
          }];
        }

        // Advanced parameters
        if (parameters) {
          query.parameters = query.parameters.concat(parameters);
        }
      } else {
        delete query.parameters;
      }
      list.setQuery(query);
      list.fetch(options);
    },
    requery: function (inSender, inEvent) {
      this.fetch();
      return true;
    },
    setList: function (list, callback) {
      var component;
      component = this.createComponent({
        name: "list",
        container: this.$.listPanel,
        kind: list,
        fit: true
      });
      this.$.rightLabel.setContent(component.label);
      this.setCallback(callback);
      if (component) {
        this.createComponent({
          name: "parameterWidget",
          container: this.$.parameterPanel,
          kind: component.getParameterWidget(),
          fit: true
        });
      }
      this.init = true;
      this.render();
    },
    setSearchText: function (searchText) {
      this.$.searchInput.setValue(searchText);
    }
  });

}());