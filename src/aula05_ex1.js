import * as THREE from  '../build/three.module.js';
import Stats from       '../build/jsm/libs/stats.module.js';
import {GUI} from       '../build/jsm/libs/dat.gui.module.js';
import {TrackballControls} from '../build/jsm/controls/TrackballControls.js';
import {initRenderer, 
        initCamera, 
        degreesToRadians, 
        onWindowResize,
        initDefaultBasicLight} from "../libs/util/util.js";

////////// Coisas da cena, como renderização, camera/////////////////////

var stats = new Stats();          // To show FPS information
var scene = new THREE.Scene();    // Create main scene
var renderer = initRenderer();    // View function in util/utils
var camera = initCamera(new THREE.Vector3(5, 5, 7)); // Init camera in this position
var trackballControls = new TrackballControls( camera, renderer.domElement );
initDefaultBasicLight(scene);


//////////////Animação e ângulos////////////////
// Set angles of rotation
var angle = 0;
var angle2 = 0;
var angleCil =0;
var speed = 0.05;
var animationOn = true; // control if animation is on or of

///////////Mostrar axis////////////////
// Show world axes
var axesHelper = new THREE.AxesHelper( 12 );
scene.add( axesHelper );


////////////// Geomatrias e sólidos////////////////
// Base sphere
var sphereGeometry = new THREE.SphereGeometry(0.2, 32, 32);
var sphereMaterial = new THREE.MeshPhongMaterial( {color:'rgb(180,180,255)'} );
var sphere = new THREE.Mesh( sphereGeometry, sphereMaterial );
scene.add(sphere);
// Set initial position of the sphere
sphere.translateX(1.0).translateY(1.0).translateZ(1.0);

// More information about cylinderGeometry here ---> https://threejs.org/docs/#api/en/geometries/CylinderGeometry
var cylinderGeometry = new THREE.CylinderGeometry(0.1, 0.1, 2.0, 25);
var cylinderMaterial = new THREE.MeshPhongMaterial( {color:'rgb(100,255,100)'} );
var cylinder = new THREE.Mesh( cylinderGeometry, cylinderMaterial );
sphere.add(cylinder);

// Rede cylinder
var cylinderGeometry2 = new THREE.CylinderGeometry(0.07, 0.07, 1.0, 25);
var cylinderMaterial2 = new THREE.MeshPhongMaterial( {color:'rgb(255,100,100)'} );
var cylinder2 = new THREE.Mesh( cylinderGeometry2, cylinderMaterial2 );
cylinder.add(cylinder2);

//Cilindros um de cada lado
// Rede cylinder
var cilindro3Formato = new THREE.CylinderGeometry(0.07, 0.07, 1.0, 25);
var materialCilindro3 = new THREE.MeshPhongMaterial( {color:'yellow'} );
var cilindro3 = new THREE.Mesh( cilindro3Formato, materialCilindro3 );
cylinder2.add(cilindro3);
// Rede cylinder
var cilindro4Formato = new THREE.CylinderGeometry(0.07, 0.07, 1.0, 25);
var materialCilindro4 = new THREE.MeshPhongMaterial( {color:'yellow'} );
var cilindro4 = new THREE.Mesh( cilindro4Formato, materialCilindro4 );
cylinder2.add(cilindro4);


// Listen window size changes
window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );

buildInterface();
render();

function rotateCylinder()
{
  // More info:
  // https://threejs.org/docs/#manual/en/introduction/Matrix-transformations
  cylinder.matrixAutoUpdate = false;
  cylinder2.matrixAutoUpdate = false;
  cilindro3.matrixAutoUpdate = false;
  cilindro4.matrixAutoUpdate = false;

  // Set angle's animation speed
  if(animationOn)
  {
    angle+=speed;
    angle2+=speed*2;
    // angleCil+=speed;
    
    var mat4 = new THREE.Matrix4();
    cylinder.matrix.identity();  // reset matrix
    cylinder2.matrix.identity();  // reset
    cilindro3.matrix.identity();
    cilindro4.matrix.identity();

    // Will execute T1 and then R1
    cylinder.matrix.multiply(mat4.makeRotationZ(angle)); // R1
    cylinder.matrix.multiply(mat4.makeTranslation(0.0, 1.0, 0.0)); // T1

    // Will execute R2, T1 and R1 in this order
    cylinder2.matrix.multiply(mat4.makeRotationY(angle2)); // R1
    cylinder2.matrix.multiply(mat4.makeTranslation(0.0, 1.0, 0.0)); // T1
    cylinder2.matrix.multiply(mat4.makeRotationX(degreesToRadians(90))); // R2

    // Will execute R2, T1 and R1 in this order
    
    cilindro3.matrix.multiply(mat4.makeRotationY(angle2)); // R1
    cilindro3.matrix.multiply(mat4.makeTranslation(0.0, 0.55, 0.0)); // T1
    cilindro3.matrix.multiply(mat4.makeRotationX(degreesToRadians(90))); // R2
    

    // Will execute R2, T1 and R1 in this order
    cilindro4.matrix.multiply(mat4.makeRotationY(-angle)); // R1
    cilindro4.matrix.multiply(mat4.makeTranslation(0.0, -0.55, 0.0)); // T1
    cilindro4.matrix.multiply(mat4.makeRotationX(degreesToRadians(-90))); // R2
  }
}

function buildInterface()
{
  var controls = new function ()
  {
    this.onChangeAnimation = function(){
      animationOn = !animationOn;
    };
    this.speed = 0.05;

    this.changeSpeed = function(){
      speed = this.speed;
    };
  };

  // GUI interface
  var gui = new GUI();
  gui.add(controls, 'onChangeAnimation',true).name("Animation On/Off");
  gui.add(controls, 'speed', 0.05, 0.5)
    .onChange(function(e) { controls.changeSpeed() })
    .name("Change Speed");
}

function render()
{
  stats.update(); // Update FPS
  trackballControls.update();
  rotateCylinder();
  requestAnimationFrame(render);
  renderer.render(scene, camera) // Render scene
}