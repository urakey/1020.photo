/**
 * Particles.js
 */

var Detector = require('./Detector');
var detector = new Detector();
if (!detector.webgl()) return;

var init = function() {

  // DOM
  var container = document.getElementById('container');

  // Scene
  var scene = new THREE.Scene();

  // Camera
  var width  = window.innerWidth;
  var height = window.innerHeight;
  var fov    = 60;
  var aspect = width / height;
  var near   = 1;
  var far    = 500;
  var camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(0, 0, 50);

  // Objects
  var pa
  var circleTexture   = new THREE.TextureLoader().load('/assets/images/three/circle.png');
  var triangleTexture = new THREE.TextureLoader().load('/assets/images/three/triangle.png');
  var parameters = {
    circle: { size: 10, color:0xfafafa, map: circleTexture, blending: THREE.NoBlending, transparent: true, alphaTest: .9 },
    triangle: { size: 10, color:0x9effe9, map: triangleTexture, blending: THREE.NoBlending, transparent: true, alphaTest: .9 }
  };

  var trianglesGeometry = createGeometry(444);
  var trianglesMaterial = new THREE.PointsMaterial(parameters.triangle);
  var triangles         = new THREE.Points(trianglesGeometry, trianglesMaterial);

  var circlesGeometry = createGeometry(777);
  var circlesMaterial = new THREE.PointsMaterial(parameters.circle);
  var circles         = new THREE.Points(circlesGeometry, circlesMaterial);

  scene.add(triangles, circles);

  // Renderer
  var renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
  renderer.setSize(width, height);
  renderer.setClearColor(0xffffff, 0);
  renderer.setPixelRatio(window.devicePixelRatio);
  container.appendChild(renderer.domElement);

  animate();

  function animate() {
    requestAnimationFrame(animate);
    render();
  }

  function render() {
    circles.rotation.x -= .0005;
    circles.rotation.y -= .0003;
    circles.rotation.z -= .0001;

    triangles.rotation.x += .0001;
    triangles.rotation.y -= .0002;
    triangles.rotation.z += .0005;

    renderer.render(scene, camera);
  }

  function resize() {
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  function createGeometry(count) {
    var geometry = new THREE.BufferGeometry();
    var vertices = [];

    for (var i = 0; i < count; i++) {
      var x = Math.random() * 1000 - 500;
      var y = Math.random() * 1000 - 500;
      var z = Math.random() * 1000 - 500;
      vertices.push(x, y, z);
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    return geometry;
  }

  window.addEventListener('resize', resize, false);
};

window.addEventListener('load', init, false);
