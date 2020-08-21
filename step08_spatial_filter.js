var geometry = /* color: #d63000 */ee.Geometry.Polygon(
        [[[-50.62140592730848, -30.83601334517784],
          [-41.12921842730848, -23.573842111091267],
          [-33.30695280230848, -8.504738362194722],
          [-35.24054655230848, -4.0503429525835255],
          [-56.24640592730848, -21.463075279113696],
          [-56.77374967730848, -29.92617101510622]]]);
          

var bioma = "MATAATLANTICA"

var vesion_in = 'D23'
var version_out = 'E23'
var min_connect_pixel = 6
var prefixo_out = 'MA_col5_v'
var dirout = 'projects/mapbiomas-workspace/COLECAO5/classificacao-test/'


////*************************************************************
// Do not Change from these lines
////*************************************************************
var biomaMA = ee.Image('projects/mapbiomas-workspace/AUXILIAR/RASTER/Bioma250mil')
biomaMA = biomaMA.mask(biomaMA.eq(4))
Map.addLayer(biomaMA,{'palette': 'ccffcc'}, 'biomaMA', false)


var palettes = require('users/mapbiomas/modules:Palettes.js');

var class4GAP = ee.Image(dirout+prefixo_out+vesion_in).mask(biomaMA)
print(class4GAP)

var palettes = require('users/mapbiomas/modules:Palettes.js');
var pal = palettes.get('classification2');
var vis = {
      bands: 'classification_1985',
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
Map.addLayer(class4GAP, vis, 'class4GAP');


var anos = ['1985','1986','1987','1988','1989','1990','1991','1992','1993','1994','1995','1996','1997','1998','1999','2000','2001','2002','2003','2004','2005','2006','2007','2008','2009','2010','2011','2012','2013','2014','2015','2016','2017','2018','2019'];
//var anos = ['1985']
for (var i_ano=0;i_ano<anos.length; i_ano++){  
  var ano = anos[i_ano]; 
  
  var moda = class4GAP.select('classification_'+ano).focal_mode(2, 'square', 'pixels')
  moda = moda.mask(class4GAP.select('classification_'+ano+'_conn').lte(min_connect_pixel))
  var class_out = class4GAP.select('classification_'+ano).blend(moda)
  
  if (i_ano == 0){ var class_outTotal = class_out }  
  else {class_outTotal = class_outTotal.addBands(class_out); }
}
print(class_outTotal)
Map.addLayer(class_outTotal, vis, 'class4 MODA');


Export.image.toAsset({
    'image': class_outTotal,
    'description': prefixo_out+version_out,
    'assetId': dirout+prefixo_out+version_out,
    'pyramidingPolicy': {
        '.default': 'mode'
    },
    'region': geometry,
    'scale': 30,
    'maxPixels': 1e13
});
