import * as THREE from '../../build/three.module.js';
import Stats from '../../build/jsm/libs/stats.module.js';
import { TrackballControls } from '../../build/jsm/controls/TrackballControls.js';
import { OBJLoader } from '../../build/jsm/loaders/OBJLoader.js';
import {MTLLoader} from '../build/jsm/loaders/MTLLoader.js';
import {
    initRenderer,
    initCamera,
    degreesToRadians,
    getMaxSize,
    onWindowResize,
    initDefaultBasicLight,
    createGroundPlaneWired,
    createLightSphere

} from "../../libs/util/util.js";
import KeyboardState from '../../libs/util/KeyboardState.js';
import {
    predio1,
    predio2,
    predio3,
    predio4,
    predio5,
    predio6
} from "./predio.js"
import criarCidade from './cidade.js';

////////// Coisas da cena, como renderização, camera/////////////////////

var stats = new Stats();          // To show FPS information
var scene = new THREE.Scene();    // Create main scene
var renderer = initRenderer();    // View function in util/utils
var camera = initCamera(new THREE.Vector3(5.0, 5.0, 30.0)); // Init camera in this position
var trackballControls = new TrackballControls(camera, renderer.domElement);
//trackballControls.enabled = false;

// Camera de inspeção da cidade
const cameraCidade = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 10000);
cameraCidade.position.set(0, 0, 0);
cameraCidade.lookAt(new THREE.Vector3(0, 0, 1));
cameraCidade.up.set(0,1,0);

const holderCameraCidade = new THREE.Object3D();
holderCameraCidade.add(cameraCidade);
holderCameraCidade.position.set(0,5,0);
scene.add(holderCameraCidade);

document.body.appendChild(stats.dom);
camera.far = 10000;
camera.updateProjectionMatrix();

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
var lightPosition = new THREE.Vector3(0, 3, 0);
// Cor da luz
var lightColor = "rgb(255,255,255)";

//Luz Direcional
var dirLight = new THREE.DirectionalLight(lightColor);
var dirLightHolder = new THREE.Object3D();

//Debug da luz
var lightSphere = createLightSphere(scene, 1.0, 10, 10, lightPosition, lightColor);

