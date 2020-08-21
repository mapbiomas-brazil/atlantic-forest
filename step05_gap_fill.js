var geometry = /* color: #d63000 */ee.Geometry.Polygon(
        [[[-50.62140592730848, -30.83601334517784],
          [-41.12921842730848, -23.573842111091267],
          [-33.30695280230848, -8.504738362194722],
          [-35.24054655230848, -4.0503429525835255],
          [-56.24640592730848, -21.463075279113696],
          [-56.77374967730848, -29.92617101510622]]]);

//User parameters
var version_region_in = 14
var vesion_out = 'A20'
var VeightConnected = true
var prefixo_out = 'MA_col5_v'
var dircol5 = 'projects/mapbiomas-workspace/COLECAO5/classificacao-test'
var dirout = 'projects/mapbiomas-workspace/COLECAO5/classificacao-test/'

var visParMedian2 = {'bands':['median_swir1','median_nir','median_red'], 'gain':[0.08, 0.06,0.2],'gamma':0.5 };

  var mosaicoTotal = ee.ImageCollection('projects/mapbiomas-workspace/MOSAICOS/workspace-c3')
                      .filterMetadata('biome', 'equals', "MATAATLANTICA")
                      .filterMetadata('year', 'equals', 2000 )
                      .mosaic()
    Map.addLayer(mosaicoTotal, visParMedian2, 'Img_Year_2000', false);


////*************************************************************
// Do not Change from these lines
////*************************************************************



var palettes = require('users/mapbiomas/modules:Palettes.js');
var vis = {
    'min': 0,
    'max': 34,
    'palette': palettes.get('classification2')
};

var image = ee.ImageCollection(dircol5)
            .filterMetadata('version', 'equals', version_region_in)
            .filterMetadata('collection', 'equals', '5')
            .min()
image = image.mask(image.neq(0))
print(image)
var years = [
    1985, 1986, 1987, 1988,
    1989, 1990, 1991, 1992,
    1993, 1994, 1995, 1996,
    1997, 1998, 1999, 2000,
    2001, 2002, 2003, 2004,
    2005, 2006, 2007, 2008,
    2009, 2010, 2011, 2012,
    2013, 2014, 2015, 2016,
    2017, 2018, 2019];

/**
 * User defined functions
 */
var applyGapFill = function (image) {

    // apply the gap fill form t0 until tn
    var imageFilledt0tn = bandNames.slice(1)
        .iterate(
            function (bandName, previousImage) {

                var currentImage = image.select(ee.String(bandName));

                previousImage = ee.Image(previousImage);

                currentImage = currentImage.unmask(
                    previousImage.select([0]));

                return currentImage.addBands(previousImage);

            }, ee.Image(imageAllBands.select([bandNames.get(0)]))
        );

    imageFilledt0tn = ee.Image(imageFilledt0tn);

    // apply the gap fill form tn until t0
    var bandNamesReversed = bandNames.reverse();

    var imageFilledtnt0 = bandNamesReversed.slice(1)
        .iterate(
            function (bandName, previousImage) {

                var currentImage = imageFilledt0tn.select(ee.String(bandName));

                previousImage = ee.Image(previousImage);

                currentImage = currentImage.unmask(
                    previousImage.select(previousImage.bandNames().length().subtract(1)));

                return previousImage.addBands(currentImage);

            }, ee.Image(imageFilledt0tn.select([bandNamesReversed.get(0)]))
        );


    imageFilledtnt0 = ee.Image(imageFilledtnt0).select(bandNames);

    return imageFilledtnt0;
};

// get band names list 
var bandNames = ee.List(
    years.map(
        function (year) {
            return 'classification_' + String(year);
        }
    )
);

// generate a histogram dictionary of [bandNames, image.bandNames()]
var bandsOccurrence = ee.Dictionary(
    bandNames.cat(image.bandNames()).reduce(ee.Reducer.frequencyHistogram())
);

print(bandsOccurrence);

// insert a masked band 
var bandsDictionary = bandsOccurrence.map(
    function (key, value) {
        return ee.Image(
            ee.Algorithms.If(
                ee.Number(value).eq(2),
                image.select([key]).byte(),
                ee.Image().rename([key]).byte().updateMask(image.select(0))
            )
        );
    }
);

// convert dictionary to image
var imageAllBands = ee.Image(
    bandNames.iterate(
        function (band, image) {
            return ee.Image(image).addBands(bandsDictionary.get(ee.String(band)));
        },
        ee.Image().select()
    )
);

// generate image pixel years
var imagePixelYear = ee.Image.constant(years)
    .updateMask(imageAllBands)
    .rename(bandNames);

// apply the gap fill
var imageFilledtnt0 = applyGapFill(imageAllBands);
var imageFilledYear = applyGapFill(imagePixelYear);



Map.addLayer(image.select('classification_2000'), vis, 'image');


Map.addLayer(imageFilledtnt0.select('classification_2000'), vis, 'filtered');

imageFilledtnt0 = imageFilledtnt0.set('vesion', '2');

print(imageFilledtnt0);


print(dirout+prefixo_out+vesion_out)


Export.image.toAsset({
    'image': imageFilledtnt0,
    'description': prefixo_out+vesion_out,
    'assetId': dirout+prefixo_out+vesion_out,
    'pyramidingPolicy': {
        '.default': 'mode'
    },
    'region': geometry,
    'scale': 30,
    'maxPixels': 1e13
});

