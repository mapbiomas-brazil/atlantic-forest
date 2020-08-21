
var regiao = 'reg_01'
var version = '15'
var version_out = 14
var RFtrees = 70
var coleta = false
if (coleta) {var RFtrees = 10}
var versao_acc = 12

var bioma = "MATAATLANTICA"

var dirasset = 'projects/mapbiomas-workspace/MOSAICOS/workspace-c3';
var dirout = 'projects/mapbiomas-workspace/COLECAO5/classificacao-test/'
var regioesCollection = ee.FeatureCollection('projects/mapbiomas-workspace/AUXILIAR/REGIOES/VETOR/MA_reg_col5')
var palettes = require('users/mapbiomas/modules:Palettes.js');

var sampleComplementar = 500



var anos = [1985,1986,1987,1988,1989,1990,1991,1992,1993,1994,1995,1996,1997,1998,1999,2000,2001,2002,2003,2004,2005,2006,2007,2008,2009,2010,2011,2012,2013,2014,2015,2016,2017,2018,2019];

if (coleta) {var anos = [2018];
var colecao41 = ee.ImageCollection('projects/mapbiomas-workspace/AMOSTRAS/col4/MATA_ATLANTICA/class_col4')
           .filterMetadata('version', 'equals', '21')
           .min().select('classification_2018')
print(colecao41)
}

var options = {
  'classes': [3, 4, 12, 13, 21, 22,29,33],
  'classNames': ['forest', 'savana','campo', 'veg.ñflo', 'agro','ñflo','aflo', 'agua']
};


var vis = {
    'min': 0,
    'max': 34,
    'palette': palettes.get('classification2')
};

var bandNames = ee.List([
 'min_green',
 'median_swir1_wet',
 'median_green_dry',
 'median_red_dry',
 'min_swir2',
 'median_swir1',
 'median_swir2_dry',
 'median_green',
 'median_red',
 'median_swir2',
 'median_swir1_dry',
 'median_hallcover',
 'min_swir1',
 'median_swir2_wet',
 'median_red_wet',
 'min_red',
 'median_blue_dry',
 'median_ndfi_wet',
 'min_blue',
 'longitude',
 'median_green_wet',
 'median_nir',
 'median_wefi_wet',
 'median_ndwi_wet',
 'amp_ndvi_3anos',
 'median_blue',
 'median_nir_wet',
 'median_nir_dry',
 'min_nir',
 'median_cai_dry',
 'median_ndfi',
 'latitude',
 'median_wefi',
 'median_ndwi',
 'median_ndvi_dry'
])

var visParMedian = {'bands':['m_swir1','m_nir','m_red'], 'gain':[0.08, 0.06,0.2],'gamma':0.5 };
var visParMedian2 = {'bands':['median_swir1','median_nir','median_red'], 'gain':[0.08, 0.06,0.2],'gamma':0.5 };

var limite = regioesCollection.filterMetadata('reg_id', "equals", regiao);
var blank = ee.Image(0).mask(0);
var outline = blank.paint(limite, 'AA0000', 2); 
var visPar = {'palette':'000000','opacity': 0.6};
Map.addLayer(outline, visPar, regiao, false);



var bimoa250mil = ee.FeatureCollection('projects/mapbiomas-workspace/AUXILIAR/biomas_IBGE_250mil')
   .filterMetadata('Bioma','equals','Mata Atlântica')
var blank = ee.Image(0).mask(0);
var outline = blank.paint(bimoa250mil, 'AA0000', 2); 
var visPar = {'palette':'000000','opacity': 0.6};
Map.addLayer(outline, visPar, 'bimoa250mil', false);