function setDirectionalLighting(position) {
    dirLight.position.copy(position);
    dirLight.shadow.mapSize.width = 512;
    dirLight.shadow.mapSize.height = 512;
    dirLight.castShadow = true;

    var d = 20;
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

function updateLightPosition() {
    dirLightHolder.position.copy(lightPosition);
}

//////////////// Luz com sombra estática para as arvores e montanhas ////////////////////

function criaLuzDirecionalComSombraEstatica(scene_ref, x, z, d_shadow) {
    // Cria luz
    var light = new THREE.DirectionalLight(lightColor);
    var lightHolder = new THREE.Object3D();
    var ligthTargetHolder = new THREE.Object3D();

    //Configura a luz
    light.target = ligthTargetHolder;
    light.shadow.mapSize.width = 1024;
    light.shadow.mapSize.height = 1024;
    light.castShadow = true;
    light.shadow.autoUpdate = false;
    light.shadow.needsUpdate = true;
    light.shadow.camera.near = 1;
    light.shadow.camera.far = 800;
    light.shadow.camera.left = -d_shadow;
    light.shadow.camera.right = d_shadow;
    light.shadow.camera.top = d_shadow;
    light.shadow.camera.bottom = -d_shadow;
    light.visible = true;
    light.intensity = 0.01;
    light.decay = 1;
    light.penumbra = 0.1;

    // Posição da luz em relação ao holder dela
    light.position.copy(lightHolderPosition);
    lightHolder.add(light);
    scene_ref.add(lightHolder);

    // Posição do holder
    lightHolder.position.set(x, 0, z);

    // Helpers de visualização da luz e da camera de projeção de sombras
    // const helper = new THREE.DirectionalLightHelper(light, 5);
    // const helper2 = new THREE.CameraHelper(light.shadow.camera);
    // scene_ref.add(helper);
    // scene_ref.add(helper2);

    // Cria o holder pra onde a luz vai estar apontada
    ligthTargetHolder.position.set(
        x,
        1.0,
        z
    );

    scene_ref.add(ligthTargetHolder);
}

// Cria as 4 luzes, uma em cada quadrante do plano pra projeção das 
// sombras estáticas
let dimensaoLuz = 1000;
let raioLuz = dimensaoLuz / 2.0;
criaLuzDirecionalComSombraEstatica(scene, -raioLuz, raioLuz, raioLuz);
criaLuzDirecionalComSombraEstatica(scene, -raioLuz, -raioLuz, raioLuz);
criaLuzDirecionalComSombraEstatica(scene, raioLuz, -raioLuz, raioLuz);
criaLuzDirecionalComSombraEstatica(scene, raioLuz, raioLuz, raioLuz);


///////////Mostrar axis////////////////

// Show world axes
var axesHelper = new THREE.AxesHelper(200);
scene.add(axesHelper);


// create the ground plane

var planeGeometry = new THREE.PlaneGeometry(2000, 2000, 1, 1);
planeGeometry.translate(0.0, 0.0, 0.0);
var planeMaterial = new THREE.MeshLambertMaterial({
    color: 'rgb(89, 179, 0)'
});
var plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotateX(degreesToRadians(-90));
plane.receiveShadow = true;
scene.add(plane);

function texturaPlanoPrincipal(){
    let textura_chao_pedra = texturasCarregadas['grama_periferia.jpg'];
    plane.material = configuraMaterial(textura_chao_pedra, 2000, 2000, 10);
}

////////////// Aqui entra o código da cidade /////////////////////

function configuraMaterial(textura, plano_largura, plano_comprimento, dim_textura){
    textura = textura.clone();
    textura.needsUpdate = true;
    var material = new THREE.MeshLambertMaterial({ 
        color: '#ffffff',
        map: textura
    });
    material.map.repeat.set(
        Math.ceil(plano_largura / dim_textura),
        Math.ceil(plano_comprimento / dim_textura)
    );
    material.map.wrapS = THREE.RepeatWrapping;
    material.map.wrapT = THREE.RepeatWrapping;

    return material;
}

///////////// Tela de loading das texturas ////////////////////

const texturas = [
    "asfalto.jpg",
    "conc02.jpg",
    "grama.jpg",
    "grama_periferia.jpg",
    "Grass0018_1_350.jpg",
    "chao_pedra.jpg",
    "fazendinha_feliz.jpg",
    "lago.png",
    "predio2_cano.jpg",
    "predio2_sem_cano.jpg",
    "predio2_caixinha_porta.jpg",
    "predio2_caixinha.jpg",
    "concreto.jpg",
    "container_roof.jpg",
    "apartment_block5.png",
    "predio1_teste.jpg",
    "predio2_triangulo_frente.jpg",
    "predio2_triangulo_lados.jpg",
    "predio2_roof.jpg",
    "building_factory.png",
    "brick01.jpg",
    "building_l2.png"/*,
    "aviao_corpo.png",
    "comunismo.jpg",
    "corpo_opcao2.jpg",
    "crown.png",
    "opcao3.jpg",
    "predio_com_janelas.jpg",
    "wings.jpg"*/
]

const manager = new THREE.LoadingManager();
manager.onStart = function (url, itemsLoaded, itemsTotal) {
    //console.log('Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.');
    setProgresso(0);
};

manager.onLoad = function () {
    //console.log('Loading complete!');
    mostraBotaoContinuar();
};
function escondeTelaLoading(){
    let telaLoading = document.getElementById("telaLoading");
    telaLoading.style.display = 'none';

    // Carrega os objetos que dependem das texturas
    texturaPlanoPrincipal();
    scene.add(criarCidade(texturasCarregadas, testeObjeto));
}
function mostraBotaoContinuar(){
    let btnContinuar = document.getElementById("btnContinuar");
    let fundoLoading = document.getElementById("fundoLoading");
    let txtLoading = document.getElementById("txtLoading");
    btnContinuar.style.display = 'flex';
    fundoLoading.style.display = 'none';
    txtLoading.style.display = 'none';

    btnContinuar.addEventListener("click", function() {
        escondeTelaLoading();
    });
}
manager.onProgress = function (url, itemsLoaded, itemsTotal) {
    //console.log('Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.');
    setProgresso(itemsLoaded / (texturas.length + 1));
};

function setProgresso(progresso){
    if(progresso > 1){
        progresso = 1;
    }
    if(progresso < 0){
        progresso = 0;
    }
    let barraLoading = document.getElementById("barraLoading");
    let txtLoading = document.getElementById("txtLoading");
    barraLoading.style.width = `${200*progresso}px`;
    txtLoading.innerHTML = `Carregando ${Math.round(progresso*100)}%`
}


manager.onError = function (url) {
    console.error('There was an error loading ' + url);
};
const loader = new THREE.TextureLoader(manager);
var texturasCarregadas = {};
for (let i = 0; i < texturas.length; i++) {
    let caminho_textura = "assets\\textures\\" + texturas[i];
    loader.load(caminho_textura, function (object) {
        //Faz um dicionario com as texturas carregadas
        texturasCarregadas[texturas[i]] = object;
    });
}

loadOBJFile('./assets/objects/', 'Decoration 14', 30.0, 0, true);

var testeObjeto = null;

function loadOBJFile(modelPath, modelName, desiredScale, angle, visibility)
{
    var currentModel = modelName;
    //var manager = new THREE.LoadingManager( );

  var mtlLoader = new MTLLoader( manager );
  mtlLoader.setPath( modelPath );
  mtlLoader.load( modelName + '.mtl', function ( materials ) {
      materials.preload();

      var objLoader = new OBJLoader( manager );
      objLoader.setMaterials(materials);
      objLoader.setPath(modelPath);
      objLoader.load( modelName + ".obj", function ( obj ) {
        obj.visible = visibility;
        obj.name = modelName;
        // Set 'castShadow' property for each children of the group
        obj.traverse( function (child)
        {
          child.castShadow = true;
        });

        obj.traverse( function( node )
        {
          if( node.material ) node.material.side = THREE.DoubleSide;
        });


        var obj = normalizeAndRescale(obj, desiredScale);
        var obj = fixPosition(obj);
        obj.rotateY(degreesToRadians(angle));
        
        obj.translateX(-85.0);
        obj.translateY(1.0);
        obj.translateZ(100.0);
        
        testeObjeto = obj;
        //scene.add ( obj );

        console.log('************************',testeObjeto, obj);
        
      }, onProgress, onError );
  });
}

function onError() { };

function onProgress ( xhr, model ) {
    if ( xhr.lengthComputable ) {
      var percentComplete = xhr.loaded / xhr.total * 100;
      //infoBox.changeMessage("Loading... " + Math.round( percentComplete, 2 ) + '% processed' );
    }
}

// Normalize scale and multiple by the newScale
function normalizeAndRescale(obj, newScale)
{
  var scale = getMaxSize(obj); // Available in 'utils.js'
  obj.scale.set(newScale * (1.0/scale),
                newScale * (1.0/scale),
                newScale * (1.0/scale));
  return obj;
}

function fixPosition(obj)
{
  // Fix position of the object over the ground plane
  var box = new THREE.Box3().setFromObject( obj );
  if(box.min.y > 0)
    obj.translateY(-box.min.y);
  else
    obj.translateY(-1*box.min.y);
  return obj;
}
///////////// Aqui termina o código da cidade ////////////////////

var cameraInspecaoCidade = false;

function moverCamera(delta){
    //keyboard.update();
    //keyboard.debug();

    if (keyboard.down("P")) {
        cameraInspecaoCidade = !cameraInspecaoCidade;
    }

    var velocidade = 30;

    if (keyboard.pressed("ctrl")) {
        velocidade = 100;
    }

    if (keyboard.pressed("A")) {
        holderCameraCidade.rotateY(delta * 0.8);
    }
    if (keyboard.pressed("S")) {
        holderCameraCidade.rotateX(delta * 0.8);
    }
    if (keyboard.pressed("W")) {
        holderCameraCidade.rotateX(-delta * 0.8);
    }
    if (keyboard.pressed("D")) {
        holderCameraCidade.rotateY(-delta * 0.8);
    }

    if (keyboard.pressed("left")) {
        holderCameraCidade.translateX(delta * velocidade);
    }
    if (keyboard.pressed("right")) {
        holderCameraCidade.translateX(-delta * velocidade);
    }
    if (keyboard.pressed("up")) {
        holderCameraCidade.translateZ(delta * velocidade);
    }
    if (keyboard.pressed("down")) {
        holderCameraCidade.translateZ(-delta * velocidade);
    }
}

window.addEventListener('resize', function () {
    onWindowResize(cameraInspecao, renderer);
}, false);

render();

function render() {
    stats.update(); // Update FPS
    keyboard.update();

    trackballControls.update();
    requestAnimationFrame(render);
    //delta = clock.getDelta();
    moverCamera(clock.getDelta());

    trackballControls.enabled = !cameraInspecaoCidade;

    stats.begin();
    if(cameraInspecaoCidade){
        renderer.render(scene, cameraCidade) // Render scene
    } else {
        renderer.render(scene, camera) // Render scene
    }
    stats.end();
}