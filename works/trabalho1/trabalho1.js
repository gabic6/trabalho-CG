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
  createGroundPlaneWired,
  radiansToDegrees
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
trackballControls.enabled = false;
initDefaultBasicLight(scene);
var modoInspecaoAtivo = false;
var cameraPilotoAtiva = false;
var keyboard = new KeyboardState();
var clock = new THREE.Clock();

/////////// Câmera simulação //////////////////
var cameraSimula = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
cameraSimula.lookAt(0, 0, 0);
cameraSimula.position.set(0.0, 0.0, -1.0);
// cameraSimula.up.set(1, 0, 0);

//Adiciona a câmera ao holder dela
var cameraSimulaHolder = new THREE.Object3D();
cameraSimulaHolder.add(cameraSimula);
// cameraSimulaHolder.position.set(10, -20, 0);
cameraSimulaHolder.rotateY(degreesToRadians(180));
cameraSimulaHolder.rotateX(degreesToRadians(-15));

//Adiciona o holder a um outro holder pra poder posicionar a câmera atrás do avião
var cameraSimulaHolderHolder = new THREE.Object3D();
cameraSimulaHolderHolder.add(cameraSimulaHolder);

scene.add(cameraSimulaHolderHolder);



/////////// Câmera da Piloto //////////////////
var cameraPiloto = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
cameraPiloto.lookAt(0, 0, 1);
cameraPiloto.position.set(0.0, 2.0, 0.0);
// cameraPiloto.up.set(1, 0, 0);

/////////// Câmera Teste //////////////////
// var cameraTeste= new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
// cameraTeste.lookAt(0, 0, 0);
// cameraTeste.position.set(0.0, 200.0, 0.0);
// cameraTeste.up.set(0, 0, 0);
// cameraTeste.rotation.set(-Math.PI/2,0,0);

///////////Mostrar axis////////////////
// Show world axes
var axesHelper = new THREE.AxesHelper(200);


////////////// Objetos /////////////////////
//Plano
// create the ground plane
var planeGeometry = createGroundPlaneWired(5000, 5000, 100, 100, 'green');
scene.add(planeGeometry);
scene.add(axesHelper);


// Cubos de debug
var cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
var cubeMaterial = new THREE.MeshNormalMaterial();
var i = 0;
for (i = -100; i < 100; i += 6) {
  var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
  // position the cube
  cube.position.set(i, 2.0, i * 4);
  // add the cube to the scene
  scene.add(cube);
}



//////////// Avião////////////////

var posicaoAviaoSalva = new THREE.Vector3();
var rotacaoAviaoSalva = new THREE.Vector3();
var velocidadeSalva = 0;
// var rotacaoZSalva = 0;
// var rotacaoXSalva = 0;
// var rotacaoYSalva = 0;

// Obtem o avião do arquivo separado
var { aviaoHolder, eixo_helice, curvatura_asa } = aviao();

// Adiciona o avião na cena e o posiciona
scene.add(aviaoHolder);
//scene.add(curvatura_asa);
aviaoHolder.position.set(0.0, 20.0, 0.0);

// Adiciona a câmera com a visão do piloto do avião (isso é um extra)
aviaoHolder.add(cameraPiloto);

// Define a posição da câmera em relação ao centróide do avião
var cameraPosition = new THREE.Vector3(0.0, 8.0, -20.0);
// aviaoHolder.add(cameraSimulaHolder);
//var aviaoCamera = new THREE.Object3D();
// scene.add(aviaoCamera);
// aviaoCamera.add(aviaoHolder);
// aviaoCamera.add(cameraSimulaHolder);
//cameraSimulaHolder.rotateX(degreesToRadians(90));
//cameraSimula.lookAt(aviaoHolder.position);
///////////// Câmera de inspeção /////////////////////

