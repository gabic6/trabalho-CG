import * as THREE from  '../build/three.module.js';
import KeyboardState from '../libs/util/KeyboardState.js';


////////// Criação da Cena /////////////

const scene = new THREE.Scene();

//keyboard
var keyboard = new KeyboardState();

// Iluminação
scene.add( new THREE.HemisphereLight() );

/////////// Criação da câmera ///////////

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.lookAt(0, 0, 0);
camera.position.set(0.0, 2.0, 0.0);
camera.up.set( 0, 1, 0 );

var cameraHolder= new THREE.Object3D();
cameraHolder.add(camera);
cameraHolder.position.set(0,10,20);
scene.add(cameraHolder);

// Create helper for the virtual camera
//const cameraHelper = new THREE.CameraHelper(camera);
//scene.add(cameraHelper);


/////////// Render ///////////

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

/////////// Objetos ///////////

// Show axes (parameter is size of each axis)
var axesHelper = new THREE.AxesHelper(100);
scene.add(axesHelper);

// create the ground plane
var planeGeometry = new THREE.PlaneGeometry(1000, 1000,50, 50);
planeGeometry.translate(0.0, 0.0, 0.0); // To avoid conflict with the axeshelper
var planeMaterial = new THREE.MeshBasicMaterial({
    color: "rgba(150, 150, 150)",
    side: THREE.DoubleSide,
    wireframe: true
});

//Plano
var plane = new THREE.Mesh(planeGeometry, planeMaterial);
// add the plane to the scene
scene.add(plane);

var cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
var cubeMaterial = new THREE.MeshNormalMaterial();
var i=0;
for(i=-100;i<100;i+=6) {
    var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    // position the cube
    cube.position.set(i, i*4, 2.0);
    // add the cube to the scene
    scene.add(cube);
}


/////// Funções ///////
var clock = new THREE.Clock();
function mover() {

    keyboard.update();
    

    var speed = 10; // px/s
    var speedRot = THREE.Math.degToRad(45);
    var  delta = clock.getDelta();
    var moveDistance = speed * delta;
  
    if ( keyboard.pressed("up") )   cameraHolder.rotateX( -speedRot * delta);
    if ( keyboard.pressed("down") )   cameraHolder.rotateX( speedRot * delta);
    if ( keyboard.pressed("right") )  cameraHolder.rotateY( -speedRot * delta);
    if ( keyboard.pressed("left") )  cameraHolder.rotateY( speedRot * delta);
    if ( keyboard.pressed(".") )     cameraHolder.rotateZ( speedRot * delta);
    if ( keyboard.pressed(",") )   cameraHolder.rotateZ( -speedRot * delta);
    if ( keyboard.pressed("space"))    cameraHolder.translateZ(-moveDistance);

   
}
/////////// Main Loop ///////////

const render = function () {
    requestAnimationFrame(render);
    // keyboard.update();
    mover();
    //console.log('teste tecla A', keyboard.down("A"));
    renderer.render(scene, camera);
};

render();