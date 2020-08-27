var geometry = /* color: #d63000 */ee.Geometry.Polygon(
        [[[-50.62140592730848, -30.83601334517784],
          [-41.12921842730848, -23.573842111091267],
          [-33.30695280230848, -8.504738362194722],
          [-35.24054655230848, -4.0503429525835255],
          [-56.24640592730848, -21.463075279113696],
          [-56.77374967730848, -29.92617101510622]]]);
          

var vesion_in = 'E23_v4'
var version_out = "F23_v4"
var prefixo_out = 'MA_col5_v'
var dirout = 'projects/mapbiomas-workspace/COLECAO5/classificacao-test/'
var perc_majority = 80
var bioma = "MATAATLANTICA"

////*************************************************************
// Do not Change from these lines
////*************************************************************

var palettes = require('users/mapbiomas/modules:Palettes.js');


var class4 = ee.Image(dirout+prefixo_out+vesion_in)
var palettes = require('users/mapbiomas/modules:Palettes.js');
var pal = palettes.get('classification2');
var vis = {
      bands: 'classification_2018',
      min:0,
      max:34,
      palette: pal,
      format: 'png'
    };

var filtrofreq = function(mapbiomas){
  ////////Calculando frequencias
  // General rule
  var exp = '100*((b(0)+b(1)+b(2)+b(3)+b(4)+b(5)+b(6)+b(7)+b(8)+b(9)+b(10)+b(11)+b(12)+b(13)+b(14)+b(15)' +
      '+b(16)+b(17)+b(18)+b(19)+b(20)+b(21)+b(22)+b(23)+b(24)+b(25)+b(26)+b(27)+b(28)+b(29)+b(30)+b(31)+b(32)+b(33)+b(34))/35 )';
  
  // get frequency
  var florFreq = mapbiomas.eq(3).expression(exp);
  var savFreq = mapbiomas.eq(4).expression(exp);
  var grassFreq = mapbiomas.eq(12).expression(exp);
  var naoFlorFreq = mapbiomas.eq(13).expression(exp);
  var id21Freq = mapbiomas.eq(21).expression(exp);

  //////Máscara de vegetacao nativa e agua (freq >95%)
  var vegMask = ee.Image(0).where((florFreq.add(savFreq).add(naoFlorFreq).add(grassFreq)).gt(95), 1)
  var vegMask_sav = ee.Image(0).where((florFreq.add(savFreq).add(id21Freq).add(grassFreq)).gt(95), 1)

  /////Mapa base: 
  var  vegMap = ee.Image(0)
                          .where(vegMask.eq(1).and(florFreq.gt(perc_majority).and(class4.select('classification_2019').neq(3))), 3)
                          .where(vegMask.eq(1).and(grassFreq.gt(perc_majority)), 12)
                          .where(vegMask.eq(1).and(naoFlorFreq.gt(perc_majority)), 13)
                          .where(vegMask_sav.eq(1).and(savFreq.gt(50)), 4)
                          
  
  vegMap = vegMap.updateMask(vegMap.neq(0))
  
  var saida = mapbiomas.where(vegMap, vegMap)

  return saida;
}

var saida = filtrofreq(class4)


print(class4)
print(saida)

Map.addLayer(class4, vis, 'image');

Map.addLayer(saida, vis, 'filtered');


Export.image.toAsset({
    'image': saida,
    'description': prefixo_out+version_out,
    'assetId': dirout+prefixo_out+version_out,
    'pyramidingPolicy': {
        '.default': 'mode'
    },
    'region': geometry,
    'scale': 30,
    'maxPixels': 1e13
});

