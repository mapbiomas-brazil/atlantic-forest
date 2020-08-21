
          
var regioes = ['reg_01','reg_02','reg_03','reg_04','reg_05','reg_06','reg_07','reg_08','reg_09',
               'reg_10','reg_11','reg_12','reg_13','reg_14','reg_15','reg_16','reg_17','reg_18',
               'reg_19','reg_20','reg_21','reg_22','reg_23','reg_24','reg_25','reg_26','reg_27',
               'reg_28','reg_29', 'reg_30']

var version = '1'
var bioma = "MATAATLANTICA"

var dirasset = 'projects/mapbiomas-workspace/MOSAICOS/workspace-c3';
var dirsamples = 'projects/mapbiomas-workspace/AMOSTRAS/col4/MATA_ATLANTICA/samples_MATAATLANTICA_'
var dirout = 'projects/mapbiomas-workspace/AMOSTRAS/col4/MATA_ATLANTICA/class_col4/'
var regioesCollection = ee.FeatureCollection('projects/mapbiomas-workspace/AUXILIAR/Mata_Atlantica_regions_col4')
var palettes = require('users/mapbiomas/modules:Palettes.js');

var ano = '2000';

var palettes = require('users/mapbiomas/modules:Palettes.js');
var vis = {
    'min': 0,
    'max': 34,
    'palette': palettes.get('classification2')
};

var pixelArea = ee.Image.pixelArea().divide(1000000);

var colecao41 = ee.Image('projects/mapbiomas-workspace/public/collection4_1/mapbiomas_collection41_integration_v1').select('classification_'+ano);
colecao41 = colecao41.select('classification_'+ano).remap(
                  [3, 4, 5, 9,12,13,15,18,19,20,21,22,23,24,25,26,29,30,31,32,33],
                  [3, 4, 3, 9,12,13,21,21,21,21,21,22,22,22,22,33,29,22,33,13,33])
                
Map.addLayer(colecao41, vis, 'colecao41 '+ano, false);


  var area03 = pixelArea.mask(colecao41.eq(3))
  var area04 = pixelArea.mask(colecao41.eq(4))
  var area12 = pixelArea.mask(colecao41.eq(12))
  var area13 = pixelArea.mask(colecao41.eq(13))
  var area21 = pixelArea.mask(colecao41.eq(21))
  var area22 = pixelArea.mask(colecao41.eq(22))
  var area29 = pixelArea.mask(colecao41.eq(29))
  var area33 = pixelArea.mask(colecao41.eq(33))

var processaReg = function(regiao) {
  regiao = regiao.set('floresta', ee.Number(area03.reduceRegion({reducer: ee.Reducer.sum(),geometry: regiao.geometry(), scale: 30,maxPixels: 1e13}).get('area')))
  regiao = regiao.set('savana', ee.Number(area04.reduceRegion({reducer: ee.Reducer.sum(),geometry: regiao.geometry(), scale: 30,maxPixels: 1e13}).get('area')))
  regiao = regiao.set('campo', ee.Number(area12.reduceRegion({reducer: ee.Reducer.sum(),geometry: regiao.geometry(), scale: 30,maxPixels: 1e13}).get('area')))
  regiao = regiao.set('outro', ee.Number(area13.reduceRegion({reducer: ee.Reducer.sum(),geometry: regiao.geometry(), scale: 30,maxPixels: 1e13}).get('area')))
  regiao = regiao.set('agro', ee.Number(area21.reduceRegion({reducer: ee.Reducer.sum(),geometry: regiao.geometry(), scale: 30,maxPixels: 1e13}).get('area')))
  regiao = regiao.set('nao_veg', ee.Number(area22.reduceRegion({reducer: ee.Reducer.sum(),geometry: regiao.geometry(), scale: 30,maxPixels: 1e13}).get('area')))
  regiao = regiao.set('aflora', ee.Number(area29.reduceRegion({reducer: ee.Reducer.sum(),geometry: regiao.geometry(), scale: 30,maxPixels: 1e13}).get('area')))
  regiao = regiao.set('agua', ee.Number(area33.reduceRegion({reducer: ee.Reducer.sum(),geometry: regiao.geometry(), scale: 30,maxPixels: 1e13}).get('area')))
  return regiao
}

var regiao2 = regioesCollection.map(processaReg)

Export.table.toAsset(regiao2, 'Mata_Atlantica_regions_col5_area2000', 'projects/mapbiomas-workspace/AUXILIAR/Mata_Atlantica_regions_col5_area2000')

var blank = ee.Image(0).mask(0);
var outline = blank.paint(regioesCollection, 'AA0000', 2); 
var visPar = {'palette':'000000','opacity': 0.6};
Map.addLayer(outline, visPar, 'Regiao', true);
