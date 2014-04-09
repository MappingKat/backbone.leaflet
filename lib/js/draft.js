/* global L, NPMap */
/* jshint camelcase: false */

var App;

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
    // L is not called until here
    init: function(callback) {
      // L.npmap.util._.appendCssFile('lib/css/main.css', function() {
      var ButtonControl = L.Control.extend({
      options: {
        position: 'bottomright'
      },
      initialize: function(options){
        L.Util.extend(this.options, options);
        return this;
     },
      onAdd:  function () {// The slider div.
        var slider = document.createElement('div'),
        sliderHtml = '',
        ticks = [
                  '3:30pm',
                  '5:00pm',
                  '6:00pm',
                  '6:30pm',
                  '7:30pm']

        (function() {
          var slider = document.createElement('div'),
          sliderHtml = '<div class="npmap-slider-title">Battle of Beaver Dam Creek</div><div class="npmap-slider-bar"><div class="npmap-slider-bar-left"></div><div class="npmap-slider-bar-middle">',
          ticks = [
          '3:30pm',
          '5:00pm',
          '6:00pm',
          '6:30pm',
          '7:30pm'
          ],
          width = 560,
          increment = (function() {
            var tickWidth = ticks.length * 65;

            if (tickWidth < 560) {
              width = tickWidth;
              return 0;
            } else {
              return (560 - (ticks.length * 65)) / ticks.length;
            }
          })();

          slider.className = 'npmap-slider';
          slider.style.cssText = 'margin-left:-' + ((width + 40) / 2) + 'px;width:' + (width + 40) + 'px;';

          for (var i = 0; i < ticks.length; i++) {
            sliderHtml += '<div class="npmap-slider-item' + (i > 0 ? ' npmap-slider-item-border' : ' npmap-slider-item-active') + '" style="left:' + ((increment * i) + (65 * i)) + 'px;position:absolute;"><div style="bottom:5px;left:10px;position:absolute;">' + ticks[i] + '</div></div>';
          }

          sliderHtml += '</div><div class="npmap-slider-bar-right"></div></div>';

          slider.innerHTML = sliderHtml;

          NPMap.Map.addControl(slider);
        })();

        $('.npmap-slider-item').on('click', function(e) {
          var targetClass = "npmap-slider-item-active";
          $("." + targetClass).removeClass(targetClass).addClass("npmap-slider-item-border");
          $(this).addClass(targetClass);
          // change layer config
          // re-render the map
          });
          }
        });
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

// (function() {
// var s = document.createElement('script');
// s.src = 'http://www.nps.gov/npmap/npmap.js/2.0.0/npmap-bootstrap.min.js';
// document.body.appendChild(s);
// })();




