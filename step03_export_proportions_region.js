////////////////////////////////////////////////////////
//////////////User parameters//////////////////////////

var bioma = "MATAATLANTICA";
var versao = '1'
var sampleSize = 7000;
var nSamplesMin = 700

var dirsamples = ee.Image('projects/mapbiomas-workspace/AMOSTRAS/col5/MATA_ATLANTICA/MA_amostras_estaveis85a18_col41_v1');
var dirout = 'projects/mapbiomas-workspace/AMOSTRAS/col5/MATA_ATLANTICA';
var regioesCollection = ee.FeatureCollection('projects/mapbiomas-workspace/AUXILIAR/Mata_Atlantica_regions_col5_area2000')


var palettes = require('users/mapbiomas/modules:Palettes.js');

var vis = {
    'bands': ['reference'],
    'min': 0,
    'max': 34,
    'palette': palettes.get('classification2')
};
Map.addLayer(dirsamples, vis, 'Classes persistentes 85 a 17', true);

print(regioesCollection.size())

////////////////////////////////////////////////////////
var getTrainingSamples = function (feature) {
  var regiao = feature.get('reg_id');
  var floresta = ee.Number(feature.get('floresta'));
  var savana = ee.Number(feature.get('savana'));
  var campo = ee.Number(feature.get('campo'));
  var outro = ee.Number(feature.get('outro'));
  var agro = ee.Number(feature.get('agro'));
  var nao_veg = ee.Number(feature.get('nao_veg'));
  var aflora = ee.Number(feature.get('aflora'));
  var agua = ee.Number(feature.get('agua'));
  
  var total = floresta.add(savana).add(campo).add(outro).add(agro).add(nao_veg).add(aflora).add(agua)

  var sampleFloSize = ee.Number(floresta).divide(total).multiply(sampleSize).round().int16().max(nSamplesMin)
  var sampleSavSize = ee.Number(savana).divide(total).multiply(sampleSize).round().int16().max(nSamplesMin)
  var sampleCamSize = ee.Number(campo).divide(total).multiply(sampleSize).round().int16().max(nSamplesMin)
  var sampleOutSize = ee.Number(outro).divide(total).multiply(sampleSize).round().int16().max(nSamplesMin)
  var sampleAgrSize = ee.Number(agro).divide(total).multiply(sampleSize).round().int16().max(nSamplesMin)
  var sampleNVeSize = ee.Number(nao_veg).divide(total).multiply(sampleSize).round().int16().max(nSamplesMin)
  var sampleAflSize = ee.Number(aflora).divide(total).multiply(sampleSize).round().int16().max(nSamplesMin)
  var sampleAguSize = ee.Number(agua).divide(total).multiply(sampleSize).round().int16().max(nSamplesMin)

  var clippedGrid = ee.Feature(feature).geometry()

  var referenceMap =  dirsamples.clip(clippedGrid);
                      

  var training = referenceMap.stratifiedSample({scale:30, classBand: 'reference', numPoints: 0, region: feature.geometry(), seed: 1, geometries: true,
           classValues: [3,4,12,13,21,22,29,33], 
           classPoints: [sampleFloSize,sampleSavSize,sampleCamSize,sampleOutSize,sampleAgrSize,sampleNVeSize,sampleAflSize,sampleAguSize]
  });

  training = training.map(function(feat) {return feat.set({'region': regiao})});
    
  return training;
 };

var mySamples = regioesCollection.map(getTrainingSamples).flatten();

Map.addLayer(mySamples)

print(mySamples.size())
print(mySamples.limit(1))


Export.table.toAsset(mySamples,
  'samples_col5_'+bioma+'_v'+versao,
  dirout+'/samples_col5_'+bioma+'_v'+versao)
  
