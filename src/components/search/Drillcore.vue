<template>
  <div id="search-component">

    <div class="row">
      <div class="col">
        <h2>Drillcore search</h2>
      </div>
    </div>


    <div class="row align-items-center">
      <div class="col-md-12 col-lg-6">

        <div class="form-group">
          <vue-multiselect
            v-model="searchParameters.drillcoreName.name"
            :options="drillcoreNames"
            placeholder="Drillcore Name"
            label="name"
            track-by="name" />
        </div>

        <div class="form-group">
          <vue-multiselect
            v-model="searchParameters.depositName.name"
            :options="depositNames"
            placeholder="Deposit Name"
            label="deposit__name"
            track-by="deposit__name" />
        </div>

        <div class="form-group">
          <vue-multiselect
            v-model="searchParameters.oreType.name"
            :options="oreTypes"
            placeholder="Ore type"
            label="deposit__genetic_type__name"
            track-by="deposit__genetic_type__name" />
        </div>

        <div class="form-group">
          <vue-multiselect
            v-model="searchParameters.commodity.name"
            :options="commodities"
            placeholder="Main commodity"
            label="deposit__main_commodity"
            track-by="deposit__main_commodity" />
        </div>

        <div class="form-group">
          <vue-multiselect
            v-model="searchParameters.coreDepositor.name"
            :options="coreDepositors"
            placeholder="Core depositor"
            track-by="core_depositor__acronym"
            :custom-label="customLabelForCoreDepositors" />
        </div>

        <div class="searchButtons row">
          <span class="mr-2 mb-2">
            <button class="btn btn-primary" title="Sends request with inserted data" @click="searchEntities(searchParameters)">SEARCH DRILLCORES</button>
          </span>

          <span class="mr-2 mb-2">
            <button class="btn btn-danger" title="Clears search fields" @click="resetSearchParameters()">RESET FORM</button>
          </span>
        </div>
      </div>


      <div class="col-md-12 col-lg-6">
        <!--<drillcore-map v-if="mapResponse.count > 0 && response.count > 0" :results="mapResponse.results" :currentResults="response.results"></drillcore-map>-->
        <div id="map" class="map"></div>
      </div>
    </div>


    <div class="row mt-3">
      <div class="col">
        <p v-if="response.results != ''">Found <b>{{response.count}}</b> result(s). </p>
        <p v-else>No results found. Please try again. </p>
      </div>
    </div>


    <div class="row" v-if="response.count > 0">
      <div class="col-xs-1 pl-3 pr-3">
        <b-form-select v-model="searchParameters.paginateBy" :options="paginationOptions" class="mb-3"></b-form-select>
      </div>

      <div class="col mb-3">
        <b-dropdown text="EXPORT" variant="primary">
          <b-dropdown-item>
            <export-button
              :data="response.results"
              :fields="exportFields"
              name="drillcoreSearch.xls">Export to XLS</export-button>
          </b-dropdown-item>
          <b-dropdown-item>
            <export-button
              :data="response.results"
              :fields="exportFields"
              type="csv"
              name="drillcoreSearch.csv">Export to CSV</export-button>
          </b-dropdown-item>
        </b-dropdown>
      </div>

      <div class="col">
        <b-pagination
          size="md" align="right" :limit="5" :total-rows="response.count" v-model="searchParameters.page" :per-page="searchParameters.paginateBy">
        </b-pagination>
      </div>
    </div>


    <div v-if="response.count > 0" class="row">
      <div class="col">
          <div class="table-responsive">
            <table class="table table-hover table-bordered ">
              <thead class="thead-light">
                <tr class="th-sort">
                  <th><span v-b-tooltip.hover.bottom title="Order by ID" @click="changeOrder('id')">ID</span></th>
                  <th><span v-b-tooltip.hover.bottom title="Order by Name" @click="changeOrder('name')">Name</span></th>
                  <th><span v-b-tooltip.hover.bottom title="Order by Deposit" @click="changeOrder('deposit__name')">Deposit</span></th>
                  <th><span v-b-tooltip.hover.bottom title="Order by Commodity" @click="changeOrder('deposit__main_commodity')">Commodity</span></th>
                  <th><span v-b-tooltip.hover.bottom title="Order by Latitude" @click="changeOrder('latitude')">Latitude</span></th>
                  <th><span v-b-tooltip.hover.bottom title="Order by Longitude" @click="changeOrder('longitude')">Longitude</span></th>
                  <th><span v-b-tooltip.hover.bottom title="Order by Length" @click="changeOrder('hole_length')">Length</span></th>
                  <th><span v-b-tooltip.hover.bottom title="Order by Dip" @click="changeOrder('hole_dip')">Dip</span></th>
                  <th><span v-b-tooltip.hover.bottom title="Order by Azimuth" @click="changeOrder('hole_azimuth')">Azimuth</span></th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="drillcore in response.results">
                  <td>{{drillcore.id}}</td>
                  <td>
                    <router-link :to="{ path: '/drillcore/' + drillcore.id }">{{drillcore.name}}</router-link>
                  </td>
                  <td>
                    <router-link :to="{ path: '/deposit/' + drillcore.deposit__id }">{{drillcore.deposit__name}}</router-link>
                  </td>
                  <td>{{drillcore.deposit__main_commodity}}</td>
                  <td>{{drillcore.latitude}}</td>
                  <td>{{drillcore.longitude}}</td>
                  <td>{{drillcore.hole_length}}</td>
                  <td>{{drillcore.hole_dip}}</td>
                  <td>{{drillcore.hole_azimuth}}</td>
                  <td>
                    <router-link :to="{ path: '/drillcore_data/' + drillcore.id }">Show data</router-link>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
    </div>

    <div class="row mt-3" v-if="response.count > 0">
      <div class="col-xs-1 pl-3 pr-3 mb-3">
        <b-form-select v-model="searchParameters.paginateBy" :options="paginationOptions"></b-form-select>
      </div>

      <div class="col mb-3">
        <b-pagination
          size="md" align="right" :limit="5" :total-rows="response.count" v-model="searchParameters.page" :per-page="searchParameters.paginateBy">
        </b-pagination>
      </div>
    </div>

  </div>
