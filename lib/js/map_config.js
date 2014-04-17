/* global L */
/* jshint camelcase: false */
var App, NPMap;

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

NPMap = {
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
       var html = '',
            info = [],
            unitList;

      document.getElementById('my-custom-module').innerHTML =
        '<p>Find a Specific Unit (i.e. Battery C, US Artillery)</p>' +
          '<div id="unit-list">' +
            '<input type="text" class="fuzzy-search" placeholder="Search"/>' +
              '<button class="sort" data-sort="baselevel">Search</button>' +
      '<div id="loading-results">' +
        '<img src="../lib/img/loader-green.gif">&nbsp;Loading...' +
      '</div>' +
        '<ul class="list"></ul></div>';

        $(document).ready(function(){
          $.getJSON('../battles.json', function(data) {
            $(data.features).each(function(i, v) {
              var content = {
                baseLevel : v.properties.BaseLevel,
                force : v.properties.Force,
                id : v.properties.ID,
                lat: v.geometry.coordinates[1],
                lng: v.geometry.coordinates[0]
              };
              info.push(content);
              html += '<li>' +
              '<h3 class="baseLevel"><strong>BaseLevel: </strong>' + v.properties.BaseLevel + '</h3><h3 class="force"><strong>Force: </strong>' + v.properties.Force + '</h3><p class="id"><strong>ID: </strong>' + v.properties.ID + '</p></li>';
            });
            console.log(info);

          $('ul.list').append(html);

          options = {
            valueNames: [ 'baseLevel', 'force', 'id'],
            plugins: [ ListFuzzySearch() ]
          };

          unitList = new List('unit-list', options, info);

        $('#sort').on('click', function() {
          var nav = window.Event ? true : false;

          if (nav) {
            window.captureEvents(Event.KEYDOWN);
            window.onkeydown = NetscapeEventHandler_KeyDown;
          } else {
            document.onkeydown = MicrosoftEventHandler_KeyDown;
          }

          function NetscapeEventHandler_KeyDown(e) {
            if (e.which == 13 && e.target.type != 'unit-list' && e.target.type != 'search') {
              return false;
            }
            return true;
          }
          function MicrosoftEventHandler_KeyDown() {
            if (event.keyCode == 13 && event.srcElement.type != 'unit-list' && event.srcElement.type != 'search')
              return false;
            return true;
          }
        });

         $('li').on('hover', function() {
            $('map').fitBounds([info.lng, info.lat])
         });
      });
     });
       // if ($('#select-units').val() !== 'All Levels') {
       //  var unitType = $('#select-units').val();

        // if (unitType === 'Armies') {
        //   unitType = 'Army';
        // } else if (unitType != 'Corps') {
        //   unitType = unitType.slice(0, unitType.length - 1);
         // }

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

