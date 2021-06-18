import * as THREE from  '../build/three.module.js';
import Stats from       '../build/jsm/libs/stats.module.js';
import {GUI} from       '../build/jsm/libs/dat.gui.module.js';
import {TrackballControls} from '../build/jsm/controls/TrackballControls.js';
import {initRenderer, 
        initCamera, 
        degreesToRadians, 
        onWindowResize,
        initDefaultBasicLight} from "../libs/util/util.js";
import * as TWEEN from "../libs/other/tween.js/dist/tween.esm.js";


////////// Coisas da cena, como renderização, camera/////////////////////

var stats = new Stats();          // To show FPS information
var scene = new THREE.Scene();    // Create main scene
var renderer = initRenderer();    // View function in util/utils
var camera = initCamera(new THREE.Vector3(0, -30, 15)); // Init camera in this position
var trackballControls = new TrackballControls( camera, renderer.domElement );
initDefaultBasicLight(scene);

///////////Mostrar axis////////////////
// Show world axes
var axesHelper = new THREE.AxesHelper( 12 );
scene.add( axesHelper );

////////////// Geometria /////////////////////
//Plano
// create the ground plane
var planeGeometry = new THREE.PlaneGeometry(25, 25);
planeGeometry.translate(0.0, 0.0, 0.0); // To avoid conflict with the axeshelper
var planeMaterial = new THREE.MeshBasicMaterial({
    color: "rgb(150, 150, 150)",
    side: THREE.DoubleSide
});
var plane = new THREE.Mesh(planeGeometry, planeMaterial);
// add the plane to the scene
scene.add(plane);

// Esfera
// Base sphere
var sphereGeometry = new THREE.SphereGeometry(1,12,12);
var sphereMaterial = new THREE.MeshPhongMaterial( {color:'red'} );
var esfera = new THREE.Mesh( sphereGeometry, sphereMaterial );
esfera.position.set(0.0, 0.0, 1.0);
scene.add(esfera);

// var esfera2 = new THREE.Mesh( sphereGeometry, sphereMaterial );
// esfera2.position.set(-4.0, 8.0, 1.0);
// scene.add(esfera2);

// Listen window size changes
window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );

buildInterface();
render();


function RodarEsfera()
{
  if(mover)
  {
    
    var target = { x : coordX, y: coordY, z:coordZ};
    console.log(target);
    var position= {x:esfera.position.x, y:esfera.position.y, z:esfera.position.z};
    var tween = new TWEEN.Tween(position).to(target, 2000);
    tween.delay(500);
    // tween.easing(TWEEN.Easing.Elastic.InOut);
    tween.easing(TWEEN.Easing.Quadratic.In);
    tween.start();

    const updateFunc = function (object) {
      esfera.matrixAutoUpdate = false;
      var mat4 = new THREE.Matrix4();
      esfera.matrix.identity();
      esfera.matrix.multiply(mat4.makeTranslation(object.x,object.y,object.z));
      esfera.position.x = object.x;
      esfera.position.y = object.y;
      esfera.position.z = object.z;
    }
    
    tween.onUpdate(updateFunc);
    console.log(esfera.position.x);
    console.log(esfera.position.y);
    console.log(esfera.position.z);
    mover=false;
  }
}
var coordX=0.0;
var coordY=0.0;
var coordZ=1.0;
var mover = false;
// var position=esfera.position;
// var tween = new TWEEN.TWEEN(position);
// var position = esfera.position;
// var target = { x : coordX, y: coordY, z:coordZ};
function buildInterface()
{
  var controls = new function ()
  {
    // this.onChangeAnimation = function(){
    //   animationOn = !animationOn;
    // };
    this.move = function(){
        mover = !mover;
        RodarEsfera();
    }
    this.coordX = 0.0;
    this.coordY = 0.0;
    this.coordZ = 0.0;

    this.mudarX = function(){
      coordX = this.coordX;
    };
    this.mudarY = function(){
        coordY = this.coordY;
    };
    this.mudarZ = function(){
        coordZ = this.coordZ;
    };
    // this.onUpdate=function(){
    //   tween.position.x = esfera.x;
    //   tween.position.y = esfera.y;
    //   tween.position.z = esfera.z;
    // };
    
  };

  // GUI interface
  var gui = new GUI();
//   gui.add(controls, 'onChangeAnimation',true).name("Mover");
  gui.add(controls, 'move',true).name("Mover");
  gui.add(controls, 'coordX', -11,11 )
    .onChange(function(e) { controls.mudarX() })
    .name("Posição X");
  gui.add(controls, 'coordY', -11,11 )
    .onChange(function(e) { controls.mudarY()})
    .name("Posição Y");
  gui.add(controls, 'coordZ', -11,11 )
    .onChange(function(e) { controls.mudarZ()})
    .name("Posição Z");

}

function render()
{
  stats.update(); // Update FPS
  trackballControls.update();
  // rotateCylinder();
  requestAnimationFrame(render);

  TWEEN.update();
  renderer.render(scene, camera) // Render scene
}