var geometry = /* color: #d63000 */ee.Geometry.Polygon(
        [[[-50.62140592730848, -30.83601334517784],
          [-41.12921842730848, -23.573842111091267],
          [-33.30695280230848, -8.504738362194722],
          [-35.24054655230848, -4.0503429525835255],
          [-56.24640592730848, -21.463075279113696],
          [-56.77374967730848, -29.92617101510622]]]);
          
var vesion_in = 'A20'
var version_out = "B20_incident"
var prefixo_out = 'MA_col5_v'

var dirout = 'projects/mapbiomas-workspace/COLECAO5/classificacao-test/'
var incid_geral = 10
var incid_restrito = 12
var bioma = "MATAATLANTICA"

var classeIds =    [3, 4, 9,12,13,15,19,20,21,22,24,29,33]
var newClasseIds = [3, 3,21,12,13,21,21,21,21,21,21,29,33]

var imc_carta2 = ee.Image(dirout+prefixo_out+vesion_in).select([
  'classification_1985',
  'classification_1986',
  'classification_1987',
  'classification_1988',
  'classification_1989',
  'classification_1990',
  'classification_1991',
  'classification_1992',
  'classification_1993',
  'classification_1994',
  'classification_1995',
  'classification_1996',
  'classification_1997',
  'classification_1998',
  'classification_1999',
  'classification_2000',
  'classification_2001',
  'classification_2002',
  'classification_2003',
  'classification_2004',
  'classification_2005',
  'classification_2006',
  'classification_2007',
  'classification_2008',
  'classification_2009',
  'classification_2010',
  'classification_2011',
  'classification_2012',
  'classification_2013',
  'classification_2014',
  'classification_2015',
  'classification_2016',  
  'classification_2017',  
  'classification_2018',  
  'classification_2019'
  ])



////*************************************************************
// Do not Change from these lines
////*************************************************************

var palettes = require('users/mapbiomas/modules:Palettes.js');
var vis = {
    'bands': 'classification_2018',
    'min': 0,
    'max': 34,
    'palette': palettes.get('classification2')
};


Map.addLayer(imc_carta2, vis, 'class_2018', false)



//==================Edicao Usuario====================================================================
//Trocar o asset abaixo
var palettes = require('users/mapbiomas/modules:Palettes.js');
var vis = {
    'min': 0,
    'max': 34,
    'palette': palettes.get('classification2')
};
var visParMedian = {'bands':['median_swir1','median_nir','median_red'], 'gain':[0.08, 0.06,0.2],'gamma':0.5 };

//editar os parametros
var anos = ['1985', '1986', '1987','1988', '1989', '1990','1991', '1992', '1993','1994', '1995', '1996','1997', '1998', '1999','2000', '2001', '2002','2003', '2004', '2005','2006', '2007', '2008','2009', '2010', '2011','2012', '2013', '2014','2015', '2016', '2017', '2018', '2019']



var colList = ee.List([])
for (var i_ano=0;i_ano<anos.length; i_ano++){
  var ano = anos[i_ano];
  var colList = colList.add(imc_carta2.select(['classification_'+ano],['classification']))
}
var imc_carta = ee.ImageCollection(colList)

var img1 =  ee.Image(imc_carta.first());

var image_moda = imc_carta.reduce(ee.Reducer.mode());
print(image_moda)
Map.addLayer(image_moda, vis, "image_moda");


// ******* incidence **********
var imagefirst = img1.addBands(ee.Image(0)).rename(["classification", "incidence"]);

var incidence = function(imgActual, imgPrevious){
  
  imgActual = ee.Image(imgActual);
  imgPrevious = ee.Image(imgPrevious);
  
  var imgincidence = imgPrevious.select(["incidence"]);
  
  var classification0 = imgPrevious.select(["classification"]);
  var classification1 = imgActual.select(["classification"]);
  
  
  var change  = ee.Image(0);
  change = change.where(classification0.neq(classification1), 1);
  imgincidence = imgincidence.where(change.eq(1), imgincidence.add(1));
  
  return imgActual.addBands(imgincidence);
  
};

var imc_carta4 = imc_carta.map(function(image) {
    image = image.remap(classeIds, newClasseIds, 21)
    image = image.mask(image.neq(27));
    return image.rename('classification');
});

Map.addLayer(imc_carta4, vis, 'imc_carta4');

var image_incidence = ee.Image(imc_carta4.iterate(incidence, imagefirst)).select(["incidence"]);

var palette_incidence = ["#C8C8C8","#FED266","#FBA713","#cb701b", "#cb701b", "#a95512", "#a95512", "#662000",  "#662000", "#cb181d"]

var image_incidence_geral = image_incidence.mask(image_incidence.gt(incid_geral))

image_incidence_geral = image_incidence_geral.addBands(image_incidence_geral.where(image_incidence_geral.gt(incid_geral),1).rename('valor1'))
image_incidence_geral = image_incidence_geral.addBands(image_incidence_geral.select('valor1').connectedPixelCount(100,false).rename('connect'))
image_incidence_geral = image_incidence_geral.addBands(image_moda)
print(image_incidence_geral)
Map.addLayer(image_incidence_geral, {}, "incidents geral");

Export.image.toAsset({
    'image': image_incidence_geral,
    'description': prefixo_out+version_out+incid_geral,
    'assetId': dirout+prefixo_out+version_out+incid_geral,
    'pyramidingPolicy': {
        '.default': 'mode'
    },
    'region': geometry,
    'scale': 30,
    'maxPixels': 1e13
});

var image_incidence_restrito = image_incidence.mask(image_incidence.gt(incid_restrito))

image_incidence_restrito = image_incidence_restrito.addBands(image_incidence_restrito.where(image_incidence_restrito.gt(incid_restrito),1).rename('valor1'))
image_incidence_restrito = image_incidence_restrito.addBands(image_incidence_restrito.select('valor1').connectedPixelCount(100,false).rename('connect'))
image_incidence_restrito = image_incidence_restrito.addBands(image_moda)
print(image_incidence_restrito)
Map.addLayer(image_incidence_restrito, {}, "incidents restrito");

Export.image.toAsset({
    'image': image_incidence_restrito,
    'description': prefixo_out+version_out+incid_restrito,
    'assetId': dirout+prefixo_out+version_out+incid_restrito,
    'pyramidingPolicy': {
        '.default': 'mode'
    },
    'region': geometry,
    'scale': 30,
    'maxPixels': 1e13
});

var SOS = ee.FeatureCollection('projects/mapbiomas-workspace/VALIDACAO/SOS_dec_mata00a18')
Map.addLayer(SOS)
