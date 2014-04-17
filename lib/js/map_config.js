/* global L */
/* jshint camelcase: false */

var nav = window.Event ? true : false;

if (nav) {
  window.captureEvents(Event.KEYDOWN);
  window.onkeydown = NetscapeEventHandler_KeyDown;
} else {
  document.onkeydown = MicrosoftEventHandler_KeyDown;
}

function NetscapeEventHandler_KeyDown(e) {
  if (e.which == 13 && e.target.type != 'textarea' && e.target.type != 'submit') {
    return false;
  }
  return true;
}
function MicrosoftEventHandler_KeyDown() {
  if (event.keyCode == 13 && event.srcElement.type != 'textarea' && event.srcElement.type != 'submit')
    return false;
  return true;
}

var App = {
  handleModuleCloseClick: function() {
    NPMap.app.toggleModule('search', false);
  },
  handleModuleTabClick: function(el) {
    NPMap.app.toggleModule(el.id.replace('module-tab-', ''), true);
  },
  toggleModule: function(module, on) {
    var $module = $('#module-' + module),
        $modules = $('#modules');

    if (on){
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

window.NPMap = {
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
      var html = "";

      document.getElementById('my-custom-module').innerHTML = '' +
        '<form id="form-search" style="border-bottom: solid 1px #EDEBE4; height: 55px;">' +
          '<p>Find a Specific Unit (i.e. Battery C, US Artillery)</p>' +
          '<input class="search" id="input-search" type="text"/>' +
          '<button class="btn btn-primary search" type="button">Search</button>' +
          '<div class="category"><br>&emsp;in&emsp;' +
            '<select multiple class="form control"><option value="All Levels">All Categories</option><option value="Army HQs">Army HQs</option><option value="Corps"> Corps</option><option value="Divisions">Divisions</option><option value="Brigades">Brigades</option><option value="Units">Units</option></select>' +
          '</div>' +
        '</form>' +
        '<div id="loading-results">' +
          '<img src="../lib/img/loader-green.gif">&nbsp;Loading...' +
        '</div>' +
        '<div id="no-results"><br>No results. Type your search above.</div>' +
        '<table class="table table-bordered table-condensed" id="unit-table">' +
          '<thead>' +
            '<tr>' +
              '<th class="sort" data-sort="baseLevel" style="text-align:left;width:100px;">Base Level</th>' +
              '<th class="sort" data-sort="force" style="text-align: left; width: 65px;">Force</th>' +
              '<th class="sort" data-sort="id" style="text-align: left; width: 150px;">ID</th>' +
            '</tr>' +
          '</thead>' +
           '<tbody id="unit-table-body" class="list">' + html +
          '</tbody>' +
        '</table>';

      $(document).ready(function(){
        $.getJSON('../battles.json', function(data) {
          var unitList;

          $(data.features).each(function(i, v) {
              html += '<td class="baseLevel">' + v.properties.BaseLevel + '</td><td class="force">' + v.properties.Force + '</td><td class="id">' + v.properties.ID + '</td></tr>';
          });

          unitList = new List('unit-table', {
                valueNames: [
                'baseLevel',
                'force',
                'id'
                ]
             });
          $('unit-table-body').append(html);
          });
        });

      var ButtonControl = L.Control.extend({
        options: {
          position: 'bottomright'
        },
        initialize: function(options) {
          L.Util.extend(this.options, options);
          return this;
        },
        onAdd: function() {
          var container = document.getElementsByClassName('battle-time-buttons')[0],
            timeButtons = document.getElementsByClassName('time btn btn-default');

          for (var i = 0; i < timeButtons.length; i++) {
            L.DomEvent.addListener(timeButtons[i], 'click', this._handleClick);
          }

          L.DomEvent
            .on(container, 'click', L.DomEvent.preventDefault)
            .on(container, 'click', L.DomEvent.stopPropagation)
            .on(container, 'dblclick', L.DomEvent.preventDefault)
            .on(container, 'dblclick', L.DomEvent.stopPropagation);

          return container;
        },
        _handleClick: function(e) {
          var id = this.id.replace('_button', ''),
            active;

          // function doSetTimeout(i) {
          //   setTimeout(function() {
          //     if (overlay.L) {
          //       NPMap.config.L.removeLayer(overlay.L);
          //       delete overlay.L;
          //     }
          //       L.npmap.layer.mapbox(overlay).addTo(NPMap.config.L);
          //       NPMap.config.L.addLayer(overlay);
          //   },10);
          // }

          for (var i = 0; i < NPMap.config.overlays.length; i++) {
            var overlay = NPMap.config.overlays[i];

            if (overlay.L) {
              NPMap.config.L.removeLayer(overlay.L);
              delete overlay.L;
            }

            if (overlay.id.indexOf(id) > -1) {
              L.npmap.layer.mapbox(overlay).addTo(NPMap.config.L);
              break;
            }
          }
        }
      });

      new ButtonControl().addTo(NPMap.config.L);
      callback();
    }
  },
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

