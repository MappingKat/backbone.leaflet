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



            document.getElementById('my-custom-module').innerHTML = 'My Test';
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
        /*
        },{
          popup: {
            content: '{{UnitCode'
          },
          user: 'nps',
          table: 'park_bounds',
          type: 'cartodb'
        */
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

(function ( Backbone, _, L ) {
//   "use strict";

//   // Get jQuery from Backbone.
//   var $ = Backbone.$;

//   // The top-level namespace. All public classes will be attached to this.
  var Leaflet = {};

//   // Current version of the component. Keep in sync with `package.json`.
  Leaflet.VERSION = '0.1.1';

//   // Save the previous value of the `Leaflet` attribute.
//   var previousBackboneLeaflet = Backbone.Leaflet;

//   // Attach our namespace to `Backbone` variable.
  Backbone.Leaflet = Leaflet;

//   // Runs Backbone.Leaflet in *noConflict* mode, returning the `Backbone`
//   // `Leaflet` attribute to its previous owner. Returns a reference to our
//   // object.
  Leaflet.noConflict = function () {
    Backbone.Leaflet = previousBackboneLeaflet;
    return this;
  };

  // -------------------------------------------------------------------------
  // Backbone.Leaflet.GeoModel
  // -------------------------------------------------------------------------

  // Extend `Backbone.Model`, adding georef support.
  var GeoModel = Leaflet.GeoModel = Backbone.Model.extend({

    // Set `true` to keep the id attribute as primary key when creating JSON.
    keepId: false,

    // Set a hash of model attributes on the object, firing `"change"` unless
    // you choose to silence it.
    // set: function ( key, val, options ) {
    //   var args, attrs, _attrs, geometry;
    //   args = arguments;
    //   // Handle both `"key", value` and `{key: value}` -style arguments.
    //   if ( typeof key === 'object' ) {
    //     attrs = key;
    //     options = val;
    //   }
    //   // Handle GeoJSON argument.
    //   if ( attrs && attrs['type'] && attrs['type'] === 'Feature' ) {
    //     _attrs = _.clone( attrs['properties'] ) || {};
    //     // Clone the geometry attribute.
    //     geometry = _.clone( attrs['geometry'] ) || null;
    //     if ( geometry ) {
    //       geometry.coordinates = geometry['coordinates'].slice();
    //     }
    //     _attrs['geometry'] = geometry;
    //     if ( attrs[this.idAttribute] ) {
    //       _attrs[this.idAttribute] = attrs[this.idAttribute];
    //     }
    //     args = [_attrs, options];
    //   }
    //   return Backbone.Model.prototype.set.apply( this, args );
    // },

    // The GeoJSON representation of a `Feature`.
    // http://www.geojson.org/geojson-spec.html#feature-objects
    // toJSON: function ( options ) {
    //   var attrs, props, geometry;
    //   options = options || {};
    //   attrs = _.clone( this.attributes );
    //   props = _.omit( attrs, 'geometry' );
    //   // Add model cid to internal use.
    //   if ( options.cid ) {
    //     props.cid = this.cid;
    //   }
    //   // Clone the geometry attribute.
    //   geometry = _.clone( attrs['geometry'] ) || null;
    //   if ( geometry ) {
    //     geometry.coordinates = geometry['coordinates'].slice();
    //   }
    //   var json = {
    //     type: 'Feature',
    //     geometry: geometry,
    //     properties: props
    //   };
    //   if ( this.keepId ) {
    //     json[ this.idAttribute ] = this.id;
    //   }
    //   return json;
    // }

  });

  // -------------------------------------------------------------------------
  // -------------------------------------------------------------------------

  // Backbone.Leaflet.GeoCollection
  // ------------------------------

  // Extend `Backbone.Collection`, adding georef support.
  var GeoCollection = Leaflet.GeoCollection = Backbone.Collection.extend({
    // Default model.
    model: GeoModel,

    // When you have more items than you want to add or remove individually,
    // you can reset the entire set with a new list of models, without firing
    // any `add` or `remove` events. Fires `reset` when finished.
    reset: function ( models, options ) {
      // Accpets FeatureCollection GeoJSON as `models` param.
      if ( models && !_.isArray( models ) && models.features ) {
        models = models.features;
      }
      return Backbone.Collection.prototype.reset.apply( this,
                                                        [models, options] );
    },

    // The GeoJSON representation of a `FeatureCollection`.
    // http://www.geojson.org/geojson-spec.html#feature-collection-objects
    toJSON: function ( options ) {
      var features = Backbone.Collection.prototype.toJSON.apply( this,
                                                                 arguments );
      return {
        type: 'FeatureCollection',
        features: features
      };
    }

  });


  // -------------------------------------------------------------------------
  // -------------------------------------------------------------------------

  // Backbone.Leaflet.PopupView
  // --------------------------

  // Extend `Backbone.View`.
  var PopupView = Leaflet.PopupView = function ( options ) {
    // TODO: Write documentation about this
    Backbone.View.apply( this, arguments );
    // Create the Leaflet Popup instance used to display this view.
    this.popup = new L.Popup( options );
  };

  // Set up inheritance.
  PopupView.extend = Backbone.View.extend;

  _.extend( PopupView.prototype, Backbone.View.prototype, {
      constructor: PopupView,

      template: _.template( '<strong><'+'%= properties.name %'+'></strong><p><%'+'= properties.description %'+'></p>' ),

      // Render the model into popup.
      render: function () {
        if ( this.popup._content !== this.el ) {
          this.popup.setContent( this.el );
        }
        this.$el.html( this.template( this.model.toJSON() ) );
        return this;
      },

      // Set new model to be rendered.
      setModel: function ( model ) {
        if ( model ) {
          if ( this.model ) {
            this.stopListening( this.model );
          }
          this.model = model;
          this.listenTo( model, 'change', this.render );
        }
        return this;
      }
  });

  // -------------------------------------------------------------------------
  // -------------------------------------------------------------------------

  // Helper functions
  // ----------------

  // Default pointToLayer function to GeoJSON layer.
  var layerPointToLayer = function ( feature, latLng ) {
    var model = this._getModelByFeature( feature );
    return new L.Marker( latLng, this.layerStyle( model ) );
  };

  // Default filter function to GeoJSON layer.
  var layerFilter = function ( feature, layer ) {
    var model = this._getModelByFeature( feature );
    return this.modelFilter( model );
  };

  // Default style function to GeoJSON layer.
  var layerStyle = function ( feature ) {
    var model = this._getModelByFeature( feature );
    return this.layerStyle( model );
  };

  // Associates Backbone model and GeoJSON layer.
  var layerOnEachFeature = function ( feature, layer ) {
    this._layers[feature.properties.cid] = layer;
    // Add cid to layer object to associate it with the backbone model instance.
    layer.cid = feature.properties.cid;
    // Proxy layer events.
    var layerEvents = [
      'click',
      'dblclick',
      'mouseover',
      'mouseout',
      'contextmenu',
      'dragstart',
      'predrag',
      'drag',
      'dragend',
      'move',
      'add',
      'remove',
      'layeradd',
      'layerremove'
    ];
    var that = this;
    _.each( layerEvents, function ( eventName ) {
      layer.on(eventName, function ( e ) {
        var map = layer._map;
        map.fire.apply( map, ['layer_' + eventName].concat( arguments ) );
      });
    });
  };


  // Converts the `Leaflet` layer type to GeoJSON geometry type.
  var layerTypeToGeometryType = function ( layerType ) {
    // FIXME: Write some tests.
    switch ( layerType ) {
      case 'marker':
        return 'Point';
      case 'polygon':
      case 'rectangle':
        return 'Polygon';
      case 'polyline':
        return 'LineString';
      default:
        throw new Error( "GeoJSON don't allows " + layerType + " as geometry." );
    }
  };


  // Get the GeoJSON geometry coordinates from `Leaflet` layer.
  var layerToCoords = function ( layer, type ) {
    // FIXME: Write some tests.
    var latLngs;
    var coords = [];

    // Use duck typing to get the `LatLng` objects from layer.
    if ( _.isFunction( layer.getLatLngs ) ) {
      latLngs = layer.getLatLngs();
    } else if ( _.isFunction( layer.getLatLng ) ) {
      latLngs = [ layer.getLatLng() ];
    }

    // Convert the `LatLng` objects to GeoJSON compatible array.
    _.each( latLngs, function ( latLng ) {
      coords.push( [ latLng.lng, latLng.lat ] );
    });

    if ( type === 'polygon' || type === 'rectangle' ) {
      coords = [ coords ];
    } else if ( type === 'marker' ) {
      coords = coords[0];
    }

    return coords;
  };


  // Creates a GeoJSON from `Leaflet` layer.
  var layerToGeoJSON = function ( layer, type ) {
    // FIXME: Write some tests.
    return {
      "type": "Feature",
      "geometry": {
        "type": layerTypeToGeometryType( type ),
        "coordinates": layerToCoords( layer, type )
      },
      "properties": {}
    };
  };

  // Cached regex to split keys for `delegate`.
  var delegateEventSplitter = /^(\S+)\s*(.*)$/;

  // -------------------------------------------------------------------------
  // -------------------------------------------------------------------------

  // Backbone.Leaflet.MapView
  // ------------------------

  // Backbone view to display `Backbone.Leaflet.GeoModel` and
  // `Backbone.Leaflet.GeoCollection` instances on map.
  var MapView = Leaflet.MapView = function ( options ) {
    // Temporary fix to make compatible with backbone 1.1.x
    this.options = options || {};
    Backbone.View.apply( this, arguments );
    this._ensureMap();
    this._initDrawControl();
    this._layers = {};
    // Create a GeoJSON layer associated with the collection
    this._layer = this._getLayer();
    this._layer.addTo( this.map );
    if ( this.collection ) {
      if ( !this.collection instanceof GeoCollection ) {
        throw new Error( 'The "collection" option should be instance of ' +
                         '"GeoCollection" to be used within Map view' );
      }
      // Bind Collection events.
      this.listenTo( this.collection, 'reset', this._onReset );
      this.listenTo( this.collection, 'add', this._onAdd );
      this.listenTo( this.collection, 'remove', this._onRemove );
      this.listenTo( this.collection, 'change', this._onChange );
      this.redraw();
    }
  };

  // Set up inheritance.
  MapView.extend = Backbone.View.extend;

  // Inherit `Backbone.View`.
  _.extend( MapView.prototype, Backbone.View.prototype, {
    // Prevents weird bug related to Aura component.
    constructor: MapView,

    // Default options used to create the Leaflet map.
    // See http://leafletjs.com/reference.html#geojson-options
    defaultLayerOptions: {
      pointToLayer: layerPointToLayer,
      filter: layerFilter,
      style: layerStyle,
      onEachFeature: layerOnEachFeature
    },

    // Default visual style to be applied to model exhibition on map.
    // For more information see
    // http://leafletjs.com/reference.html#marker-options
    // http://leafletjs.com/reference.html#path-options
    // http://leafletjs.com/reference.html#polyline-options
    // defaultStyle: {

    // },

    // Default options used to create the Leaflet map.
    defaultMapOptions: {
      center: [37.606757, -77.350137],
      zoom: 14,
      // Add draw control if `Leaflet.draw` plugin was loaded.
      drawControl: (L.Draw != null)
    },

    // Default options used to create the Leaflet popup.
    // defaultPopupOptions: {

    // },

    render: function () {
      this.map.invalidateSize();
    },

    redraw: function () {
      this._layers = {};
      this._layer.clearLayers();
      this._layer.addData( this.collection.toJSON({ cid: true }) );
      return this;
    },

    // Call `Backbone.View.prototype.delegateEvents` then bind events with
    // `map` selector to `Leaflet` map object.
    //
    // See `Leaflet` documentation to get available events.
    // http://leafletjs.com/reference.html#map-events
    delegateEvents: function ( events ) {
      this._ensureMap();
      // this._ensurePopup();
      var context = 'delegateEvents' + this.cid;
      Backbone.View.prototype.delegateEvents.apply( this, arguments );
      // Do everything as `Backbone` do but bind to `Leaflet`.
      if ( !( events || ( events = _.result( this, 'events' ) ) ) ) {
        return this;
      }
      var featureCallback = function ( method ) {
        return function ( e ) {
          var origEvent = e[0];
          method( origEvent );
        };
      };
      this._leaflet_events = {};
      for ( var key in events ) {
        // Get the callback method.
        var method = events[key];
        if ( !_.isFunction( method ) ) {
          method = this[events[key]];
        }
        if ( !method ) {
          throw new Error( 'Method "' + events[key] + '" does not exist' );
        }
        var match = key.match( delegateEventSplitter ),
            eventName = match[1],
            selector = match[2];
        method = _.bind( method, this );

        // Now we bind events with `map` selector to `Leaflet` map.
        if ( selector === 'map' || selector === 'layer' ) {
          if ( selector === 'layer' ) {
            eventName = 'layer_' + eventName;
            method = featureCallback( method );
          }
          this.map.on( eventName, method, context );
          // Save the callbacks references to use to undelegate the events.
          this._leaflet_events[eventName] = method;
        }
      }
      return this;
    },

    // Clears all callbacks previously bound to the map with our custom
    // `delegateEvents`, then call `undelegateEvents` from `Backbone.View`.
    undelegateEvents: function () {
      var context = 'delegateEvents' + this.cid;
      // Clear the map events.
      this.map.off( this._leaflet_events || {}, context );
      this._leaflet_events = null;
      return Backbone.View.prototype.undelegateEvents.apply( this, arguments );
    },

    // Return a `L.TileLayer` instance. Uses the `MapQuest` tiles by default.
    // Override this to use a custom tile layer.
    getTileLayer: function () {
      return new L.TileLayer('http://{s}.tiles.mapbox.com/v3/nps.Battle_of_Beaver_Dam_Creek/{z}/{x}/{y}.png'
      );
    },

    // Open the popup for `obj`, using `content` if defined.
    // If the optional `content` parameter was not passed, use the popupView.
    // The `obj` parameter can be a model or a layer.
    // openPopup: function ( obj, content ) {
    //   this._ensurePopup();
    //   // Get the model and the layer from objmq.
    //   var model = this.collection.get( obj );
    //   var layer = this._getLayerByModel( model );
    //   layer.bindPopup( '' );
    //   // Copy the layer popup options to popupView custom popup.
    //   L.setOptions( this.popup, layer._popup.options );
    //   // Replace the layer popup
    //   layer._popup = this.popup;
    //   // Use the optional content param.
    //   if ( content ) {
    //     this.popup.setContent( content );
    //   } else {
    //     this.popupView.setModel( model );
    //     this.popupView.render();
    //   }
    //   layer.openPopup();
    // },

    // Ensure that the vie has a `Leaflet` popup.
    // _ensurePopup: function () {
    //   if ( !this.popup ) {
    //     // Set the popup options values. `options.popup` accepts all `L.Popup`
    //     // options.
    //     // http://leafletjs.com/reference.html#popup-options
    //     this.popupOptions = _.defaults( this.options.popup || {},
    //                                     this.defaultPopupOptions );
    //     // Create the Leaflet popup instance.
    //     var PopupViewClass = this.options.popupView || PopupView;
    //     this.popupView = new PopupViewClass( this.popupOptions );
    //     this.popup = this.popupView.popup;
    //   }
    // },

    // Ensure that the view has a `Leaflet` map object.
    _ensureMap: function () {
      if ( this.map ) {
          // We already have initialized the `Leaflet` map.
          return;
      }

      // Set the map options values. `options.map` accepts all `L.Map`
      // options.
      // http://leafletjs.com/reference.html#map-constructor
      this.mapOptions = _.defaults( this.options.map || {},
                                    this.defaultMapOptions );
      // Create the Leaflet map instance.
      this.map = new L.Map( this.el, this.mapOptions );
      // Get the tile layer and add it to map
      this.tileLayer = this.getTileLayer();
      this.tileLayer.addTo( this.map );
    },

    // Initialize the draw control if the `Leaflet.draw` plugin was loaded.
    _initDrawControl: function () {
      // FIXME: Write some tests.
      var that = this;

      if ( L.Draw === null || !this.mapOptions.drawControl ) {
        // User don't want the editor or don't have the plugin loaded.
        return;
      }

      // Get the layers created by the user using `Leaflet.draw`.
      this.map.on( 'draw:created', function ( e ) {
        var geoJSON;
        var model;
        // Add layer to GeoJSON layer group.
        that._layer.addLayer( e.layer );
        // Convert layer to GeoJSON.
        geoJSON = layerToGeoJSON( e.layer, e.layerType );
        // Create the model instance.
        model = new that.collection.model( geoJSON );
        // Associate the layer with the model.
        e.layer.cid = model.cid;
        geoJSON.properties.cid = model.cid;
        // Handle layer events.
        layerOnEachFeature.apply( that, [ geoJSON, e.layer ] );
        that._updateLayerStyle( e.layer, model );
        // Add model to collection. This should be the last thing done.
        that.collection.add( model );
        that.map.fire.apply( that.map, ['layer_draw', [ {
                target: e.layer,
                type: 'draw'
            } ] ] );
      });


    },

    // Function that will be used to decide whether to show a feature or not.
    // Returns `true` to show or `false` to hide.
    //
    // The default implementation looks for `filter` option passed to
    // constructor, if none `filter` option was passed shows all models.
    // Override this to create a custom default filter.
    modelFilter: function ( model ) {
      if ( !model ) {
        return true;
      }
      if ( this.options.filter && _.isFunction( this.options.filter ) ) {
        return this.options.filter.apply( this, arguments );
      }
      // Don't allow duplicated points for the same model
      return !this._layers[model.cid];
    },

    // Function that will be used to get style options for vector layers
    // created for GeoJSON features.
    // Override this to change the layers style.
    layerStyle: function ( model ) {
      if ( !model ) {
        return this.defaultStyle;
      }
      if ( this.options.style ) {
        if ( _.isFunction( this.options.style ) ) {
          return this.options.style.apply( this, arguments );
        } else {
          return this.options.style;
        }
      }
      if ( model.getStyle && _.isFunction( model.getStyle ) ) {
        return model.getStyle();
      }
      return this.defaultStyle;
    },

    // Returns the Backbone Model associated to the Leaflet Feature received.
    _getModelByFeature: function ( feature ) {
      var models = _.where( this.collection.models,
                            {cid: feature.properties.cid} );
      return models[0];
    },

    // Returns the Leaflet Layer associated tp the Backbone Model received.
    _getLayerByModel: function ( model ) {
        return this._layers[model.cid];
    },

    // Ensure that the collection has a `GeoJSON` layer.
    _getLayer: function () {
      var methods, layerOptions;
      layerOptions = _.defaults( this.options.layer || {},
                                 this.defaultLayerOptions );
      methods = ['pointToLayer', 'filter', 'style', 'onEachFeature'];
      _.each( methods, function ( method ) {
        layerOptions[method] = _.bind( layerOptions[method], this );
      }, this );
      return new L.GeoJSON( null, layerOptions );
    },

    // Add to map the model added to collection
    _onReset: function () {
      this.redraw();
    },

    // Add to map the model added to collection
    _onAdd: function ( model ) {
      // Don't duplicate a layer already drawn.
      // This avoids duplication of layers drawn with `Leaflet.draw` plugin.
      if ( this._getLayerByModel( model ) ) {
        return;
      }
      this._layer.addData( model.toJSON({ cid: true }) );
    },

    // Remove from map the model removed from collection
    _onRemove: function ( model ) {
      var layer = this._layers[model.cid];
      if ( layer ) {
        this._layer.removeLayer( layer );
        this._layers[model.cid] = null;
      }
    },

    // Updates the map layer
    _onChange: function ( model ) {
      // FIXME: Write some tests.
      var newStyle;
      var layer = this._layers[model.cid];
      if ( model.hasChanged( 'geometry' ) ) {
        // The geometry has been changed so we need to create new layer
        this._onRemove( model );  // Removes the old layer
        this._onAdd( model );     // Creates new updated layer
      } else {
        this._updateLayerStyle( layer, model );
      }
    },

    // Updates the layer style using model data
    _updateLayerStyle: function ( layer, model ) {
      // FIXME: Write some tests.
      var newStyle = this.layerStyle( model );
      if ( layer.setStyle && _.isFunction( layer.setStyle ) ) {
        // We have a path layer
        layer.setStyle( newStyle );
      } else if ( ( layer.setIcon && _.isFunction( layer.setIcon ) ) &&
                  ( layer.setOpacity && _.isFunction( layer.setOpacity ) ) ) {
        // We have a marker
        if ( newStyle.icon ) {
          layer.setIcon( newStyle.icon );
        }
        if ( newStyle.opacity ) {
          layer.setOpacity( newStyle.opacity );
        }
      }
    }

  });
}( Backbone, _, L ));r

// -------------------------------------------------------------------------
// -------------------------------------------------------------------------

var geojsonFeatureCollection = {
  url: 'lib/battles.json',
  parse: function(response){
    return response.items;
  }
};

var geoCollection = new Backbone.Leaflet.GeoCollection( geojsonFeatureCollection )

// -------------------------------------------------------------------------
// -------------------------------------------------------------------------
var mapView = new Backbone.Leaflet.MapView({

  el: '#map',

  collection: geoCollection,  // See above how to create a `GeoCollection` instance.

});

var OutputView = Backbone.View.extend({
    template: _.template( $( '#container' ).html() ),
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

    // Creates new point when user click on map.
    onClick: function ( e ) {
      var lat = e.latlng.lat;
      var lng = e.latlng.lng;
      var n = this._n || 1;
      var geoJSON = {
        "type": "Feature",
        "geometry": { "type": "Point", "coordinates": [lng, lat] },
        "properties": { "name": "Unnamed Point " + n, "active": true }
      };
      this.collection.add( geoJSON );
      this._n = ++n;
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

geoCollection.reset( geojsonFeatureCollection );

