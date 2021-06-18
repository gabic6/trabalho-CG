import * as THREE from '../../build/three.module.js';
import Stats from '../../build/jsm/libs/stats.module.js';
import { GUI } from '../../build/jsm/libs/dat.gui.module.js';
import { TrackballControls } from '../../build/jsm/controls/TrackballControls.js';
import {
  initRenderer,
  initCamera,
  degreesToRadians,
  onWindowResize,
  initDefaultBasicLight,
  createGroundPlaneWired
} from "../../libs/util/util.js";
import * as TWEEN from "../../libs/other/tween.js/dist/tween.esm.js";
import KeyboardState from '../../libs/util/KeyboardState.js';
import aviao from './aviao.js';



////////// Coisas da cena, como renderização, camera/////////////////////

var stats = new Stats();          // To show FPS information
var scene = new THREE.Scene();    // Create main scene
var renderer = initRenderer();    // View function in util/utils
var camera = initCamera(new THREE.Vector3(5, 5, 30)); // Init camera in this position
var trackballControls = new TrackballControls(camera, renderer.domElement);
initDefaultBasicLight(scene);
var modoInspecaoAtivo = false;
var keyboard = new KeyboardState();
var clock = new THREE.Clock();

/////////// Câmera simulação //////////////////
var cameraSimula = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
cameraSimula.lookAt(0, 0, 0);
cameraSimula.position.set(0.0, 0.0, -1.0);
// cameraSimula.up.set(1, 0, 0);

var cameraSimulaHolder = new THREE.Object3D();
cameraSimulaHolder.add(cameraSimula);
// cameraSimulaHolder.position.set(10, -20, 0);
cameraSimulaHolder.rotateY(degreesToRadians(180));
cameraSimulaHolder.rotateX(degreesToRadians(-15));
scene.add(cameraSimulaHolder);

///////////Mostrar axis////////////////
// Show world axes
var axesHelper = new THREE.AxesHelper(200);


////////////// Objetos /////////////////////
//Plano
// create the ground plane
var planeGeometry = createGroundPlaneWired(5000, 5000, 10, 10, 'green');
// planeGeometry.translate(0.0, 0.0, 0.0); // To avoid conflict with the axeshelper 
//planeGeometry.rotateX(Math.PI/2);
scene.add(planeGeometry);
scene.add(axesHelper);

// //// cubo de debug /////
// var cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
// var cubeMaterial = new THREE.MeshNormalMaterial();
// var debugCube = new THREE.Mesh(cubeGeometry, cubeMaterial);

// debugCube.add(axesHelper)

// // add the cube to the scene
// scene.add(debugCube);

//////////// Avião////////////////

var posicaoAviao = new THREE.Vector3(0.0, 8.0, 0.0);
var velocidadeAviao = new THREE.Vector3(0.0, 0.0, 62.0); //62 m/s é a velocidade real de um avião
var rotacaoZ = 0;
var rotacaoY = 0;
var rotacaoX = 0;

var posicaoAviaoSalva = new THREE.Vector3();
var velocidadeAviaoSalva = new THREE.Vector3(0.0, 0.0, 0.0);
var rotacaoZSalva = 0;
var rotacaoXSalva = 0;

var { aviaoHolder, eixo_helice } = aviao();
scene.add(aviaoHolder);

var cameraPosition = new THREE.Vector3(0.0, 8.0, -20.0);

function setPosicaoAviao() {
  // Reseta as matrizes do avião 
  aviaoHolder.matrixAutoUpdate = false;
  var mat4 = new THREE.Matrix4();
  aviaoHolder.matrix.identity();

  // Define a posição e rotações do avião
  aviaoHolder.matrix.multiply(mat4.makeTranslation(posicaoAviao.x, posicaoAviao.y, posicaoAviao.z));
  aviaoHolder.matrix.multiply(mat4.makeRotationZ(degreesToRadians(rotacaoZ))); // R1 y
  aviaoHolder.matrix.multiply(mat4.makeRotationY(degreesToRadians(rotacaoY))); // R1 y
  aviaoHolder.matrix.multiply(mat4.makeRotationX(degreesToRadians(rotacaoX))); // R1 y

  // Posição da câmera
  cameraSimulaHolder.position.set(
    posicaoAviao.x + cameraPosition.x, 
    posicaoAviao.y + cameraPosition.y, 
    posicaoAviao.z + cameraPosition.z
  );

  // Roda a helice
  if (!modoInspecaoAtivo) {
    eixo_helice.rotateY(5);
  }

  // debugCube.matrixAutoUpdate = false;
  // var mat4 = new THREE.Matrix4();
  // debugCube.matrix.identity();
  // debugCube.matrix.multiply(mat4.makeTranslation(
  //   posicaoAviao.x + cameraPosition.x, 
  //   posicaoAviao.y + cameraPosition.y, 
  //   posicaoAviao.z + cameraPosition.z
  // ));
  // debugCube.matrix.multiply(mat4.makeRotationZ(cameraSimulaHolder.rotation.z)); // R1 y
  // debugCube.matrix.multiply(mat4.makeRotationY(cameraSimulaHolder.rotation.y)); // R1 y
  // debugCube.matrix.multiply(mat4.makeRotationX(cameraSimulaHolder.rotation.x)); // R1 y
}

