import * as THREE from '../../build/three.module.js';
import Stats from '../../build/jsm/libs/stats.module.js';
import { TrackballControls } from '../../build/jsm/controls/TrackballControls.js';
import {
    InfoBox,
    SecondaryBox,
    initRenderer,
    initCamera,
    degreesToRadians,
    onWindowResize,
    initDefaultBasicLight,
    createGroundPlaneWired,
    createLightSphere

} from "../../libs/util/util.js";
import KeyboardState from '../../libs/util/KeyboardState.js';
import aviao from './aviao.js';
import ambiente from './ambiente.js';

////////// Coisas da cena, como renderização, camera/////////////////////

var stats = new Stats();          // To show FPS information
var scene = new THREE.Scene();    // Create main scene
var renderer = initRenderer();    // View function in util/utils
var camera = initCamera(new THREE.Vector3(5.0, 5.0, 30.0)); // Init camera in this position
var trackballControls = new TrackballControls(camera, renderer.domElement);
trackballControls.enabled = false;
//initDefaultBasicLight(scene);
document.body.appendChild(stats.dom);

/*const light = new THREE.HemisphereLight('rgb(179, 217, 255)', 'rgb(89, 179, 0)', 1);
scene.add(light);*/
const light = new THREE.HemisphereLight('rgb(255, 255, 255)', 'rgb(47, 79, 79)', 0.5);
scene.add(light);
scene.background = new THREE.Color('rgb(179, 217, 255)');

var modoInspecaoAtivo = false;
var cameraPilotoAtiva = false;
var keyboard = new KeyboardState();
var clock = new THREE.Clock();

//////////// Sol ////////////////

// Posição relativa da luz ao avião
var lightHolderPosition = new THREE.Vector3(100.0, 200.0, 0.0);
// Vector que guarda a posição da luz em relação ao mundo
var lightPosition = new THREE.Vector3(0,3,0);
// Cor da luz
var lightColor = "rgb(255,255,255)"; 

//Luz Direcional
var dirLight = new THREE.DirectionalLight(lightColor);
var dirLightHolder = new THREE.Object3D();

//Debug da luz
var lightSphere = createLightSphere(scene, 1.0, 10, 10, lightPosition,lightColor);

function setDirectionalLighting(position)
{
  dirLight.position.copy(position);
  dirLight.shadow.mapSize.width = 1024;
  dirLight.shadow.mapSize.height = 1024;
  dirLight.castShadow = true;
  
  var d = 40;
  dirLight.shadow.camera.near = 1;
  dirLight.shadow.camera.far = 8000;
  dirLight.shadow.camera.left = -d;
  dirLight.shadow.camera.right = d;
  dirLight.shadow.camera.top = d;
  dirLight.shadow.camera.bottom = -d;
//   dirLight.name = "Direction Light";
  dirLight.visible = true;
  dirLight.intensity = 0.5;
  
  dirLight.decay = 1;
  dirLight.penumbra = 0.1;

  dirLight.position.copy(lightHolderPosition);
  lightSphere.position.copy(lightHolderPosition);
  dirLightHolder.add(dirLight);
  dirLightHolder.add(lightSphere);
  scene.add(dirLightHolder);
}

setDirectionalLighting(lightPosition);

function updateLightPosition()
{
    dirLightHolder.position.copy(lightPosition);
    //cube.position.copy(lightPosition);

    //cameraSimulaHolderHolder.rotation.y = rotacaoAviao.y;
}

// ///////////// Cubos de debug ///////////////

// var cubeGeometry = new THREE.BoxGeometry(4.0, 4.0, 4.0);
// var cubeMaterial = new THREE.MeshLambertMaterial();
// var i=0;
// for(i=-4000;i<4000;i+=10) {
//     var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
//     // position the cube
//     cube.position.set(i, 15, i*4.0);
//     // add the cube to the scene
//     cube.castShadow=true;
//     cube.receiveShadow=true;
//     scene.add(cube);
// }

// var cubeGeometry = new THREE.BoxGeometry(1.0, 1.0, 1.0);
// var cubeMaterial = new THREE.MeshLambertMaterial();
// var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
// cube.position.set(15, 5, 15);
// //cube.receiveShadow=true;
// cube.castShadow=true;
// scene.add(cube);

// var planeGeometryGambiarra = new THREE.PlaneGeometry(40, 40, 80, 80);
// planeGeometryGambiarra.translate(0.0, 0.0, 0.02);
// var planeMaterialGambiarra = new THREE.MeshLambertMaterial({
//     color:'rgb(89, 179, 50)',
// });

/////////// Câmera simulação //////////////////

var cameraSimula = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 8000);
cameraSimula.lookAt(0, 0, 0);
cameraSimula.position.set(0.0, 0.0, -0.1);

