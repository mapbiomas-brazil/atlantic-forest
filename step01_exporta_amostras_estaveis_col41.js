var geometry = /* color: #d63000 */ee.Geometry.Polygon(
        [[[-50.62140592730848, -30.83601334517784],
          [-41.12921842730848, -23.573842111091267],
          [-33.30695280230848, -8.504738362194722],
          [-35.24054655230848, -4.0503429525835255],
          [-56.24640592730848, -21.463075279113696],
          [-56.77374967730848, -29.92617101510622]]]);

var bimoa250mil = ee.FeatureCollection('projects/mapbiomas-workspace/AUXILIAR/biomas_IBGE_250mil')
// print(bimoa250mil)
var blank = ee.Image(0).mask(0);
var outline = blank.paint(bimoa250mil, 'AA0000', 2); 
var visPar = {'palette':'000000','opacity': 0.6};
Map.addLayer(outline, visPar, 'bimoa250mil', false);

var year = 2017
var palettes = require('users/mapbiomas/modules:Palettes.js');
var vis = {
    'bands': ['classification_' + String(year)],
    'min': 0,
    'max': 34,
    'palette': palettes.get('classification2')
};

var assetMosaics = 'projects/mapbiomas-workspace/MOSAICOS/workspace-c3';
var assetBiomes = 'projects/mapbiomas-workspace/AUXILIAR/biomas-raster';
var dirout = 'projects/mapbiomas-workspace/AMOSTRAS/col5/MATA_ATLANTICA/'
var biomes = ee.Image(assetBiomes);
var version_out = '1'

var colecao41 = ee.Image('projects/mapbiomas-workspace/public/collection4_1/mapbiomas_collection41_integration_v1');
Map.addLayer(colecao41, vis, 'Classes ORIGINAIS 85 a 18', true);

var colList = ee.List([])
var col41remap = colecao41.select('classification_1985').remap(
                  [3, 4, 5, 9,12,13,15,18,19,20,21,22,23,24,25,26,29,30,31,32,33],
                  [3, 4, 3, 9,12,13,21,21,21,21,21,22,22,22,22,33,29,22,33,13,33])

colList = colList.add(col41remap.int8())

var anos = ['1985','1986','1987','1988','1989','1990','1991','1992','1993','1994','1995','1996','1997','1998','1999','2000','2001','2002','2003','2004','2005','2006','2007','2008','2009','2010','2011','2012','2013','2014','2015','2016','2017','2018'];
for (var i_ano=0;i_ano<anos.length; i_ano++){
  var ano = anos[i_ano];

  var col4flor = colecao41.select('classification_'+ano).remap(
                  [3, 4, 5, 9,12,13,15,18,19,20,21,22,23,24,25,26,29,30,31,32,33],
                  [3, 4, 3, 9,12,13,21,21,21,21,21,22,22,22,22,33,29,22,33,13,33])

  colList = colList.add(col4flor.int8())
};

var collection = ee.ImageCollection(colList)

var unique = function(arr) {
    var u = {},
        a = [];
    for (var i = 0, l = arr.length; i < l; ++i) {
        if (!u.hasOwnProperty(arr[i])) {
            a.push(arr[i]);
            u[arr[i]] = 1;
        }
    }
    return a;
};

var getFrenquencyMask = function(collection, classId) {

    var classIdInt = parseInt(classId, 10);

    var maskCollection = collection.map(function(image) {
        return image.eq(classIdInt);
    });

    var frequency = maskCollection.reduce(ee.Reducer.sum());

    var frequencyMask = frequency.gte(classFrequency[classId])
        .multiply(classIdInt)
        .toByte();

    frequencyMask = frequencyMask.mask(frequencyMask.eq(classIdInt));

    return frequencyMask.rename('frequency').set('class_id', classId);
};
///////////////////////////
//FUNCTION: LOOP for each carta

var lista_image = ee.List([]);

var classFrequency = {"3": 34, "4": 34, "9": 34, "12": 34,"13": 34, "21": 34, "22": 34, "29": 34, "33": 34}
  
var frequencyMasks = Object.keys(classFrequency).map(function(classId) {
    return getFrenquencyMask(collection, classId);
});

frequencyMasks = ee.ImageCollection.fromImages(frequencyMasks);

var referenceMap = frequencyMasks.reduce(ee.Reducer.firstNonNull()).clip(limite_MA2);

referenceMap = referenceMap.mask(referenceMap.neq(27)).rename("reference");

var vis = {
    'bands': ['reference'],
    'min': 0,
    'max': 34,
    'palette': palettes.get('classification2')
};

Map.addLayer(referenceMap.clip(bimoa250mil), vis, 'Classes persistentes 85 a 18', true);

Export.image.toAsset({
    "image": referenceMap.toInt8(),
    "description": 'MA_amostras_estaveis85a18_col41_v'+version_out,
    "assetId": dirout + 'MA_amostras_estaveis85a18_col41_v'+version_out,
    "scale": 30,
    "pyramidingPolicy": {
        '.default': 'mode'
    },
    "maxPixels": 1e13,
    "region": geometry
});  

