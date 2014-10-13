$(function () {
	var attribution = new ol.Attribution({
    	html: 'Tiles &copy; <a href="http://services.arcgisonline.com/ArcGIS/' + 'rest/services/World_Topo_Map/MapServer">ArcGIS</a>'
	});

	var wmsSource = new ol.source.ImageWMS(({
	            url: 'http://floodwatch.houstontranstar.org/geoserver/cite/wms',
	            params: {
	                'LAYERS': 'cite:lidar_wsg841',
	                'TILED': true,
	                'SLD_BODY':renderStyle(50),
	                'SERVICE':'WMS',
					'VERSION':'1.1.1',
					'FORMAT':'image/png8'
	            }, 	
	            serverType: 'geoserver'
	        }));
	
	var water = new ol.layer.Image({
	        opacity: 0.4,
	        //extent: [-13884991, 2870341, -7455066, 6338219],
	        source: wmsSource
	    });

	var basemap = new ol.layer.Tile({
            source: new ol.source.XYZ({
                attributions: [attribution],
                url: 'http://server.arcgisonline.com/ArcGIS/rest/services/' + 'World_Topo_Map/MapServer/tile/{z}/{y}/{x}'
            })
        });

	//Clipping code
	
	// The clipping geometry.
    var circleGeometry = new ol.geom.Circle(
        ol.proj.transform([-95.39724, 29.77517], 'EPSG:4326', 'EPSG:3857'),
        1000);
    
    var waterExtent = circleGeometry.getExtent();

    // A style for the geometry.
    var fillStyle = new ol.style.Fill({color: [0, 0, 0, 0]});
    var strokeStyle = new ol.style.Stroke({color: '#777777',lineDash:[10,20], width:3});

    water.setExtent(waterExtent);

    water.on('precompose', function(event) {
      var ctx = event.context;
      var vecCtx = event.vectorContext;

      ctx.save();

      // Using a style is a hack to workaround a limitation in
      // OpenLayers 3, where a geometry will not be draw if no
      // style has been provided.
      vecCtx.setFillStrokeStyle(fillStyle, strokeStyle);
      vecCtx.drawCircleGeometry(circleGeometry);

      ctx.clip();
    });

    water.on('postcompose', function(event) {
      var ctx = event.context;
      ctx.restore();
    });

    // Finally set the map up
    
	/*var map = */ new ol.Map({
	    layers: [basemap,water],
	    target: 'map',
	    view: new ol.View({
	        center: ol.proj.transform([-95.39724, 29.77517], 'EPSG:4326', 'EPSG:3857'),
	        zoom: 15
	    })
	});


	// UI controls
	$('#waterlevel').on('change', function() {
	    $('#currentLevel').html($(this).val() + ' ft');
	    wmsSource.updateParams({
	    	'SLD_BODY':renderStyle($(this).val())
	    });
	});

});

function renderStyle(waterLevel) {
   var sld = '<StyledLayerDescriptor version="1.0.0" xmlns="http://www.opengis.net/sld" xmlns:ogc="http://www.opengis.net/ogc" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.opengis.net/sld StyledLayerDescriptor.xsd">'+
   	'<NamedLayer>'+
   		'<Name>cite:lidar_wsg841</Name>'+
   		'<UserStyle>'+
   			'<Title>SLD Cook Book: Many color gradient</Title>'+
   			'<FeatureTypeStyle>'+
   				'<Rule>'+
   					'<RasterSymbolizer>'+
   						'<ColorMap type="intervals">'+
   							
   							// for ramped color rendndering.. also change color intervals type to 'ramp'
							// '<ColorMapEntry color="#EEBE2F" quantity="-50" opacity="0"/>'+
   							// '<ColorMapEntry color="#0066FF" quantity="0" opacity="1"/>'+
   							// '<ColorMapEntry color="#A5ECEF" quantity="'+waterLevel+'" opacity="0" />'+
   							
   							// for solid color rendndering.. also change color ramp type to 'intervals'
							'<ColorMapEntry color="#EEBE2F" quantity="-50" opacity="0"/>'+
   							'<ColorMapEntry color="#0066FF" quantity="0" opacity="1"/>'+
   							'<ColorMapEntry color="#0066FF" quantity="'+waterLevel+'" opacity="1" />'+

   						'</ColorMap>'+
   					'</RasterSymbolizer>'+
   				'</Rule>'+
   			'</FeatureTypeStyle>'+
   		'</UserStyle>'+
   	'</NamedLayer>'+
   '</StyledLayerDescriptor>';

   return sld;
}
