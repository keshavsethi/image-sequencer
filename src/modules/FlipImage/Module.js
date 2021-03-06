/*
 * Flip the image on vertical/horizontal axis.
 */
module.exports = function FlipImage(options, UI) {
  var defaults = require('./../../util/getDefaults.js')(require('./info.json'));
  options.Axis = options.Axis || defaults.Axis;

  var output,
    getPixels = require('get-pixels');

  function draw(input, callback, progressObj) {

    progressObj.stop(true);
    progressObj.overrideFlag = true;

    var step = this;

    return getPixels(input.src, function(err, oldPixels) {
      function changePixel(r, g, b, a) {
        return [r, g, b, a];
      }
      function extraManipulation(pixels) {
        if (err) {
          console.log(err);
          return;
        }
        return require('./flipImage')(oldPixels, pixels, options.Axis);
      }
      
      function output(image, datauri, mimetype, wasmSuccess) {
        step.output = { src: datauri, format: mimetype, wasmSuccess, useWasm: options.useWasm };
      }

      return require('../_nomodule/PixelManipulation.js')(input, {
        output: output,
        ui: options.step.ui,
        changePixel: changePixel,
        extraManipulation: extraManipulation,
        format: input.format,
        image: options.image,
        inBrowser: options.inBrowser,
        callback: callback,
        useWasm:options.useWasm
      });
    });

  }

  return {
    options: options,
    draw: draw,
    output: output,
    UI: UI
  };
};
