/**
 * @class Detector
 */

function Detector() {
}
Detector.prototype = {

  webgl: function() {
    try {
      var canvas = document.createElement('canvas');
      return !! (window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
    } catch (e) {
      return false;
    }
  }
};

// export
module.exports = Detector;
