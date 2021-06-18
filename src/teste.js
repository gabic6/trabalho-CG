var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
var renderer = new THREE.WebGLRenderer({
  antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var box = new THREE.Mesh(new THREE.BoxGeometry(100, 100, 100, 10, 10, 10), new THREE.MeshBasicMaterial({
  color: "gray",
  wireframe: true
}));
box.geometry.translate(0, 50, 0);
scene.add(box);

var speedTrans = 20;
var speedRot = THREE.Math.degToRad(45);

var clock = new THREE.Clock();
var delta = 0;

var camHolder = new THREE.Group();
camHolder.add(camera);
camHolder.position.set(0, 10, 20);
scene.add(camHolder);

var keyCode = -1;

function moveCamHolder() {
	console.log(keyCode);
  if (keyCode === 87) {
    camHolder.translateZ(-speedTrans * delta);
  } // w fast vorward
  if (keyCode === 83) {
    camHolder.translateZ(speedTrans * delta);
  } // s backward a little slower
  if (keyCode === 65) {
    camHolder.translateX(-speedTrans * delta);
  } // a slowly leftwards
  if (keyCode === 68) {
    camHolder.translateX(speedTrans * delta);
  } // d slowly rightwards

  if (keyCode === 76) {
    camHolder.rotateY(speedRot * delta);
  } // l turn to the left
  if (keyCode === 82) {
    camHolder.rotateY(-speedRot * delta);
  } // r turn to the right

  if (keyCode === 84) {
    camHolder.translateY(speedTrans * delta);
  } // t upstretch
  if (keyCode === 66) {
    camHolder.translateY(-speedTrans * delta);
  } // b bend down
  if (keyCode === 38) {
    camera.rotation.x += speedRot * delta;
  } // up arrow, looking higher
  if (keyCode === 40) {
    camera.rotation.x += -speedRot * delta;
  } // down arrow, looking deeper
}

document.addEventListener('keydown', function(evt) {
  keyCode = evt.keyCode;
});

document.addEventListener('keyup', function() {
  keyCode = -1;
});

render();

function render() {
  requestAnimationFrame(render);
  delta = clock.getDelta();
  if (keyCode !== -1) {
    moveCamHolder();
  }
  renderer.render(scene, camera);
}
