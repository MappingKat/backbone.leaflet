(function ( Backbone, _, L ) {
  "use strict";
  var $ = Backbone.$;
  Leaflet.VERSION = '0.1.1';
});

var GeoModel = Backbone.Model.extend({

  keepId: false,

  set: function(key, value, options) {
    var args, attrs, _attrs, geometry;
      args = arguments;
      // Handle both `"key", value` and `{key: value}` -style arguments.
      if ( typeof key === 'object' ) {
        attrs = key;
        options = val;
      }
      // Handle GeoJSON argument.
      if ( attrs && attrs['type'] && attrs['type'] === 'Feature' ) {
        _attrs = _.clone( attrs['properties'] ) || {};
        // Clone the geometry attribute.
        geometry = _.clone( attrs['geometry'] ) || null;
        if ( geometry ) {
          geometry.coordinates = geometry['coordinates'].slice();
        }
        _attrs['geometry'] = geometry;
        if ( attrs[this.idAttribute] ) {
          _attrs[this.idAttribute] = attrs[this.idAttribute];
        }
        args = [_attrs, options];
      }
      return Backbone.Model.prototype.set.apply( this, args );
    },

  toJSON: function ( options ) {
      var attrs, props, geometry;
      options = options || {};
      attrs = _.clone( this.attributes );
      props = _.omit( attrs, 'geometry' );
      // Add model cid to internal use.
      if ( options.cid ) {
        props.cid = this.cid;
      }
      // Clone the geometry attribute.
      geometry = _.clone( attrs['geometry'] ) || null;
      if ( geometry ) {
        geometry.coordinates = geometry['coordinates'].slice();
      }
      var json = {
        type: 'Feature',
        geometry: geometry,
        properties: props
      };
      if ( this.keepId ) {
        json[ this.idAttribute ] = this.id;
      }
      return json;
    }
});

// -------------------------------------------------------------------------
// -------------------------------------------------------------------------

var GeoCollection = Backbone.Collection.extend({

    model: GeoModel,

    reset: function ( models, options ) {
      if ( models && !_.isArray( models ) && models.features ) {
        models = models.features;
      }
      return Backbone.Collection.prototype.reset.apply( this,
                                                        [models, options] );
    },

    // http://www.geojson.org/geojson-spec.html#feature-collection-objects
    toJSON: function ( options ) {
      var features = Backbone.Collection.prototype.toJSON.apply( this,
                                                                 arguments );
      return {
        type: 'FeatureCollection',
        features: features
      }
    }
  });

// -------------------------------------------------------------------------
// -------------------------------------------------------------------------


var MapView = function ( options ) {
  this.options = options || {};
  Backbone.Vew.apply( this arguments );
  this._ensureMap();
  this._initDrawControl();
  this._layers = {};

  this._layer = this._getLayer();
  this._layer.addTo (this.map);

}







// var MapView = Backbone.Leaflet.MapView({

//   el: "#map",

//   collection: geoCollection
// });


// var MyMapView = Backbone.View.extend({

//   events: {
//     'click map': 'onClick',
//     'move map': 'onMove',
//     'click layer': 'onLaterClick'
//   },

//   onClick: function (e){
//     console.log('map clicked')
//   },

//   onMove: function (e){
//     console.log('moved')
//   },

//   onLayerClick: function (e){
//     var layer = e.target;
//     var model = this.collection.get(layer);
//   }
// });

// var myMapView = new MyMapView


//   template: _.template($('#map-template').html()),

//    initialize: function(){
//       this.render();
//     }

//   render: function () {
//     this.$el.html(this.template());


//   var historicMap = L.tileLayer('http://a.tiles.mapbox.com/v3/nps.Battle_of_Beaver_Dam_Creek/{z}/{x}/{y}.png', {
//       attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
//       maxZoom: 18
//     });

//   var map = L.map('map').setView ([37.6038,-77.3717], 14);

//     return this;
//     }
//   });

