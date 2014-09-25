$(function () {
	var attribution = new ol.Attribution({
    	html: 'Tiles &copy; <a href="http://services.arcgisonline.com/ArcGIS/' + 'rest/services/World_Topo_Map/MapServer">ArcGIS</a>'
	});

	var layers = [
	    new ol.layer.Tile({
            source: new ol.source.XYZ({
                attributions: [attribution],
                url: 'http://server.arcgisonline.com/ArcGIS/rest/services/' + 'World_Topo_Map/MapServer/tile/{z}/{y}/{x}'
            })
        }),
	    new ol.layer.Tile({
	        opacity: 0.4,
	        extent: [-13884991, 2870341, -7455066, 6338219],
	        source: new ol.source.TileWMS(({
	            url: 'http://floodwatch.houstontranstar.org/geoserver/cite/wms',
	            params: {
	                'LAYERS': 'cite:lidar_wsg841',
	                'TILED': true,
	                'SLD_BODY':getSLD('cite:lidar_wsg841',50),
	                'SERVICE':'WMS',
					'VERSION':'1.1.1'
	            },
	            serverType: 'geoserver'
	        }))
	    })
	];
	var map = new ol.Map({
	    layers: layers,
	    target: 'map',
	    view: new ol.View({
	        center: [-10615581.374661,3470956.219627],
	        zoom: 10
	    })
	});
});

function getSLD() {
   var sld = '<StyledLayerDescriptor version="1.0.0" xmlns="http://www.opengis.net/sld" xmlns:ogc="http://www.opengis.net/ogc" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.opengis.net/sld StyledLayerDescriptor.xsd">'+
   	'<NamedLayer>'+
   		'<Name>cite:lidar_wsg841</Name>'+
   		'<UserStyle>'+
   			'<Title>SLD Cook Book: Many color gradient</Title>'+
   			'<FeatureTypeStyle>'+
   				'<Rule>'+
   					'<RasterSymbolizer>'+
   						'<ColorMap type="intervals">'+
   							'<ColorMapEntry color="#EEBE2F" quantity="-50" opacity="0"/>'+
   							'<ColorMapEntry color="#0066FF" quantity="0" opacity="1"/>'+
   							'<ColorMapEntry color="#0066FF" quantity="20" opacity="1" />'+
   							'<ColorMapEntry color="#FFFFFF" quantity="100" opacity="0" />'+

   						'</ColorMap>'+
   					'</RasterSymbolizer>'+
   				'</Rule>'+
   			'</FeatureTypeStyle>'+
   		'</UserStyle>'+
   	'</NamedLayer>'+
   '</StyledLayerDescriptor>';

   return sld;
}
