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
  // maxBounds: [
  // [37.4416585, -77.5615298],
  // [37.6914764, -77.2765719]
  // ],
  div: 'map',
  fullscreenControl: true,
  homeControl: {
    position: 'topright'
  },
  hooks: {
    init: function(callback) {

      document.getElementById('my-custom-module').innerHTML = '<div class="module-content" style="bottom: 0; left: 0; position: absolute; top: 4px; width: 100%;"> <form id="form-search" style="border-bottom: solid 1px #EDEBE4; height: 55px; margin-bottom: 0; padding: 9px 13px; position: relative;"> <p> Find a Specific Unit<br>(i.e. Battery C, 5 U. S. Artillery)</p><input id="input-search" type="text" style="padding-right: 27px; width: 200px;margin-bottom:10px;z-index:15;"><button class="search-btn ir" title="Search" style="z-index:-1"></button><br>&nbsp;in&nbsp; <select multiple class="form control" style="width: 200px;"> <option value="All Levels"> All Categories </option> <option value="Army HQs"> Army HQs </option> <option value="Corps"> Corps </option> <option value="Divisions"> Divisions </option> <option value="Brigades"> Brigades </option> <option value="Units"> Units </option> </select></form> <div id="loading-results" style="color: #647634; display: none; margin-top: 18px; text-align: center;"> <img src="../lib/img/loader-green.gif">&nbsp;Loading... </div> <div id="no-results" style="margin-top: 18px; text-align: center;"> <br> No results. Type your search above. </div> <div id="unit-table" style="bottom: 0; cursor: pointer; display: none; font-size: 14px; left: 0; margin-top: 9px; overflow: auto; padding: 0 15px 9px 15px; position: absolute; top: 75px; width: 320px;"> <!-- Table Results --> <table class="table table-bordered table-condensed" style="background-color: white;"> <thead> <tr> <th class="sort" data-sort="force" style="text-align: left; width: 100px;"> Force </th> <th class="sort" data-sort="type" style="text-align: left; width: 65px;"> Type </th> <th class="sort" data-sort="name" style="text-align: left; width: 150px;"> Name </th> </tr> </thead> <tbody class="list" style="overflow: auto;" > </tbody> </table> <table style="display: none;"> <tr id="unit-table-item"> <td class="force"> </td> <td class="type"> </td> <td class="name"> </td> </tr> </table> </div> </div> </div>';

        $(document).ready(function(){
          $('#form-search').on('submit', function() {
            var userValue = $('#input-search').val();

            if (value {
              $.each(value.split(' '), function(i,v) {

              })
            })
          })
          var data = src(../battles.json);

          var searchList = new List('unit-table', values);
        })

     // var featureLayers = new L.GeoJSON(data, { style: function(f) { return {color: f.properties.color }; } });

     // data = battles

     // var searchControl = new L.Control.Search({ layer:featuresLayers}).addTo(NPMap.config.L);

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
        overViewButton = document.getElementsByClassName('battle');
        var timeButton = document.getElementsByClassName('time btn btn-default');

        L.DomEvent.addListener(overViewButton, 'click', this._handleClick);

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
            if (overlay.id.indexOf(id) > -1 ) {
              L.npmap.layer.mapbox(overlay).addTo(NPMap.config.L);
              }
          // else if ( overViewButton ) {
          //     doSetTimeout(i);
          //   }
          }
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

src="//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js";
src="//ajax.googleapis.com/ajax/libs/jqueryui/1.10.3/jquery-ui.min.js";
src="//listjs.com/js/list.js";