function alternaModo() {
  keyboard.update();

  if (keyboard.down("space")) {
    modoInspecaoAtivo = !modoInspecaoAtivo;

    //Esconde o plano no modo inspeção
    planeGeometry.visible = modoInspecaoAtivo === false;
    if (modoInspecaoAtivo) {
      trackballControls.enabled = true;
      // Aqui salva a posição
      posicaoAviaoSalva = aviaoHolder.position.clone();
      rotacaoAviaoSalva = aviaoHolder.rotation.clone();
      // rotacaoZSalva = rotacaoZ;
      // rotacaoXSalva = rotacaoX;

      // Aqui zera tudo pro modo inspeção
      aviaoHolder.position.set(0.0, 0.0, 0.0);
      aviaoHolder.rotation.set(0.0, 0.0, 0.0);

    } else {
      trackballControls.enabled = false;
      aviaoHolder.position.copy(posicaoAviaoSalva);
      aviaoHolder.rotation.copy(rotacaoAviaoSalva);

      // Aqui restaura a posição salva
      //posicaoAviao.copy(posicaoAviaoSalva);
      //velocidadeAviao.copy(velocidadeAviaoSalva);
      //rotacaoZ = rotacaoZSalva;
      //rotacaoX = rotacaoXSalva;
    }

  }

  if (keyboard.down("C")) {
    cameraPilotoAtiva = !cameraPilotoAtiva;
  }
  // aviaoHolder.add(cameraSimulaHolder);

  //cameraSimulaHolder.position.set(
  //  cameraPosition.x,
  //  cameraPosition.y,
  //   cameraPosition.z);

  // cameraSimulaHolder.rotateX(degreesToRadians(45));
  //Posição da câmera
  // cameraSimulaHolder.lookAt(aviaoHolder);


  // cameraSimulaHolderHolder.position.set(
  //   aviaoHolder.position.x + cameraPosition.x,
  //   aviaoHolder.position.y + cameraPosition.y,
  //   aviaoHolder.position.z + cameraPosition.z
  // );
  
  cameraSimulaHolderHolder.position.set(
    aviaoHolder.position.x,
    aviaoHolder.position.y,
    aviaoHolder.position.z
  );

  cameraSimulaHolder.position.set(
      cameraPosition.x,
      cameraPosition.y,
      cameraPosition.z
    );

  cameraSimulaHolderHolder.rotation.y = aviaoHolder.rotation.y ;//+ degreesToRadians(180);

  //cameraSimula.position.z = aviaoHolder.position.z;
  //cameraSimula.lookAt(aviaoHolder.position);
  // Roda a helice
  if (!modoInspecaoAtivo) {
    eixo_helice.rotateY(5);
  }
}

///////////// Movimentação /////////////////////
var delta = clock.getDelta();
var speedRot = THREE.Math.degToRad(45);
var speed = 10; // px/s
var aceleracao = 10;
var velocidadeMaxima = 63;
var maxangle = degreesToRadians(45);

