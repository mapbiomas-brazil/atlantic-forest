var geometry = /* color: #d63000 */ee.Geometry.Polygon(
        [[[-50.62140592730848, -30.83601334517784],
          [-41.12921842730848, -23.573842111091267],
          [-33.30695280230848, -8.504738362194722],
          [-35.24054655230848, -4.0503429525835255],
          [-56.24640592730848, -21.463075279113696],
          [-56.77374967730848, -29.92617101510622]]]);
          
var version_in_class = 'A20'
var version_in = 'A20'
var version_out = "B21_v3"

var prefixo_out = 'MA_col5_v'
var dirout = 'projects/mapbiomas-workspace/COLECAO5/classificacao-test/'

var bioma = "MATAATLANTICA"
var incid_geral = 10

var class5_class = ee.Image(dirout+prefixo_out+version_in_class)
print(class5_class)
var class4FT = ee.Image(dirout+prefixo_out+version_in)
var image_incidence_geral = ee.Image(dirout+prefixo_out+'B20_incident'+incid_geral)

print(image_incidence_geral)


////*************************************************************
// Do not Change from these lines
////*************************************************************
var visParMedian2 = {'bands':['median_swir1','median_nir','median_red'], 'gain':[0.08, 0.06,0.2],'gamma':0.5 };

  var mosaicoTotal = ee.ImageCollection('projects/mapbiomas-workspace/MOSAICOS/workspace-c3')
                      .filterMetadata('biome', 'equals', "MATAATLANTICA")
                      .filterMetadata('year', 'equals', 2018 )
                      .mosaic()
var palettes = require('users/mapbiomas/modules:Palettes.js');
var pal = palettes.get('classification2');
var vis = {
      bands: 'classification_2018',
      min:0,
      max:34,
      palette: pal,
      format: 'png'
    };
var vis2 = {
      min:0,
      max:34,
      palette: pal,
      format: 'png'
    };
Map.addLayer(class5_class, vis, 'class5_class');
Map.addLayer(class4FT, vis, 'class4FT');

var anos3 = ['1986','1987','1988','1989','1990','1991','1992','1993','1994','1995','1996','1997','1998','1999','2000','2001','2002','2003','2004','2005','2006','2007','2008','2009','2010','2011','2012','2013','2014','2015','2016','2017','2018','2019'];

var palette_incidence = ["#C8C8C8","#FED266","#FBA713","#cb701b", "#cb701b", "#a95512", "#a95512", "#662000",  "#662000", "#cb181d"]
var palette_incidence = ['red']
Map.addLayer(image_incidence_geral, {bands: 'incidence', palette:palette_incidence, min:8, max:20}, "incidents", false);

var class4FT_corrigida = class4FT


var maskIncid_borda = image_incidence_geral.select('connect').lte(6)
              .and(image_incidence_geral.select('incidence').gt(incid_geral))
maskIncid_borda = maskIncid_borda.mask(maskIncid_borda.eq(1))              
Map.addLayer(maskIncid_borda, {palette:"#f49e27", min:1, max:1}, 'maskIncid_borda')
var corrige_borda = ee.Image(21).mask(maskIncid_borda)

var maskIncid_anual3 = image_incidence_geral.select('connect').gt(6)
              .and(image_incidence_geral.select('incidence').gt(incid_geral))
              .and((image_incidence_geral.select('classification_mode').eq(3)))
maskIncid_anual3 = ee.Image(21).mask(maskIncid_anual3)

var maskIncid_anual21 = image_incidence_geral.select('connect').gt(6)
              .and(image_incidence_geral.select('incidence').gt(incid_geral))
              .and((image_incidence_geral.select('classification_mode').eq(21)))
maskIncid_anual21 = ee.Image(21).mask(maskIncid_anual21)


var maskIncid_anual4 = image_incidence_geral.select('connect').gt(6)
              .and(image_incidence_geral.select('incidence').gt(incid_geral))
              .and((image_incidence_geral.select('classification_mode').eq(4)))
maskIncid_anual4 = ee.Image(21).mask(maskIncid_anual4)

var maskIncid_anual12 = image_incidence_geral.select('connect').gt(6)
              .and(image_incidence_geral.select('incidence').gt(incid_geral))
              .and((image_incidence_geral.select('classification_mode').eq(12)))
maskIncid_anual12 = ee.Image(21).mask(maskIncid_anual12)


class4FT_corrigida = class4FT_corrigida.blend(corrige_borda)
class4FT_corrigida = class4FT_corrigida.blend(maskIncid_anual3)
class4FT_corrigida = class4FT_corrigida.blend(maskIncid_anual21)
class4FT_corrigida = class4FT_corrigida.blend(maskIncid_anual4)
class4FT_corrigida = class4FT_corrigida.blend(maskIncid_anual12)

Map.addLayer(class4FT_corrigida, vis, 'class4FT corrigida');


var anos = ['1985','1986','1987','1988','1989','1990','1991','1992','1993','1994','1995','1996','1997','1998','1999','2000','2001','2002','2003','2004','2005','2006','2007','2008','2009','2010','2011','2012','2013','2014','2015','2016','2017','2018','2019'];

for (var i_ano=0;i_ano<anos.length; i_ano++){  
  var ano = anos[i_ano]; 
  class4FT_corrigida = class4FT_corrigida.addBands(class4FT_corrigida.select('classification_'+ano).connectedPixelCount(100,false).rename('connect_'+ano))
}

print(class4FT_corrigida)

Export.image.toAsset({
    'image': class4FT_corrigida,
    'description': prefixo_out+version_out+'_i'+incid_geral,
    'assetId': dirout+prefixo_out+version_out+'_i'+incid_geral,
    'pyramidingPolicy': {
        '.default': 'mode'
    },
    'region': geometry,
    'scale': 30,
    'maxPixels': 1e13
});