for (var i_ano=0;i_ano<anos.length; i_ano++){
  var ano = anos[i_ano];

    var colecao43 = ee.Image('projects/mapbiomas-workspace/AMOSTRAS/col4/MATA_ATLANTICA/class_col4/'+regiao+'-RF85a18_v'+version).select('classification_'+ano);
    colecao43 = colecao43.select('classification_'+ano).remap(
                    [3, 4, 5,11,12,13,14,15,18,19,20,21,22,23,24,25,26,29,30,31,32,33],
                    [3, 4, 3,11,12,13,21,21,21,21,21,21,22,23,22,22,33,29,30,31,32,33])

    var colecao31 = ee.Image('projects/mapbiomas-workspace/public/collection3_1/mapbiomas_collection31_integration_v1').select('classification_'+ano).clip(limite);
    colecao31 = colecao31.select('classification_'+ano).remap(
                    [3, 4, 5,11,12,13,14,15,18,19,20,21,22,23,24,25,26,29,30,31,32,33],
                    [3, 4, 3,11,12,13,21,21,21,21,21,21,22,23,22,22,33,29,30,31,32,33])

    var mosaico85 = ee.ImageCollection(dirasset)
                      .filterMetadata('biome', 'equals', bioma)
                      .filterMetadata('year', 'equals', 1985)
                      .filterBounds(limite)
    var mosaico86 = ee.ImageCollection(dirasset)
                      .filterMetadata('biome', 'equals', bioma)
                      .filterMetadata('year', 'equals', 1986)
                      .filterBounds(limite)

if (ano == 1985) {
  var ano_menos1 = 1986
  var ano_menos2 = 1987
} else if (ano == 1986) {
  var ano_menos1 = 1985
  var ano_menos2 = 1987 
} else {
  var ano_menos1 = ano - 1
  var ano_menos2 = ano - 2   
}

  var mosaicoTotal = ee.ImageCollection(dirasset)
                      .filterMetadata('biome', 'equals', bioma)
                      .filterMetadata('year', 'equals', ano )
                      .filterBounds(limite)
                      .mosaic()

  var mosaico1ano_antes = ee.ImageCollection(dirasset)
                    .filterMetadata('biome', 'equals', bioma)
                    .filterMetadata('year', 'equals', ano_menos1)
                    .filterBounds(limite)
                    .mosaic()


  var mosaico2anos_antes = ee.ImageCollection(dirasset)
                    .filterMetadata('biome', 'equals', bioma)
                    .filterMetadata('year', 'equals', ano_menos2)
                    .filterBounds(limite)
                    .mosaic()
                    
  var min3anos = ee.ImageCollection.fromImages([mosaicoTotal.select('median_ndvi_dry'),
                                                mosaico1ano_antes.select('median_ndvi_dry'),
                                                mosaico2anos_antes.select('median_ndvi_dry')]).min()
  
  var max3anos = ee.ImageCollection.fromImages([mosaicoTotal.select('median_ndvi_wet'),
                                                mosaico1ano_antes.select('median_ndvi_wet'),
                                                mosaico2anos_antes.select('median_ndvi_wet')]).max()
  var amp3anos = max3anos.subtract(min3anos).rename('amp_ndvi_3anos')
  var ndvi_color = '0f330f, 005000, 4B9300, 92df42, bff0bf, FFFFFF, eee4c7, ecb168, f90000'
  var visParNDFI_amp = {'min':0, 'max':100, 'palette':ndvi_color};

  mosaicoTotal = mosaicoTotal.addBands(amp3anos)
  
  var BDamostras = ee.FeatureCollection('projects/mapbiomas-workspace/AMOSTRAS/col5/MATA_ATLANTICA/SAMPLES/exp1/pontos_exp2_v13_'+ano+'_mos4_35bandas')
                    .filterMetadata('reg_id', 'equals', regiao)

  mosaicoTotal = mosaicoTotal.clip(limite)


    //Generate lat/lon image
    var biomes = ee.Image('projects/mapbiomas-workspace/AUXILIAR/biomas-raster-41')
    var bioma250mil_MA = biomes.mask(biomes.eq(2))

    var ll = ee.Image.pixelLonLat().mask(bioma250mil_MA);
    
    var long = ll.select('longitude').add(34.8).multiply(-1).multiply(1000).toInt16()
    var lati = ll.select('latitude').add(5).multiply(-1).multiply(1000).toInt16()
    
    mosaicoTotal = mosaicoTotal.addBands(long.rename('longitude'))
    mosaicoTotal = mosaicoTotal.addBands(lati.rename('latitude' ))

    mosaicoTotal = mosaicoTotal.select(bandNames)

if (coleta) {    Map.addLayer(mosaico85, visParMedian2, 'Img_Year_85', false);  
    Map.addLayer(mosaico86, visParMedian2, 'Img_Year_86', false);  
    Map.addLayer(mosaicoTotal.clip(bimoa250mil), visParMedian2, 'Img_Year_'+ano, false);
    Map.addLayer(colecao41, vis, 'Colecao 4 v1 - '+ano, true);}

    var BDflo = BDamostras.filterMetadata("reference", "equals", 3)
    var BDsav = BDamostras.filterMetadata("reference", "equals", 4)
    var BDreflo = BDamostras.filterMetadata("reference", "equals", 9)
    var BDcampo = BDamostras.filterMetadata("reference", "equals", 12)
    var BDOutroNFlo = BDamostras.filterMetadata("reference", "equals", 13)
    var BDagro = BDamostras.filterMetadata("reference", "equals", 14)
    var BDNaoVeg = BDamostras.filterMetadata("reference", "equals", 22)
    var BDAflora = BDamostras.filterMetadata("reference", "equals", 29)
    var BDagua = BDamostras.filterMetadata("reference", "equals", 33)

  var training = BDflo.merge(BDreflo).merge(BDcampo).merge(BDsav).merge(BDOutroNFlo).merge(BDAflora)
                      .merge(BDagro).merge(BDNaoVeg)
                      .merge(BDagua)


  var classifier = ee.Classifier.smileRandomForest({numberOfTrees: RFtrees, variablesPerSplit:1}).train(training, 'reference', bandNames);
  var classified = mosaicoTotal.classify(classifier).mask(mosaicoTotal.select('median_blue'));
  classified = classified.select(['classification'],['classification_'+ano]).clip(limite.geometry()).toInt8()
if (coleta) {  Map.addLayer(classified, vis, 'RF'+ano+"_"+regiao, false);}

  if (i_ano == 0){ var classified85a18 = classified }  
  else {classified85a18 = classified85a18.addBands(classified); }
  
}

classified85a18 = classified85a18
.set('collection', '5')
.set('version', version_out)
.set('biome', bioma)


Export.image.toAsset({
  "image": classified85a18.toInt8(),
  "description": regiao+'-'+'RF85a19_v'+version_out,
  "assetId": dirout + regiao+'-'+'RF85a19_v'+version_out,
  "scale": 30,
  "pyramidingPolicy": {
      '.default': 'mode'
  },
  "maxPixels": 1e13,
  "region": limite
});    