//Adiciona a câmera ao holder dela
var cameraSimulaHolder = new THREE.Object3D();
cameraSimulaHolder.add(cameraSimula);
cameraSimulaHolder.rotateY(degreesToRadians(180));
cameraSimulaHolder.rotateX(degreesToRadians(-15));

//Adiciona o holder a um outro holder pra poder posicionar a câmera atrás do avião
var cameraSimulaHolderHolder = new THREE.Object3D();
cameraSimulaHolderHolder.add(cameraSimulaHolder);
scene.add(cameraSimulaHolderHolder);

/////////// Câmera do Piloto //////////////////

var cameraPiloto = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 8000);
cameraPiloto.lookAt(0, 0, 0.1);
cameraPiloto.position.set(0.0, 1.3, -1.8);

///////////Mostrar axis////////////////

// Show world axes
var axesHelper = new THREE.AxesHelper(200);

////////////// Objetos /////////////////////

// create the ground plane
// var planeGeometry = createGroundPlaneWired(8000, 8000, 200, 200, 'green');
// scene.add(planeGeometry);
scene.add(axesHelper);
var planeGeometry = new THREE.PlaneGeometry(8000, 8000, 800, 800);
planeGeometry.translate(0.0, 0.0, 0.0);
var planeMaterial = new THREE.MeshLambertMaterial({
    color:'rgb(89, 179, 0)',
    //  "rgb(150, 150, 150)"
    //side: THREE.DoubleSide
});
var plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotateX(degreesToRadians(-90));
plane.receiveShadow = true;
scene.add(plane);

// Adiciona os meshes do ambiente (arvores e montanhas)
let meshes = ambiente();
for(let i=0; i<meshes.length; i++){
    scene.add(meshes[i]);
}

//////////// Avião ////////////////

var posicaoAviaoSalva = new THREE.Vector3();
var rotacaoAviaoSalva = new THREE.Vector3();
var rotacaoAviao = new THREE.Vector3();

// Obtem o avião do arquivo separado
var { aviaoHolder, eixo_helice } = aviao();

// Adiciona o avião na cena e o posiciona
scene.add(aviaoHolder);
aviaoHolder.position.set(0.0, 20.0, 0.0);

// Define que a luz direcional vai iluminar o avião
dirLight.target = aviaoHolder;

// Adiciona a câmera com a visão do piloto do avião (isso é um extra)
aviaoHolder.add(cameraPiloto);

// Define a posição da câmera em relação ao centróide do avião
var cameraPosition = new THREE.Vector3(0.0, 8.0, -20.0);

///////////// Modos de câmera /////////////////////

function alternaModo() {
    //keyboard.update();

    // Alterna entre modo inspeção e simulação
    if (keyboard.down("space")) {
        modoInspecaoAtivo = !modoInspecaoAtivo;

        //Esconde o plano no modo inspeção
        plane.visible = modoInspecaoAtivo === false;

        if (modoInspecaoAtivo) {
            trackballControls.enabled = true;

            // Aqui salva a posição
            posicaoAviaoSalva = aviaoHolder.position.clone();
            rotacaoAviaoSalva = rotacaoAviao.clone();

            // Aqui zera tudo pro modo inspeção
            aviaoHolder.position.set(0.0, 0.0, 0.0);
            aviaoHolder.rotation.set(0.0, 0.0, 0.0);
            rotacaoAviao.set(0,0,0);

        } else {
            trackballControls.enabled = false;

            // Aqui restaura a posição salva
            aviaoHolder.position.set(posicaoAviaoSalva.x, posicaoAviaoSalva.y, posicaoAviaoSalva.z);
            //aviaoHolder.setRotation(rotacaoAviaoSalva.x, rotacaoAviaoSalva.y, rotacaoAviaoSalva.z);
            rotacaoAviao = rotacaoAviaoSalva.clone();
        }

    }

    // Alterna entre câmera de simulação para visão em terceira pessoa para
    // visão em primeira pessoa, da cabine do avião
    if (keyboard.down("C")) {
        cameraPilotoAtiva = !cameraPilotoAtiva;
    }

    // Posiciona o holder exterior da câmera junto ao avião
    cameraSimulaHolderHolder.position.set(
        aviaoHolder.position.x,
        aviaoHolder.position.y,
        aviaoHolder.position.z
    );

    // Posiciona o holder principal da câmera afastado da origen do holder exterior, pra quando
    // rodar o holder exterior. Isso dá um efeito de rotação na câmera de um pivô deslocado
    cameraSimulaHolder.position.set(
        cameraPosition.x,
        cameraPosition.y,
        cameraPosition.z
    );

    // Roda a câmera no pivô deslocado para manter ela atrás do avião
    cameraSimulaHolderHolder.rotation.y = rotacaoAviao.y;//+ degreesToRadians(180);
    
    
    // Desloca a luz no plano paralelo ao chão
    dirLightHolder.rotation.y = rotacaoAviao.y;//+ degreesToRadians(180);

    lightPosition.set(
        aviaoHolder.position.x,
        aviaoHolder.position.y,
        aviaoHolder.position.z
    )
    updateLightPosition();
}

