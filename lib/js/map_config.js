/* global L, NPMap, App */
/* jshint camelcase: false */

App = {
  handleModuleCloseClick: function() {
    NPMap.app.toggleModule('search', false);
  },
  handleModuleTabClick: function(el) {
    NPMap.app.toggleModule(el.id.replace('module-tab-', ''), true);
  },
  toggleModule: function(module, on) {
    var $module = $('#module-' + module),
        $modules = $('#modules');

    if (on) {
      $('#modules-tabs').hide();
      $module.show();
      $modules.show();
      $('#center').css({
        left: $module.outerWidth() + 'px'
      });
    } else {
      $modules.hide();
      $('#center').css({
        left: '0'
      });
      $module.hide();
      $('#modules-tabs').show();
    }
  },
  popup: {
    description: function(data) {
      if (data.Force) {
        return 'The troop hierarchy will display here.';
      } else {
        return 'This area is part of the park boundary.';
      }
    },
    title: function(data) {
      if (data.Force) {
        return data.Force + ' ' + data.BaseLevel;
      } else {
        return 'Richmond National Battlefield Park';
      }
      }
    }
  };

var NPMap = {
  baseLayers: false,
  center: {
    lat: 37.59973293205194,
    lng: -77.37099182550776
  },
  div: 'map',
  fullscreenControl: true,
  homeControl: {
    position: 'topright'
  },
  hooks: {
    init: function(callback) {
      document.getElementById('my-custom-module').innerHTML = '';

     var ButtonControl = L.Control.extend({
      options: {
        position: 'bottom'
      },
      initialize: function(options) {
        L.Util.extend(this.options, options);
        return this;
      },
      onAdd: function() {
        var container = document.getElementsByClassName('battle-time-buttons');
        var timeButton = document.getElementsByClassName('time btn btn-default');

        for (i = 0; i < timeButton.length; i++){
          L.DomEvent.addListener(timeButton[i], 'click', this._handleClick);
        }
        L.DomEvent
          .on(container, 'click', L.DomEvent.preventDefault)
          .on(container, 'click', L.DomEvent.stopPropagation)
          .on(container, 'dblclick', L.DomEvent.preventDefault)
          .on(container, 'dblclick', L.DomEvent.stopPropagation);
        callback();
      },

       _handleClick: function(e) {
        var id = this.id.replace('_button', ''),
        active;
        for (var i = 0; i < NPMap.config.overlays.length; i++) {
          var overlay = NPMap.config.overlays[i];
          if (overlay.L) {
            NPMap.config.L.removeLayer(overlay.L);
            delete overlay.L;
            }
          if (overlay.id.indexOf(id) > -1 ) {
            L.npmap.layer.mapbox(overlay).addTo(NPMap.config.L);
            }
          };
        }
      });
    new ButtonControl().addTo(NPMap.config.L);
    }
  },
  minZoom: 14,
  modules: [{
    content: '<div id="my-custom-module"></div>',
    icon: 'search',
    title: 'Search',
    type: 'custom',
  }],
  overlays: [{
    id: 'nps.Battle_of_Beaver_Dam_Creek,nps.Battle_626_1530',
    popup: App.popup,
    type: 'mapbox'
  }, {
    id: 'nps.Battle_of_Beaver_Dam_Creek,nps.Battle_626_1700',
    popup: App.popup,
    type: 'mapbox',
    visible: false
  },{
    id: 'nps.Battle_of_Beaver_Dam_Creek,nps.Battle_626_1800',
    popup: App.popup,
    type: 'mapbox',
    visible: false
  },{
    id: 'nps.Battle_of_Beaver_Dam_Creek,nps.Battle_626_1830',
    popup: App.popup,
    type: 'mapbox',
    visible: false
  },{
    id: 'nps.Battle_of_Beaver_Dam_Creek,nps.Battle_626_1930',
    popup: App.popup,
    type: 'mapbox',
    visible: false
  }],
  printControl: true,
  shareControl: true,
  smallzoomControl: {
    position: 'topright'
  },
  zoom: 14
};

 (function() {
    var s = document.createElement('script');
    s.src = 'http://www.nps.gov/npmap/npmap.js/latest/npmap-bootstrap.min.js';
    document.body.appendChild(s);
  })();
