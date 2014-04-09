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
      var ButtonControl = L.Control.extend({
      options: {
        position: 'bottomright'
      },
      initialize: function(options) {
        L.Util.extend(this.options, options);
        return this;
      },
      onAdd: function() {
        var container = L.DomUtil.create('div', 'battle-time-buttons');

        this._button1530 = L.DomUtil.create('button', 'btn btn-default active', container);
        this._button1700 = L.DomUtil.create('button', 'btn btn-default', container);
        this._button1800 = L.DomUtil.create('button', 'btn btn-default', container);
        this._button1830 = L.DomUtil.create('button', 'btn btn-default', container);
        this._button1930 = L.DomUtil.create('button', 'btn btn-default', container);
        this._button1530.innerHTML = '3:30pm';
        this._button1700.innerHTML = '5:00pm';
        this._button1800.innerHTML = '6:00pm';
        this._button1830.innerHTML = '6:30pm';
        this._button1930.innerHTML = '7:30pm';

        L.DomEvent.addListener(this._button1530, 'click', this._handleClick, this);
        L.DomEvent.addListener(this._button1700, 'click', this._handleClick, this);
        L.DomEvent.addListener(this._button1800, 'click', this._handleClick, this);
        L.DomEvent.addListener(this._button1830, 'click', this._handleClick, this);
        L.DomEvent.addListener(this._button1930, 'click', this._handleClick, this);

        L.DomEvent
          .on(container, 'click', L.DomEvent.preventDefault)
          .on(container, 'click', L.DomEvent.stopPropagation)
          .on(container, 'dblclick', L.DomEvent.preventDefault)
          .on(container, 'dblclick', L.DomEvent.stopPropagation);
        callback();

        return container;
      },
       _handleClick: function(e) {
        var b1530Layer = NPMap.config.L.tileLayer('nps.Battle_626_1530').addTo(NPMap.config.L),
        b1700Layer = NPMap.config.L.tileLayer('nps.Battle_626_1700').addTo(NPMap.config.L),
        b1800Layer = NPMap.config.L.tileLayer('nps.Battle_626_1800').addTo(NPMap.config.L),
        b1830Layer = L.tileLayer('nps.Battle_626_1830').addTo(NPMap.config.L),
        b1930Layer = L.tileLayer('nps.Battle_626_1930').addTo(NPMap.config.L);

        L.getContainer().querySelector('#btn btn-default').onclick = function (){
            if(this.className === 'active') {
                L.npmap.map.removeLayer(b1530Layer);
                L.npmap.map.removeLayer(b1700Layer);
                L.npmap.map.removeLayer(b1800Layer);
                L.npmap.map.removeLayer(b1830Layer);
                L.npmap.map.removeLayer(b1930Layer);
                this.className = 'active';
            } else {
                L.npmap.map.addLayer(b1530Layer);
                L.npmap.map.addLayer(b1700Layer);
                L.npmap.map.addLayer(b1800Layer);
                L.npmap.map.addLayer(b1830Layer);
                L.npmap.map.addLayer(b1930Layer);
                this.className = 'active';
            }
            return false;
        };
      }
    });
    new ButtonControl().addTo(NPMap.config.L);
  }
 },
      // document.getElementById('my-custom-module').innerHTML = 'My Test';
  minZoom: 14,
  modules: [{
    content: '<div id="my-custom-module"></div>',
    icon: 'search',
    title: 'Search',
    type: 'custom',
    visible: false
  }],
  overlays: [{
    id: 'nps.Battle_of_Beaver_Dam_Creek,nps.Battle_626_1530',
    popup: {
      content: function(data) {
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
    },
    type: 'mapbox'
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