///////////////////// Movimentação /////////////////////

var delta = clock.getDelta();
var speedRot = THREE.Math.degToRad(45);
var speed = 50; // m/s
var aceleracao = 10;
var velocidadeMaxima = 70; // m/s
var maxangle = degreesToRadians(45);

function movimentaAviao() {

    if (keyboard.pressed("up")) {
        rotacaoAviao.x += speedRot * delta;
    } else if (keyboard.pressed("down")) {
        rotacaoAviao.x -= speedRot * delta;
    } else {
        //volta o valor de x pra zero
        let rx = Math.round(rotacaoAviao.x * 100) / 100;
        if (rx > 0) {
            rotacaoAviao.x -= speedRot * delta * 0.5;
        } else if (rx < 0) {
            rotacaoAviao.x += speedRot * delta * 0.5;
        } else {
            rotacaoAviao.x = 0;
        }
    }

    // Testa se a rotação no eixo X saiu do limite + ou -, se saiu ele impede de rodar mais
    if (rotacaoAviao.x >= maxangle) {
        rotacaoAviao.x = maxangle;
    } else if (rotacaoAviao.x <= -maxangle) {
        rotacaoAviao.x = -maxangle;
    }


    if (keyboard.pressed("right")) {
        rotacaoAviao.z += speedRot * delta * 1.4;
    } else if (keyboard.pressed("left")) {
        rotacaoAviao.z -= speedRot * delta * 1.4;
    } else {
        //volta o valor de z pra zero
        let rz = Math.round(rotacaoAviao.z * 100) / 100;
        if (rz > 0) {
            rotacaoAviao.z -= speedRot * delta * 1.2;
        } else if (rz < 0) {
            rotacaoAviao.z += speedRot * delta * 1.2;
        } else {
            rotacaoAviao.z = 0;
        }
    }

    // Testa se a rotação no eixo z saiu do limite + ou -, se saiu ele impede de rodar mais
    if (rotacaoAviao.z >= maxangle) {
        rotacaoAviao.z = maxangle;
    } else if (rotacaoAviao.z <= -maxangle) {
        rotacaoAviao.z = -maxangle;
    }

    // A rotação no eixo Y proporcional ao quanto está rodando no eixo Z
    //console.log('rotacaoAviao.z',Math.sin(rotacaoAviao.z))
    let c1 = (velocidadeMaxima / (Math.pow(velocidadeMaxima, 2) * 1.1)) * speed;
    let dy = rotacaoAviao.z * -c1 * delta;
    rotacaoAviao.y += dy;

    // Aumenta a velocidade do avião até um certo limite
    if (keyboard.pressed("Q")) {
        speed += aceleracao * delta;
        if (speed > velocidadeMaxima) {
            speed = velocidadeMaxima;
        }
    }

    // Diminui a velocidade do avião até um certo limite
    if (keyboard.pressed("A")) {
        speed -= aceleracao * delta;
        if (speed < 0) {
            speed = 0;
        }
    }

    aplicaRotacao();

    // Aplica translação no avião
    aviaoHolder.translateZ(speed * delta);

    // Roda a hélice
    eixo_helice.rotateY(0.5 * speed * delta);
}

function aplicaRotacao(){
    // https://threejs.org/docs/#api/en/math/Euler
    // Converte as rotações pro sistema do Three.js na ordem apropriada
    var euler = new THREE.Euler( 
      rotacaoAviao.x, 
      rotacaoAviao.y, 
      rotacaoAviao.z, 
      'YXZ'
    );
  
    // https://threejs.org/docs/#api/en/core/Object3D.setRotationFromEuler
    // Aplica no holder do avião
    aviaoHolder.quaternion.setFromEuler (euler);
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
    keyboard.update();

    trackballControls.update();
    requestAnimationFrame(render);
    delta = clock.getDelta();
    
    // Só movimenta o avião se estiver no modo simulação
    if (!modoInspecaoAtivo) {
        movimentaAviao();
    }

    alternaModo();
    //keyboardUpdate();
    stats.begin();
    if (modoInspecaoAtivo) {
        renderer.render(scene, camera) // Render scene
    } else if (cameraPilotoAtiva) {
        renderer.render(scene, cameraPiloto) // Render scene
    } else {
        renderer.render(scene, cameraSimula) // Render scene
    }
    stats.end();
}