function movimentaAviao() {


  if (keyboard.pressed("up")) {
    aviaoHolder.rotateX(speedRot * delta);
  } else if (keyboard.pressed("down")) {
    aviaoHolder.rotateX(-speedRot * delta);
  } else {
    //volta o valor de x pra zero
    let rx = Math.round(aviaoHolder.rotation.x * 1000) / 1000;
    if (rx > 0) {
      aviaoHolder.rotateX(-speedRot * delta * 0.5);
    } else if (rx < 0) {
      aviaoHolder.rotateX(speedRot * delta * 0.5);
    } else {
      aviaoHolder.rotation.x = 0;
    }
  }

  // Testa se a rotação no eixo X saiu do limite + ou -, se saiu ele impede de rodar mais
  if (aviaoHolder.rotation.x >= maxangle) {
    aviaoHolder.rotation.x = maxangle;
  } else if (aviaoHolder.rotation.x <= -maxangle) {
    aviaoHolder.rotation.x = -maxangle;
  }

  console.log('aviaoHolder.rotation.y', aviaoHolder.rotation.y, degreesToRadians(90));

  if (keyboard.pressed("right")) {
    aviaoHolder.rotateZ(speedRot * delta);
  } else if (keyboard.pressed("left")) {
    aviaoHolder.rotateZ(-speedRot * delta);
  } else {
    //volta o valor de x pra zero
    let rz = Math.round(aviaoHolder.rotation.z * 1000) / 1000;
    if (rz > 0) {
      aviaoHolder.rotateZ(-speedRot * delta * 0.5);
    } else if (rz < 0) {
      aviaoHolder.rotateZ(speedRot * delta * 0.5);
    }
  }

  // Testa se a rotação no eixo X saiu do limite + ou -, se saiu ele impede de rodar mais
  if (aviaoHolder.rotation.z >= maxangle) {
    aviaoHolder.rotation.z = maxangle;
  } else if (aviaoHolder.rotation.z <= -maxangle) {
    aviaoHolder.rotation.z = -maxangle;
  }

  let forcaEmpuxo = -20;
  aviaoHolder.position.x += forcaEmpuxo * Math.sin(aviaoHolder.rotation.z) * delta;
  aviaoHolder.rotateY(aviaoHolder.rotation.z * -0.2 * delta);
  /*
    
  
    //var rotY = new THREE.Vector3(0.0, aviaoHolder.position.y, 0.0);
    var rotY = new THREE.Vector3(0.0, 1.0, 0.0);
  
    if (keyboard.pressed("right")) {
      //aviaoHolder.rotateZ(speedRot * delta);
      console.log(aviaoHolder.rotation.z);
      
      //aviaoCamera.rotateY(-speedRot * delta);
      aviaoCamera.rotateY(-speedRot * delta);
      //aviaoCamera.rotateOnAxis( rotY, -speedRot * delta * 0.5);
      if(aviaoHolder.rotation.z>=maxangle){
        aviaoHolder.rotation.z=maxangle;
      }
      // cameraSimulaHolder.rotateY(-speedRot * delta);
    } else if (keyboard.pressed("left")) {
      //aviaoHolder.rotateZ(-speedRot * delta);
      //aviaoCamera.rotateY(speedRot * delta);
      aviaoCamera.rotateY(speedRot * delta);
      //aviaoCamera.rotateOnAxis( rotY, speedRot * delta * 0.5);
      // cameraSimulaHolder.rotateY(-degreesToRadians(-speedRot * delta));
      if(aviaoHolder.rotation.z<-maxangle){
        aviaoHolder.rotation.z=-maxangle;
        console.log(aviaoHolder.rotation.z);
      }
    } else {
      //volta o valor de z pra zero
      if(aviaoHolder.rotation.z > 0){
        //aviaoHolder.rotateZ(-speedRot * delta);
      } else if(aviaoHolder.rotation.z < 0){
        //aviaoHolder.rotateZ(speedRot * delta);
      }
  
      //volta o valor de y pra zero
      if(aviaoHolder.rotation.y > 0){
        //aviaoHolder.rotateY(-speedRot * delta);
      } else if(aviaoHolder.rotation.y < 0){
        //aviaoHolder.rotateY(degreesToRadians(speedRot * delta));
      }
    }
  
    */

  if (keyboard.pressed("Q")) {
    speed += aceleracao * delta;
    if (speed > velocidadeMaxima) {
      speed = velocidadeMaxima;
    }
  }
  if (keyboard.pressed("A")) {
    speed -= aceleracao * delta;
    if (speed < 0) {
      speed = 0;
    }
  }
  aviaoHolder.translateZ(speed * delta);

  

}


/////// Funções ///////
//var clock = new THREE.Clock();
function mover() {

  //keyboard.update();


  var speed = 10; // px/s
  var speedRot = THREE.Math.degToRad(45);
  //var  delta = clock.getDelta();
  var moveDistance = speed * delta;
  var rotation = speedRot * delta;

  if (keyboard.pressed("up")) aviaoHolder.rotateX(-rotation);
  if (keyboard.pressed("down")) aviaoHolder.rotateX(rotation);
  if (keyboard.pressed("right")) aviaoHolder.rotateY(-rotation);
  if (keyboard.pressed("left")) aviaoHolder.rotateY(rotation);
  if (keyboard.pressed(".")) aviaoHolder.rotateZ(rotation);
  if (keyboard.pressed(",")) aviaoHolder.rotateZ(-rotation);
    /*if ( keyboard.pressed("W"))*/    aviaoHolder.translateZ(moveDistance);


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

  trackballControls.update();
  requestAnimationFrame(render);
  delta = clock.getDelta();

  if (!modoInspecaoAtivo) {
    movimentaAviao();
    //mover();
  }

  alternaModo();

  if (modoInspecaoAtivo) {
    renderer.render(scene, camera) // Render scene
  } else if (cameraPilotoAtiva) {
    renderer.render(scene, cameraPiloto) // Render scene
  } else {
    renderer.render(scene, cameraSimula) // Render scene
  }
}