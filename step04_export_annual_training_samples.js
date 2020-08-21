var versao = 'v2'
var dirout = 'projects/mapbiomas-workspace/AMOSTRAS/col5/MATA_ATLANTICA/SAMPLES/exp1/';

var bioma250mil = ee.FeatureCollection('projects/mapbiomas-workspace/AUXILIAR/biomas_IBGE_250mil')
var bioma250mil_MA_vetor = bioma250mil.filterMetadata('Bioma','equals', 'Mata Atlântica')

var biomes = ee.Image('projects/mapbiomas-workspace/AUXILIAR/biomas-raster-41')
var bioma250mil_MA = biomes.mask(biomes.eq(2))
var dirasset = 'projects/mapbiomas-workspace/MOSAICOS/workspace-c3';

var palettes = require('users/mapbiomas/modules:Palettes.js');

var vis = {
    'min': 0,
    'max': 34,
    'palette': palettes.get('classification2')
};

Map.addLayer(bioma250mil_MA,{},"biome MA",false)

{var bandNames = ee.List([
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
  }
var regioesCollection = ee.FeatureCollection('projects/mapbiomas-workspace/AUXILIAR/REGIOES/VETOR/MA_reg_col5')

var bioma = "MATAATLANTICA";

var ano = 2000

var pts = ee.FeatureCollection('projects/mapbiomas-workspace/AMOSTRAS/col5/MATA_ATLANTICA/SAMPLES/exp1pontos_exp1_balanceado_' + versao + '_reg')
Map.addLayer(pts, {}, 'pt', false)

var anos = [
//            1985,1986,1987,1988,1989,
            1990,1991,1992,1993,1994,
//            1995,1996,1997,1998,1999,
//            2000,2001,2002,2003,2004,
//            2005,2006,2007,2008,2009,
//            2010,2011,2012,2013,2014,
//            2015,2016,2017,2018,2019
            ];

for (var i_ano=0;i_ano<anos.length; i_ano++){
  var ano = anos[i_ano];

  var regioes_lista = [
      ['reg_01'],['reg_02'],['reg_03'],['reg_04'],['reg_05'],['reg_06'],['reg_07'],['reg_08'],['reg_09'],['reg_10'],['reg_11'],['reg_12'],['reg_13'],['reg_14'],['reg_15'],
      ['reg_16'],['reg_17'],['reg_18'],['reg_19'],['reg_20'],['reg_21'],['reg_22'],['reg_23'],['reg_24'],['reg_25'],['reg_26'],['reg_27'],['reg_28'],['reg_29'],['reg_30']
      ]
  
  for (var i_regiao=0;i_regiao<regioes_lista.length; i_regiao++){
    var lista = regioes_lista[i_regiao];
    var regiao = lista[0];
  //  print(regiao)
    var limite = regioesCollection.filterMetadata('reg_id', "equals", regiao);
    
    
    var mosaicoTotal = ee.ImageCollection(dirasset)
                        .filterMetadata('biome', 'equals', bioma)
                        .filterMetadata('year', 'equals', (ano))
                        .filterBounds(limite)
                        .mosaic()
  
    var mosaico1ano_antes = ee.ImageCollection(dirasset)
                      .filterMetadata('biome', 'equals', bioma)
                      .filterMetadata('year', 'equals', ( ano - 1))
                      .filterBounds(limite)
                      .mosaic()
  
  
    var mosaico2anos_antes = ee.ImageCollection(dirasset)
                      .filterMetadata('biome', 'equals', bioma)
                      .filterMetadata('year', 'equals', ( ano - 2))
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
    var visParNDFI_amp = {'min':0, 'max':60, 'palette':ndvi_color};
    mosaicoTotal = mosaicoTotal.addBands(amp3anos)

    var ll = ee.Image.pixelLonLat().mask(bioma250mil_MA);
    
    var long = ll.select('longitude').add(34.8).multiply(-1).multiply(1000).toInt16()
    var lati = ll.select('latitude').add(5).multiply(-1).multiply(1000).toInt16()
    
    mosaicoTotal = mosaicoTotal.addBands(long.rename('longitude'))
    mosaicoTotal = mosaicoTotal.addBands(lati.rename('latitude' ))
    mosaicoTotal = mosaicoTotal.select(bandNames)

    var pts_reg = pts.filterMetadata('reg_id', 'equals', regiao)

    var training = mosaicoTotal.sampleRegions({
        'collection': pts_reg,
        'scale': 30,
        'tileScale': 4,
        'geometries': true
    });
      
    if (i_regiao == 0){ var training_reg = training }  
    else {training_reg = training_reg.merge(training); }
  }    

Export.table.toAsset(training_reg, 'pontos_exp2_'+versao+'_'+ano+'_mos4_35bandas', dirout + 'pontos_exp2_'+versao+'_'+ano+'_mos4_35bandas');  

  
}
