import * as THREE from '../build/three.module.js';
import Stats from '../build/jsm/libs/stats.module.js';
import { GUI } from '../build/jsm/libs/dat.gui.module.js';
import { TrackballControls } from '../build/jsm/controls/TrackballControls.js';
import { TeapotGeometry } from '../build/jsm/geometries/TeapotGeometry.js';
import {
    initRenderer,
    createGroundPlane,
    createLightSphere,
    onWindowResize,
    degreesToRadians,
    initCamera,
    initDefaultSpotlight
} from "../libs/util/util.js";



//Cena, câmera, luz ambiente e window
var scene = new THREE.Scene();

var stats = new Stats();
var renderer = initRenderer();
renderer.setClearColor("rgb(30, 30, 42)");

var camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 10000);
  camera.lookAt(0, 0, 0);
  camera.position.set(0.1, 3.0, 0.1);
  camera.up.set( 0, 1, 0 );


var ambientLight = new THREE.AmbientLight("white");
scene.add(ambientLight);
var light = initDefaultSpotlight(scene, new THREE.Vector3(0, 0, 0));
scene.add(light);
  
// Enable mouse rotation, pan, zoom etc.
var trackballControls = new TrackballControls(camera, renderer.domElement);


// Listen window size changes
window.addEventListener('resize', function () { onWindowResize(camera, renderer) }, false);

// Show axes (parameter is size of each axis)
var axesHelper = new THREE.AxesHelper(12.0);
axesHelper.visible = true;
scene.add(axesHelper);

//////////////Objetos//////////
///Textura
var textureLoader = new THREE.TextureLoader();
var wood  = textureLoader.load('../assets/textures/wood.png');

// Cilindro
var cubeSize = 0.6;
var cylinderGeometry = new THREE.CylinderGeometry(cubeSize,cubeSize,cubeSize*2,32,32,true);
var cylinderMaterial=[
    new THREE.MeshLambertMaterial({map:wood, side:THREE.DoubleSide})
];
var cylinder = new THREE.Mesh(cylinderGeometry,cylinderMaterial);
cylinder.castShadow = true;
cylinder.position.set(0.0, 0.0, 0.0);
scene.add(cylinder);

//Círculo

var wood2  = textureLoader.load('../assets/textures/woodtop.png');
var circleGeo = new THREE.CircleGeometry(cubeSize,64);
var materialCircle = new THREE.MeshLambertMaterial({side: THREE.DoubleSide, map:wood2});
var circleUp = new THREE.Mesh(circleGeo,materialCircle);
circleUp.castShadow=true;
circleUp.position.set(0.0,cubeSize,0.0);
circleUp.rotateX(degreesToRadians(90));
scene.add(circleUp); 

var circleDown = circleUp.clone();
circleDown.castShadow=true;
circleDown.position.set(0.0,-cubeSize,0.0);
scene.add(circleDown); 

////////////////Funções///////////////
render();


function render() {
    stats.update();
    trackballControls.update();
    // rotateLight();
    requestAnimationFrame(render);
    renderer.render(scene, camera)
}