//   $('#container').html(mapView.render().el);



      // Initial geoJSON to render.
      var geoJSON = {src: "/lib/battles.json"};
      console.log(geoJSON);

      // Backbone view to create the list of "features".
      var LayerView = Backbone.View.extend({
        className: 'npmap-slider',
        initialize: function () {
          this.listenTo( this.collection, 'add', this.addOne );
          this.listenTo( this.collection, 'reset', this.addBase );
        },
        addOne: function ( model ) {
          var view = new ListItemView({ model: model });
          this.$el.append( view.render().el );
        },
        addBase: function () {
          this.$el.html( '' );
          // this.collection.each( this.addOne, this );
        }
      });

      // Backbone view to display an item in the "features" list.
      var ListItemView = Backbone.View.extend({
        tagName: 'li',
        className: 'list-item',
        // template: _.template( $( '#list-item-template' ).html() ),
        events: {
          'click .destroy': 'clear',
          'click .label': 'toggle',
        },
        initialize: function () {
          this.listenTo( this.model, 'change', this.render );
          this.listenTo( this.model, 'destroy', this.remove );
        },
        render: function () {
          this.$el.html( this.template( this.model.toJSON() ) );
          return this;
        },
        clear: function () {
          this.model.destroy();
        },
        toggle: function () {
          this.model.toggle();
        }
      });

      // Output view to display the current geoJSON and to allow the user to
      // edit it and then reset the map content.
      var OutputView = Backbone.View.extend({
        // template: _.template( $( '#output-template' ).html() ),
        events: {
          'click .reset': 'onReset',
          'click .export': 'render',
        },
        initialize: function () {
          this.listenTo( this.collection, 'reset', this.render );
        },
        render: function () {
          this.$el.html( this.template({
            geoJSON: JSON.stringify( this.collection.toJSON(), null, '  ' )
          }) );
          return this;
        },
        onReset: function () {
          this.collection.reset( JSON.parse( this.$( '.geoJSON' ).val() ) );
        }
      });

      // Extending the `Backbone.Leaflet.MapView` to bind map events.
      var MyMapView = Backbone.Leaflet.MapView.extend({
        // Bind `map` events using `map` as selector and `layers` events using
        // `layer` as selector.
        events: {
          'click map': 'onClick',
          'click layer': 'onLayerClick',
          'mouseover layer': 'onLayerMouseover',
          'mouseout layer': 'onLayerMouseout'
        },

        // Toggle the model state when user click the marker.
        onLayerClick: function ( e ) {
          var layer = e.target;
          var model = this.collection.get( layer );
          model.toggle();
        },

        // Open the popup window on mouseover.
        onLayerMouseover: function ( e ) {
          var layer = e.target;
          this.openPopup( layer );
        },

        // Close the popup window on mouseout.
        onLayerMouseout: function ( e ) {
          var layer = e.target;
          layer.closePopup();
        },

        // Override the method used the set the layer style.
        layerStyle: function ( model ) {
          var opacity = model.get( 'active' ) ? 1 : 0.5;
          return {
            opacity: opacity
          }
        }
      });

      // Extending the `Backbone.Leaflet.GeoModel` to add custom methods.
      var MyGeoModel = Backbone.Leaflet.GeoModel.extend({
        toggle: function () {
          this.set( 'active', !this.get( 'active' ) );
        }
      });

      // Creates a `GeoCollection` instance.
      var geoCollection = new Backbone.Leaflet.GeoCollection([], {
        model: MyGeoModel
      });

      // Creates an extended `mapView` instance.
      var mapView = new MyMapView({
        el: '#map',
        collection: geoCollection
      });

      // Creates a list view instance.
      var listView = new ListView({
        el: '#list',
        collection: geoCollection
      });

      // Creates an output view instance to show the geoJSON generated.
      var outputView = new OutputView({
        el: '#output',
        collection: geoCollection
      });

      // Loads models from geoJSON.
      geoCollection.reset( geoJSON );





      <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>Footsteps of History - Battle of Beaver Dam Creek</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="">
    <meta name="author" content="">
    <link href="libs/bootstrap/css/bootstrap.css" rel="stylesheet">
    <link href="libs/bootstrap/css/bootstrap-responsive.css" rel="stylesheet">
    <link href="css/main.css" rel="stylesheet">
    <!--[if lt IE 9]>
      <script src="//html5shim.googlecode.com/svn/trunk/html5.js"></script>
    <![endif]-->
    <script src="libs/jquery/1.8.2.min.js"></script>
    <link rel="shortcut icon" href="http://www.nps.gov/npmap/favicon.ico">
    <link rel="apple-touch-icon-precomposed" sizes="144x144" href="http://www.nps.gov/npmap/apple-touch-icon-144x144-precomposed.png">
    <link rel="apple-touch-icon-precomposed" sizes="114x114" href="http://www.nps.gov/npmap/apple-touch-icon-114x114-precomposed.png">
    <link rel="apple-touch-icon-precomposed" sizes="72x72" href="http://www.nps.gov/npmap/apple-touch-icon-72x72-precomposed.png">
    <link rel="apple-touch-icon-precomposed" href="http://www.nps.gov/npmap/apple-touch-icon-57x57-precomposed.png">
  </head>
  <body>

    <!-- Top Black Banner -->
    <div id="wrapper">
      <header>
        <div style="height:70px;left:0;position:absolute;top:0;width:100%;">
          <!-- TODO: Change these to background images.-->
          <span style="float:left;">
            <img src="img/bar-footstepsofhistory.png" alt="NPMap">
          </span>
          <span style="float:right;">
            <img src="img/bar-rich.png" alt="Richmond National Battlefield Park">
          </span>
        </div>
        <div style="bottom:40px;left:3px;position:absolute;" class="return-link">
          <a href="http://www.nps.gov/rich">
            Return to Park Website
          </a>
        </div>
      </header>

    <!-- Search button -->
      <div id="main">

        <div id="modules-tabs" style="left:10px;position:absolute;z-index:999999;border-radius:7px;">
          <div id="module-tab-search" class="module-tab" onclick="NPMap.app.handleModuleTabClick(this);return false;">
            <img src="img/tab-search-16x16.png" alt="Search">
          </div>
        </div>

    <!-- Search menu/bar -->
        <div id="modules" style="display:none;">
          <div id="module-tab-close" class="module-tab" style="position:absolute;right:-1px;right:-28px" onclick="NPMap.app.handleModuleCloseClick();return false;">
            <img src="img/tab-close-icon.png" alt="Close">
          </div>
          <div id="module-legend" class="module" style="display:none;">
            <div class="module-header">
             <!--  <h2>
                Legend
              </h2> -->
            </div>
            <div class="module-content">
            </div>
          </div>
          <div id="module-search" class="module" style="display:none;">
            <div class="module-header" style="height: 25px;">
              <h2>
                Search
              </h2>
            </div>
            <div class="module-content" style="bottom: 0; left: 0; position: absolute; top: 44px; width: 100%;">
              <form id="form-search" style="border-bottom: solid 1px #EDEBE4; height: 55px; margin-bottom: 0; padding: 9px 13px; position: relative;">
                <p>
                  Search For a Unit
                </p>
                <select id="select-units" style="width: 100px;">
                  <option value="All Levels">
                    All Categories
                  </option>
                  <option value="Army HQs">
                    Army HQs
                  </option>
                  <option value="Corps">
                    Corps
                  </option>
                  <option value="Divisions">
                    Divisions
                  </option>
                  <option value="Brigades">
                    Brigades
                  </option>
                  <option value="Units">
                    Units
                  </option>
                </select>
                &nbsp;for&nbsp;
                <input id="input-search" type="text" style="padding-right: 27px; width: 158px;">
                <button class="search-btn ir" type="button">
                  <!-- Search for a unit -->
                </button>
              </form>

      <!-- Search results -->
              <div id="loading-results" style="color: #647634; display: none; margin-top: 18px; text-align: center;">
                <img src="img/loader-green.gif">&nbsp;Loading...
              </div>
              <div id="no-results" style="margin-top: 18px; text-align: center;">
                No results. Type your search above.
              </div>
              <div id="unit-table" style="bottom: 0; cursor: pointer; display: none; font-size: 14px; left: 0; margin-top: 9px; overflow: auto; padding: 0 15px 9px 15px; position: absolute; top: 75px; width: 320px;">

      <!-- Table Results -->
                <table class="table table-bordered table-condensed" style="background-color: white;">
                  <thead>
                    <tr>
                      <th class="sort" data-sort="force" style="text-align: left; width: 100px;">
                        Force
                      </th>
                      <th class="sort" data-sort="type" style="text-align: left; width: 65px;">
                        Type
                      </th>
                      <th class="sort" data-sort="name" style="text-align: left; width: 150px;">
                        Name
                      </th>
                    </tr>
                  </thead>
                  <tbody class="list" style="overflow: auto;" >
                  </tbody>
                </table>
                <table style="display: none;">
                  <tr id="unit-table-item">
                    <td class="force">
                    </td>
                    <td class="type">
                    </td>
                    <td class="name">
                    </td>
                  </tr>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div id="center">
          <div id="map">
          </div>

    <!-- Bottom Banner -->
          <footer>
            <ul>
              <li class="home-link">
                <a href="/">
                  Home
                </a>
              </li>
              <li>
                <a href="/faqs.htm">
                  Frequently Asked Questions
                </a>
              </li>
              <li>
                <a href="/website-policies.htm">
                  Website Policies
                </a>
              </li>
              <li>
                <a href="/contacts.htm">
                  Contact Us
                </a>
              </li>
            </ul>
            <span class="tag-line ir">
              Experience Your America
            </span>
          </footer>
        </div>
      </div>
    </div>
  <script src="js/script.js"></script>
  </body>
</html>








  filter:

  });


var MyMapView = Backbone.Leaflet.MapView.extend({

  events: {
    'click map': 'onClick',
    'move map': 'onMove',
    'click layer': 'onLaterClick'
  },

  onClick: function (e){
    console.log('map clicked')
  },

  onMove: function (e){
    console.log('moved')
  },

  onLayerClick: function (e){
    var layer = e.target;
    var model = this.collection.get(layer);
  }
});

var myMapView = new MyMapView


  template: _.template($('#map-template').html()),

   initialize: function(){
      this.render();
    }

  render: function () {
    this.$el.html(this.template());


  var historicMap = L.tileLayer('http://a.tiles.mapbox.com/v3/nps.Battle_of_Beaver_Dam_Creek/{z}/{x}/{y}.png', {
      attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
      maxZoom: 18
    });

  var map = L.map('map').setView ([37.6038,-77.3717], 14);

    return this;
    }
  });

  $('#container').html(mapView.render().el);