</template>

<script>
  import VueMultiselect from "vue-multiselect/src/Multiselect";
  import ExportButton from 'vue-json-excel';
  // import DrillcoreMap from "../main/partial/DrillcoreMap";

  /* MAP IMPORTS START */
  import LayerSwitcher from 'ol-layerswitcher/dist/ol-layerswitcher'

  import Map from 'ol/map';
  import SourceVector from 'ol/source/vector';
  import LayerVector from 'ol/layer/vector';
  import Select from 'ol/interaction/select';
  import SourceXYZ from 'ol/source/xyz';
  import Feature from 'ol/feature';
  import GeomPoint from 'ol/geom/point';
  import Style from 'ol/style/style';
  import Circle from 'ol/style/circle';
  import Fill from 'ol/style/fill';
  import Stroke from 'ol/style/stroke';
  import Text from 'ol/style/text';
  import Condition from 'ol/events/condition';
  import DragBoxInteraction from 'ol/interaction/dragbox';
  import View from 'ol/view';
  import Proj from 'ol/proj';
  import LayerGroup from 'ol/layer/group';
  import LayerTile from 'ol/layer/tile';
  import SourceOSM from 'ol/source/osm';
  import SourceStamen from 'ol/source/stamen';
  import TileWMS from "ol/source/tilewms";
  import 'ol/ol.css'
  import 'ol-layerswitcher/src/ol-layerswitcher.css'
  /* MAP IMPORTS END */

  export default {
    components: {
      // DrillcoreMap,
      VueMultiselect,
      ExportButton
    },
    name: "drillcore",
    data() {
      return {
        API_URL: 'https://api.eurocore.rocks/',
        searchParameters: {
          drillcoreName: { name: '', field: 'name' },
          depositName: { name: '', field: 'deposit__name' },
          oreType: { name: '', field: 'deposit__genetic_type__name', },
          commodity: { name: '', field: 'deposit__main_commodity' },
          coreDepositor: { name: '', field: 'core_depositor__acronym' },
          page: 1,
          paginateBy: 25,
          orderBy: 'id'
        },
        response: {
          count: 0,
          results: []
        },
        drillcoreIdsFromMap: null,
        map: undefined,
        vectorSource: new SourceVector(),
        allVectors: new SourceVector(),
        mapResponse: {
          count: 0,
          results: []
        },
        drillcoreNames: [],
        depositNames: [],
        oreTypes: [],
        commodities: [],
        coreDepositors: [],
        isError: false,
        paginationOptions: [
          { value: 10, text: 'Show 10 results per page' },
          { value: 25, text: 'Show 25 results per page' },
          { value: 50, text: 'Show 50 results per page' },
          { value: 100, text: 'Show 100 results per page' },
          { value: 250, text: 'Show 250 results per page' },
          { value: 500, text: 'Show 500 results per page' },
          { value: 1000, text: 'Show 1000 results per page' }
        ],
        exportFields: {
          'ID': 'id',
          'Name': 'name',
          'Deposit': 'deposit__name',
          'Commodity': 'deposit__main_commodity',
          'Latitude': 'latitude',
          'Longitude': 'longitude',
          'length': 'hole_length',
          'Dip': 'hole_dip',
          'Azimuth': 'hole_azimuth',
        },
      }
    },
    metaInfo: {
      title: 'EUROCORE Data Portal: Drillcores'
    },
    watch: {
      // TODO: Got to test it performance wise, maybe dependent search isnt necessary here
      'searchParameters': {
        handler: function () {
          this.searchEntitiesAndPopulate(this.searchParameters, this.drillcoreIdsFromMap)
        },
        deep: true
      },
      'drillcoreIdsFromMap': function (newVal, oldVal) {
        console.log('New: ' + newVal + ' Old: ' + oldVal);
        if (newVal != null) {
          if (newVal.length > 0) {
            this.searchEntitiesUsingMap(this.drillcoreIdsFromMap);
          }
        }
      },
      'mapResponse.results': function () {
        // this.initMap();
        this.addAllPoints(this.mapResponse.results);
      }
    },
    created: function () {
      // TODO: Params should come from URL if exists
      // TODO: PARAMS sequnece from top priority URL -> SESSION -> INPUT FIELDS
      if (this.$session.exists() && this.$session.get('drillcore') != null) {
        this.searchParameters = this.$session.get('drillcore');
      } else {
        this.searchEntitiesAndPopulate(this.searchParameters);
      }
      this.getMapData();
    },
    mounted: function () {
      this.initMap();
    },
    beforeDestroy: function () {
      this.$session.set('drillcore', this.searchParameters);
    },
    methods: {

      searchEntitiesAndPopulate(params, drillcoreIds) {
        if (drillcoreIds != null && params.drillcoreName.name === '' && params.depositName.name === '' && params.oreType.name === '' && params.commodity.name === '' && params.coreDepositor.name === '') {
          this.searchEntitiesUsingMap(drillcoreIds)
        } else {
          this.searchEntities(params);
          this.populateDrillcoreNames(params);
          this.populateDepositNames(params);
          this.populateOreTypes(params);
          this.populateCommodities(params);
          this.populateCoreDepositors(params);
        }
      },

      searchEntitiesUsingMap(drillcoreIds) {
        drillcoreIds += '';
        let ids = 'id=';
        if (drillcoreIds.includes(',')) {
          ids = 'id__in=';
        }
        console.log(drillcoreIds);
        this.$http.jsonp(this.API_URL + 'drillcore/?' + ids + drillcoreIds, {params: {format: 'jsonp', page: this.searchParameters.page, paginate_by: this.searchParameters.paginateBy, order_by: this.searchParameters.orderBy}}).then(response => {
          console.log(response);
          if (response.status === 200) {
            this.response.count = response.body.count;
            this.response.results = response.body.results;
          }
        }, errResponse => {
          console.log('ERROR: ');
          console.log(errResponse);
          this.isError = true;
        })
      },

      searchEntities(searchParameters) {
        console.log(searchParameters);
        let url = this.buildSearchUrl(searchParameters);
        console.log(url);

        this.$http.jsonp(url, {params: {format: 'jsonp', page: searchParameters.page, paginate_by: searchParameters.paginateBy, order_by: searchParameters.orderBy}}).then(response => {
          console.log(response);
          if (response.status === 200) {
            this.response.count = response.body.count;
            this.response.results = response.body.results;
          }
        }, errResponse => {
          console.log('ERROR: ');
          console.log(errResponse);
          this.isError = true;
        })

      },

      buildSearchUrl(params) {
        let url = this.API_URL + 'drillcore/?';

        Object.keys(params).forEach(function (key) {
          // console.log(key + ' ' + params[key]);

          if (typeof(params[key]) === 'object') {

            if (params[key].name !== '' && params[key].name != null) {
              // console.log(params[key].field + '=' + params[key].name[params[key].field]); deposit__name=Kevitsa
              url += params[key].field + '=' + params[key].name[params[key].field] + '&'
            }
          }

        });

        if (url.slice(-1) === '?' || url.slice(-1) === '&') {
          url = url.slice(0, -1);
        }
        return url;
      },


      /***************************************
       ***** MULTISELECT POPULATE START ******
       ***************************************/
      populateDrillcoreNames(params) {
        let url = this.buildSearchUrl(params);
        console.log(url);
        this.$http.jsonp(url, {params: {distinct: 'true', format: 'jsonp', fields: 'name'}}).then(response => {
          console.log(response);
          if (response.status === 200) {
            this.drillcoreNames = response.body.results;
          }
        }, errResponse => {
          console.log('*** ERROR ***');
          console.log(errResponse);
        })
      },

      populateDepositNames(params) {
        let url = this.buildSearchUrl(params);
        console.log(url);
        this.$http.jsonp(url, {params: {deposit__name__isnull: 'false', distinct: 'true', format: 'jsonp', fields: 'deposit__name'}}).then(response => {
          console.log(response);
          if (response.status === 200) {
            this.depositNames = response.body.results;
          }
        }, errResponse => {
          console.log('*** ERROR ***');
          console.log(errResponse);
        })
      },

      populateOreTypes(params) {
        let url = this.buildSearchUrl(params);
        console.log(url);
        this.$http.jsonp(url, {params: {deposit__genetic_type__name__isnull: 'false', distinct: 'true', format: 'jsonp', fields: 'deposit__genetic_type__name'}}).then(response => {
          console.log(response);
          if (response.status === 200) {
            this.oreTypes = response.body.results;
          }
        }, errResponse => {
          console.log('*** ERROR ***');
          console.log(errResponse);
        })
      },

      populateCommodities(params) {
        let url = this.buildSearchUrl(params);
        console.log(url);
        this.$http.jsonp(url, {params: {deposit__main_commodity__isnull: 'false', distinct: 'true', format: 'jsonp', fields: 'deposit__main_commodity'}}).then(response => {
          console.log(response);
          if (response.status === 200) {
            this.commodities = response.body.results;
          }
        }, errResponse => {
          console.log('*** ERROR ***');
          console.log(errResponse);
        })
      },

      populateCoreDepositors(params) {
        let url = this.buildSearchUrl(params);
        console.log(url);
        this.$http.jsonp(url, {params: {distinct: 'true', format: 'jsonp', fields: 'core_depositor__name,core_depositor__acronym'}}).then(response => {
          console.log(response);
          if (response.status === 200) {
            this.coreDepositors = response.body.results;
          }
        }, errResponse => {
          console.log('*** ERROR ***');
          console.log(errResponse);
        })
      },
      /***************************************
       *****  MULTISELECT POPULATE END  ******
       ***************************************/


      customLabelForCoreDepositors(option) {
        return `${option.core_depositor__acronym} - ${option.core_depositor__name}`
      },

      // TODO: Maybe order should be object like sortField: { order: 'fields', direction: 'ASC' }
      changeOrder(orderValue) {
        if (this.searchParameters.orderBy === orderValue) {
          if (orderValue.charAt(0) !== '-') {
            orderValue = '-' + orderValue;
          } else {
            orderValue = orderValue.substring(1);
          }
        }
        this.searchParameters.orderBy = orderValue;
      },

      resetSearchParameters() {
        console.log("BEFORE");
        console.log(this.searchParameters);
        this.searchParameters =
          {
            drillcoreName: { name: '', field: 'name' },
            depositName: { name: '', field: 'deposit__name' },
            oreType: { name: '', field: 'deposit__genetic_type__name', },
            commodity: { name: '', field: 'deposit__main_commodity' },
            coreDepositor: { name: '', field: 'core_depositor__acronym' },
            page: 1,
            paginateBy: 25,
            orderBy: 'id'
          };
        this.drillcoreIdsFromMap = null;
        this.$session.remove('drillcore');
        console.log("AFTER");
        console.log(this.searchParameters);
      },


      /*****************************
       *****  MAP CODE START  ******
       *****************************/
      getMapData() {
        this.$http.jsonp(this.API_URL + 'drillcore/', {params: {format: 'jsonp', paginate_by: 1000, fields: 'id,name,longitude,latitude'}}).then(response => {
          console.log(response);
          if (response.status === 200) {
            this.mapResponse.count = response.body.count;
            this.mapResponse.results = response.body.results;
          }
        }, errResponse => {
          console.log('ERROR: ');
          console.log(errResponse);
        })
      },

      initMap() {
        const vectorLayer = new LayerVector({
          source: this.vectorSource,
          zIndex: 100
        });

        const allVectorsLayer = new LayerVector({
          source: this.allVectors,
          zIndex: 100
        });

        const basemaps = new LayerGroup({
          title: 'Base maps',
          layers: [
            new LayerTile({
              title: 'Stamen dark',
              type: 'base',
              visible: false,
              source: new SourceStamen({
                layer: 'toner'
              })
            }),
            new LayerTile({
              title: 'Stamen terrain',
              type: 'base',
              group: 'group-name',
              visible: false,
              source: new SourceStamen({
                layer: 'terrain'
              })
            }),
            new LayerTile({
              title: 'OpenStreetMap',
              type: 'base',
              visible: false,
              source: new SourceOSM()
            }),
            new LayerTile({
              title: 'MapBox grayscale',
              type: 'base',
              visible: true,
              source: new SourceXYZ({
                url: 'https://api.tiles.mapbox.com/v4/mapbox.light/{z}/{x}/{y}.png?access_token=pk.eyJ1Ijoia3V1dG9iaW5lIiwiYSI6ImNpZWlxdXAzcjAwM2Nzd204enJvN2NieXYifQ.tp6-mmPsr95hfIWu3ASz2w'
              })
            })
          ]
        });

        const overlays = new LayerGroup({
          title: 'Overlays',
          layers: [
            new LayerTile({
              /* extent: [-13884991, 2870341, -7455066, 6338219],*/
              title: 'Bedrock age <br /><img src="http://gis.geokogud.info/geoserver/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=IGME5000:EuroGeology&legend_options=fontName:DejaVu%20Sans%20ExtraLight;fontAntiAliasing:true;fontColor:0x333333;fontSize:10;bgColor:0xFFFFff;dpi:96" /> ',
              visible: true,
              source: new TileWMS({
                url: 'http://gis.geokogud.info/geoserver/wms',
                params: { 'LAYERS': 'IGME5000:EuroGeology', 'TILED': true },
                serverType: 'geoserver',
                // Countries have transparency, so do not fade tiles:
                // transition: 0,
                projection: ''
              }),
              opacity: 0.5,
            })
          ]
        });

        this.map = new Map({
          target: 'map',
          layers: [basemaps, overlays, allVectorsLayer],
          view: new View({
            center: Proj.fromLonLat([25, 64]),
            zoom: 4
          })
        });

        this.map.addLayer(vectorLayer);
        this.map.addControl(new LayerSwitcher());
        console.log(this.mapResponse.results);
        // this.addAllPoints(this.mapResponse.results);
        this.addPointerMoveInteraction();
        this.addSelectInteraction(this);
      },

      addPointerMoveInteraction() {
        let selectPointerMove = new Select({
          condition: Condition.pointerMove
        });
        this.map.addInteraction(selectPointerMove);

        selectPointerMove.on('select', function (e) {
          if (e.selected.length != 0) {
            e.selected[0].getStyle().getText().setScale(1.4);
          }
          if (e.deselected.length != 0) {
            e.deselected[0].getStyle().getText().setScale(0)
          }
        });
      },

      addSelectInteraction(myComponent) {
        let select = new Select({
          multi: true,
        });
        this.select = select;
        let selectedFeatures = this.select.getFeatures();

        let allDrillcores = myComponent.allVectors;
        let allFeatures = allDrillcores.getFeatures();

        this.map.addInteraction(this.select);

        /*** ONE CLICK SELECT ***/
        this.select.on("select", function () {

          // STYLES ALL POINTS TO GREEN BEFORE NEW SELECT
          allDrillcores.getFeatures().forEach(function (feature) {
            feature.setStyle(new Style({
              image: new Circle({
                radius: 7,
                fill: new Fill({ color: '#6BB745' }),
                stroke: new Stroke({
                  color: 'black',
                  width: 1
                })
              }),
              zIndex: 100,
              text: new Text({
                scale: 0,
                text: feature.get('name'),
                offsetY: -25,
                fill: new Fill({
                  color: 'black'
                }),
                stroke: new Stroke({
                  color: 'white',
                  width: 3.5
                })
              })
            }));
          });

          let drillcoreIds = [];

          selectedFeatures.getArray().map(function (feature) {
            drillcoreIds.push(feature.getId().toString());
            feature.setStyle(new Style({
              image: new Circle({
                radius: 7,
                fill: new Fill({ color: '#CD154F' }),
                stroke: new Stroke({
                  color: 'black',
                  width: 1
                })
              }),
              zIndex: 100,
              text: new Text({
                scale: 0,
                text: feature.get('name'),
                offsetY: -25,
                fill: new Fill({
                  color: 'black'
                }),
                stroke: new Stroke({
                  color: 'white',
                  width: 3.5
                })
              })
            }))
          });

          myComponent.drillcoreIdsFromMap = drillcoreIds
        });

        let dragBox = new DragBoxInteraction();
        this.map.addInteraction(dragBox);

        /*** DRAGBOX SELECT ***/
        dragBox.on('boxend', function () {

          // STYLES ALL POINTS TO GREEN BEFORE NEW SELECT
          allDrillcores.getFeatures().forEach(function (feature) {
            feature.setStyle(new Style({
              image: new Circle({
                radius: 7,
                fill: new Fill({ color: '#6BB745' }),
                stroke: new Stroke({
                  color: 'black',
                  width: 1
                })
              }),
              zIndex: 100,
              text: new Text({
                scale: 0,
                text: feature.get('name'),
                offsetY: -25,
                fill: new Fill({
                  color: 'black'
                }),
                stroke: new Stroke({
                  color: 'white',
                  width: 3.5
                })
              })
            }));
          });

          let drillcoreIds = [];

          selectedFeatures.clear();
          let extent = dragBox.getGeometry().getExtent();
          allDrillcores.forEachFeatureIntersectingExtent(extent, function (feature) {
            selectedFeatures.push(feature);
            drillcoreIds.push(feature.getId().toString());
            feature.setStyle(new Style({
              image: new Circle({
                radius: 7,
                fill: new Fill({ color: '#CD154F' }),
                stroke: new Stroke({
                  color: 'black',
                  width: 1
                })
              }),
              zIndex: 100,
              text: new Text({
                scale: 0,
                text: feature.get('name'),
                offsetY: -25,
                fill: new Fill({
                  color: 'black'
                }),
                stroke: new Stroke({
                  color: 'white',
                  width: 3.5
                })
              })
            }))
          });

          myComponent.drillcoreIdsFromMap = drillcoreIds
        });
      },

      addAllPoints(results) {
        console.log(results);
        for (const entity in results) {
          if (results[entity].longitude !== undefined) {
            let point = new Feature({
              name: results[entity].name,
              id: results[entity].id,
              geometry: new GeomPoint(Proj.fromLonLat([results[entity].longitude, results[entity].latitude]))
            });
            point.setId(results[entity].id);
            point.setStyle(new Style({
              image: new Circle({
                radius: 7,
                fill: new Fill({ color: '#6BB745' }),
                stroke: new Stroke({
                  color: 'black',
                  width: 1
                })
              }),
              zIndex: 100,
              text: new Text({
                scale: 0,
                text: results[entity].name,
                offsetY: -25,
                fill: new Fill({
                  color: 'black'
                }),
                stroke: new Stroke({
                  color: 'white',
                  width: 3.5
                })
              })

            }));
            this.allVectors.addFeature(point);
          }
        }
      },
      /*****************************
       *****   MAP CODE END   ******
       *****************************/
    }
  }
</script>

<style scoped>
  .searchButtons {
    margin: 0.75rem 0;
  }

  .th-sort > th > span {
    cursor: pointer;
  }

  .th-sort > th > span:hover {
    color: #000;
    /*opacity: 0.6;*/
  }

  .sortingHead {
    color: #004393!important;
  }

  .map {
    height: 400px;
    min-width: 300px;
    width: 100%;
  }
</style>
