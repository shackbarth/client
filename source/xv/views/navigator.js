/*jshint bitwise:true, indent:2, curly:true eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true white:true*/
/*global XT:true, XV:true, XM:true, _:true, enyo:true*/

(function () {
  var MODULE_MENU = 0;
  var PANEL_MENU = 1;

  enyo.kind({
    name: "XV.Navigator",
    kind: "Panels",
    classes: "app enyo-unselectable",
    published: {
      modules: []
    },
    events: {
      onListAdded: "",
      onTogglePullout: "",
      onWorkspace: ""
    },
    handlers: {
      onParameterChange: "requery",
      onItemTap: "itemTap"
    },
    showPullout: true,
    arrangerKind: "CollapsingArranger",
    components: [
      {kind: "FittableRows", classes: "left", components: [
        {kind: "onyx.Toolbar", classes: "onyx-menu-toolbar", components: [
          {kind: "onyx.Button", name: "backButton", content: "_logout".loc(),
            ontap: "backTapped"},
          {kind: "Group", name: "iconButtonGroup",
            defaultKind: "onyx.IconButton", tag: null, components: [
            {name: "historyIconButton", src: "assets/menu-icon-bookmark.png",
              ontap: "showHistory"},
            {name: "searchIconButton", src: "assets/menu-icon-search.png",
              ontap: "showParameters", showing: false}
          ]},
          {kind: "onyx.Popup", name: "logoutPopup", centered: true,
            modal: true, floating: true, components: [
            {content: "_logoutConfirmation".loc() },
            {tag: "br"},
            {kind: "onyx.Button", content: "_ok".loc(), ontap: "logout"},
            {kind: "onyx.Button", content: "_cancel".loc(),
              ontap: "closeLogoutPopup", classes: "onyx-blue"}
          ]}
        ]},
        {name: "menuPanels", kind: "Panels", draggable: false, fit: true,
          margin: 0, components: [
          {name: "moduleMenu", kind: "List", touch: true,
              onSetupItem: "setupModuleMenuItem",
              components: [
            {name: "moduleItem", classes: "item enyo-border-box"}
          ]},
          {name: "panelMenu", kind: "List", touch: true,
             onSetupItem: "setupPanelMenuItem", components: [
            {name: "listItem", classes: "item enyo-border-box"}
          ]},
          {} // Why do panels only work when there are 3+ objects?
        ]}
      ]},
      {kind: "FittableRows", components: [
        {kind: "onyx.MoreToolbar", name: "contentToolbar", components: [
          {kind: "onyx.Grabber"},
          {name: "rightLabel", style: "text-align: center"},
          {name: "search", kind: "onyx.InputDecorator", style: "float: right;",
            showing: false, components: [
            {name: 'searchInput', kind: "onyx.Input", style: "width: 200px;",
              placeholder: "Search", onchange: "inputChanged"},
            {kind: "Image", src: "assets/search-input-search.png"}
          ]},
          {name: "newButton", kind: "onyx.Button", content: "_new".loc(),
            ontap: "newRecord", style: "float: right;", showing: false}
        ]},
        {name: "contentPanels", kind: "Panels", margin: 0, fit: true,
          draggable: false, panelCount: 0}
      ]}
    ],
    fetched: {},
    activate: function () {
      this.setMenuPanel(MODULE_MENU);
    },
    backTapped: function () {
      var index = this.$.menuPanels.getIndex();
      if (index === MODULE_MENU) {
        this.warnLogout();
      } else {
        this.setMenuPanel(MODULE_MENU);
      }
    },
    create: function () {
      this.inherited(arguments);
      var modules = this.getModules() || [],
        panels,
        panel,
        i,
        n;

      // Build panels
      for (i = 0; i < modules.length; i++) {
        panels = modules[i].panels || [];
        for (n = 0; n < panels.length; n++) {

          // Keep track of where this panel is being placed for later reference
          panels[n].index = this.$.contentPanels.panelCount++;
          panel = this.$.contentPanels.createComponent(panels[n]);
          if (panel instanceof XV.List) {

            // Bubble parameter widget up to pullout
            this.doListAdded(panel);
          }
        }
      }
      this.$.moduleMenu.setCount(modules.length);
    },
    getSelectedModule: function (index) {
      return this._selectedModule;
    },
    fetch: function (options) {
      options = options ? _.clone(options) : {};
      var index = options.index || this.$.contentPanels.getIndex(),
        list = this.$.contentPanels.getPanels()[index],
        name = list ? list.name : "",
        query,
        input,
        parameterWidget,
        parameters;
      if (!list instanceof XV.List) { return; }
      this.fetched[index] = true;
      query = list.getQuery() || {};
      input = this.$.searchInput.getValue();
      parameterWidget = XT.app ? XT.app.getPullout().getItem(name) : null;
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
    inputChanged: function (inSender, inEvent) {
      this.fetched = {};
      this.fetch();
    },
    itemTap: function (inSender, inEvent) {
      var list = inEvent.list,
        workspace = list ? list.getWorkspace() : null,
        id = list ? list.getModel(inEvent.index).id : null;

      // Bubble requset for workspace view, including the model id payload
      if (workspace) { this.doWorkspace({workspace: workspace, id: id}); }
    },
    newRecord: function (inSender, inEvent) {
      var list = this.$.contentPanels.getActive(),
        workspace = list instanceof XV.List ? list.getWorkspace() : null,
        callback;
      if (!list instanceof XV.List) { return; }
      // Callback options on commit of the workspace
      // Fetch the corresponding list model and add
      callback = function (model) {
        var Model = list._collection.model,
          value = new Model({id: model.id}),
          options = {};
        options.success = function () {
          list._collection.add(value);
          list.setCount(list._collection.length);
          list.refresh();
        };
        value.fetch(options);
      };
      if (workspace) {
        this.doWorkspace({
          workspace: workspace,
          callback: callback
        });
      }
      return true;
    },
    requery: function (inSender, inEvent) {
      this.fetch();
    },
    setContentPanel: function (index) {
      var module = this.getSelectedModule(),
        panelIndex = module && module.panels ? module.panels[index].index : -1,
        panel = panelIndex > -1 ? this.$.contentPanels.getPanels()[panelIndex] : null,
        label = panel && panel.label ? panel.label : "";
      if (!panel) { return; }

      // Select panelMenu
      if (!this.$.panelMenu.isSelected(index)) {
        this.$.panelMenu.select(index);
      }

      // Select list
      if (this.$.contentPanels.getIndex() !== panelIndex) {
        this.$.contentPanels.setIndex(panelIndex);
      }
      this.$.rightLabel.setContent(label);
      if (panel.fetch && !this.fetched[panelIndex]) {
        this.fetch();
      }
    },
    setMenuPanel: function (index) {
      var label = index ? "_back".loc() : "_logout".loc();
      this.$.menuPanels.setIndex(index);
      this.$.menuPanels.getActive().select(0);
      this.setContentPanel(0);
      this.$.backButton.setContent(label);
      this.$.newButton.setShowing(index);
      this.$.search.setShowing(index);
      this.$.searchIconButton.setShowing(index);
    },
    setModule: function (index) {
      var module = this.getModules()[index],
        panels = module.panels || [],
        hasSubmenu = module.hasSubmenu !== false && panels.length;
      if (module !== this._selectedModule) {
        this._selectedModule = module;
        if (hasSubmenu) {
          this.$.panelMenu.setCount(panels.length);
          this.$.panelMenu.render();
          this.setMenuPanel(PANEL_MENU);
        }
      }
    },
    setupModuleMenuItem: function (inSender, inEvent) {
      var index = inEvent.index,
        label = this.modules[index].label,
        isSelected = inSender.isSelected(index);
      this.$.moduleItem.setContent(label);
      this.$.moduleItem.addRemoveClass("onyx-selected", isSelected);
      if (isSelected) { this.setModule(index); }
    },
    setupPanelMenuItem: function (inSender, inEvent) {
      var module = this.getSelectedModule(),
        index = inEvent.index,
        isSelected = inSender.isSelected(index),
        panel,
        name,
        label;
      panel =  module.panels[index];
      name = panel && panel.name ? module.panels[index].name : "";
      panel = this.$.contentPanels.$[name];
      label = panel && panel.getLabel ? panel.getLabel() : "";
      this.$.listItem.setContent(label);
      this.$.listItem.addRemoveClass("onyx-selected", isSelected);
      if (isSelected) { this.setContentPanel(index); }
    },
    showHistory: function (inSender, inEvent) {
      var panel = {name: 'history'};
      this.doTogglePullout(panel);
    },
    showParameters: function (inSender, inEvent) {
      var panel = this.$.contentPanels.getActive();
      this.doTogglePullout(panel);
    },
    warnLogout: function () {
      this.$.logoutPopup.show();
    },
    closeLogoutPopup: function () {
      this.$.logoutPopup.hide();
    },
    logout: function () {
      this.$.logoutPopup.hide();
      XT.session.logout();
    },
    setActiveIconButton: function (buttonName) {
      var activeIconButton = null;
      // Null deactivates both
      if (buttonName === 'search') {
        activeIconButton = this.$.searchIconButton;
      } else if (buttonName === 'history') {
        activeIconButton = this.$.historyIconButton;
      }
      this.$.iconButtonGroup.setActive(activeIconButton);
    }

  });

}());