///////////// Câmera de inspeção /////////////////////

function alternaModo() {
  keyboard.update();

  if (keyboard.down("space")) {
    modoInspecaoAtivo = !modoInspecaoAtivo;

    //Esconde o plano no modo inspeção
    planeGeometry.visible = modoInspecaoAtivo === false;
    if (modoInspecaoAtivo) {
      // Aqui salva a posição
      posicaoAviaoSalva = posicaoAviao.clone();
      velocidadeAviaoSalva = velocidadeAviao.clone();
      rotacaoZSalva = rotacaoZ;
      rotacaoXSalva = rotacaoX;

      // Aqui zera tudo pro modo inspeção
      posicaoAviao = new THREE.Vector3(0.0, 0.0, 0.0);
      rotacaoZ = 0.0;
      rotacaoX = 0.0;
    } else {
      // Aqui restaura a posição salva
      posicaoAviao.copy(posicaoAviaoSalva);
      velocidadeAviao.copy(velocidadeAviaoSalva);
      rotacaoZ = rotacaoZSalva;
      rotacaoX = rotacaoXSalva;
    }

  }

  setPosicaoAviao();
}

///////////// Movimentação /////////////////////
var delta = clock.getDelta();
var speedRot = THREE.Math.degToRad(180);
function movimentaAviao() {
  
  //console.log('delta', delta, 'speedRot', speedRot);

  // if (keyboard.pressed("W")) {
  //   posicaoAviao.z += 0.1;
  // }
  // if (keyboard.pressed("S")) {
  //   posicaoAviao.z += -0.1;
  // }
  // if (keyboard.pressed("A")) {
  //   posicaoAviao.x += 0.1;
  // }
  // if (keyboard.pressed("D")) {
  //   posicaoAviao.x += -0.1;
  // }

  // posicaoAviao.x += velocidadeAviao.x * delta
  // posicaoAviao.y += velocidadeAviao.y * delta
   posicaoAviao.z += velocidadeAviao.z * delta

  // if ( keyboard.pressed("up") ){
  //   console.log('teste up')
  //   aviaoHolder.rotateX( -speedRot * delta);
  // }  
  // if ( keyboard.pressed("down") ){
  //   aviaoHolder.rotateX( speedRot * delta);
  // }  
  if ( keyboard.pressed("right") ){
    //aviaoHolder.rotateZ( -speedRot * delta);
    rotacaoY -= speedRot * delta;
  }
  if ( keyboard.pressed("left") ){
    //aviaoHolder.rotateZ( speedRot * delta);
    rotacaoY += speedRot * delta;
  }  
  // if ( keyboard.pressed(".") )     cameraHolder.rotateZ( speedRot * delta);
  // if ( keyboard.pressed(",") )   cameraHolder.rotateZ( -speedRot * delta);
  // if ( keyboard.pressed("space"))    cameraHolder.translateZ(-moveDistance);

  
}

//////////// Listen window size changes e render///////////////////
window.addEventListener('resize', function () {
  if (modoInspecaoAtivo) {
    onWindowResize(camera, renderer);
  } else {
    onWindowResize(cameraSimula, renderer);
  }
}, false);
render();

function render() {
  stats.update(); // Update FPS
  if (modoInspecaoAtivo) {
    trackballControls.update();
  }

  requestAnimationFrame(render);
  delta = clock.getDelta();

  if (!modoInspecaoAtivo) {
    movimentaAviao();
  }

  alternaModo();

  if (modoInspecaoAtivo) {
    renderer.render(scene, camera) // Render scene
  } else {
    renderer.render(scene, cameraSimula) // Render scene
  }
}