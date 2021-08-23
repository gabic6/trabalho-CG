import * as THREE from '../../build/three.module.js';
import Stats from '../../build/jsm/libs/stats.module.js';
import { TrackballControls } from '../../build/jsm/controls/TrackballControls.js';
import { OBJLoader } from '../../build/jsm/loaders/OBJLoader.js';
import {
    initRenderer,
    initCamera,
    degreesToRadians,
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

////////// Coisas da cena, como renderização, camera/////////////////////

var stats = new Stats();          // To show FPS information
var scene = new THREE.Scene();    // Create main scene
var renderer = initRenderer();    // View function in util/utils
var camera = initCamera(new THREE.Vector3(5.0, 5.0, 30.0)); // Init camera in this position
var trackballControls = new TrackballControls(camera, renderer.domElement);
//trackballControls.enabled = false;

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
    color: 'rgb(89, 179, 0)',
    //side: THREE.DoubleSide
});
var plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotateX(degreesToRadians(-90));
plane.receiveShadow = true;
scene.add(plane);


////////////// Aqui entra o código da cidade /////////////////////

var material_asfalto = new THREE.MeshLambertMaterial({ color: '#333333' });
var material_asfalto_v = new THREE.MeshLambertMaterial({ color: '#333333' });
var material_meio_fio = new THREE.MeshLambertMaterial({ color: '#cccccc' });
var material_grama = new THREE.MeshLambertMaterial({ color: '#22FF00' });
var material_fronteira_cidade = new THREE.MeshLambertMaterial({ color: '#33FF33' });

var cidadeHolder = new THREE.Object3D();

function criaPlano(x, z, width, height, material) {
    // create the ground plane
    var planeGeometry = new THREE.PlaneGeometry(width, height, 1, 1);
    var plane = new THREE.Mesh(planeGeometry, material);
    plane.receiveShadow = true;

    // Conversão de coordenadas do draw.io pro threejs
    plane.rotateX(degreesToRadians(-90));
    plane.position.set(x + width / 2.0, 0, z + height / 2.0);

    return plane;
}

function criaMeioFio(x, z, width, height, material) {
    const depth = 0.2;
    const boxGeometry = new THREE.BoxGeometry(width, depth, height);
    const box = new THREE.Mesh(boxGeometry, material);
    box.receiveShadow = true;

    // Conversão de coordenadas do draw.io pro threejs
    //box.rotateX(degreesToRadians(-90));
    box.position.set(x + width / 2.0, depth / 2.0, z + height / 2.0);

    return box;
}

// const posicoesXZPredios = [
//     {x: -205, z: -236},
//     {x: -140, z: -236},
//     {x: -80, z: -236},
//     {x: 95, z: -236},
//     {x: -230, z: -125},
//     {x: -155, z: -125},
//     {x: -60, z: -150},
//     {x: -60, z: -95},
//     {x: 37.5, z: -125},
//     {x: 132.5, z: -125},
//     {x: -230, z: -40},
//     {x: -150, z: -15},
//     {x: -60, z: -15},
//     {x: 37.5, z: -40},
//     {x: 37.5, z: 15},
//     {x: 107.5, z: -40},
//     {x: 195, z: -5},
//     {x: 107.5, z: 30.6},
//     {x: 37.5, z: 90},
//     {x: 37.5, z: 176.7},
//     {x: 102.5, z: 175},
//     {x: 195, z: 176.7},
//     {x: 107.5, z: 90},
//     // {x: 40, z: 280},
//     {x: -80, z: 280},
//     {x: -205, z: 280},
//     {x: -60, z: 175},
//     {x: -140, z: 175},
//     {x: -230, z: 130},
//     {x: 195, z: 109},
//     {x:55,   z:-235}
// ]

function criarCidade(dicionarioMateriais) {
    // Clona a textura do asfalto pra nao precisar carregar ela duas vezes
    // e também pra não atrapalhar as outras ruas horizontais
    var asfaltoClonado = dicionarioMateriais['asfalto.jpg'].clone()
    asfaltoClonado.needsUpdate = true;

    // Cria os materiais
    material_asfalto = new THREE.MeshLambertMaterial({ 
        color: '#ffffff', 
        map: dicionarioMateriais['asfalto.jpg']
    });
    material_asfalto_v = new THREE.MeshLambertMaterial({ 
        color: '#ffffff', 
        map: asfaltoClonado
    });
    material_asfalto_v.map.rotation = degreesToRadians(90);
    material_asfalto_v.map.repeat.set(10,1);
    material_asfalto_v.map.wrapS = THREE.RepeatWrapping;
    material_asfalto_v.map.wrapT = THREE.RepeatWrapping;

    material_meio_fio = new THREE.MeshLambertMaterial({ 
        color: '#ffffff',
        map: dicionarioMateriais['concreto.jpg'] 
    });
    // material_grama = new THREE.MeshLambertMaterial({ 
    //     color: '#ffffff',
    //  });
    // material_fronteira_cidade = new THREE.MeshLambertMaterial({ 
    //     color: '#ffffff'
    //  });

    //Ruas
    cidadeHolder.add(criaPlano(0, -280, 20, 640, material_asfalto_v));
    cidadeHolder.add(criaPlano(20, -60, 65, 10, material_asfalto));
    cidadeHolder.add(criaPlano(85, -160, 10, 300, material_asfalto_v));
    cidadeHolder.add(criaPlano(20, 0, 65, 10, material_asfalto));
    cidadeHolder.add(criaPlano(20, -280, 180, 10, material_asfalto));
    cidadeHolder.add(criaPlano(200, -280, 10, 220, material_asfalto_v));
    cidadeHolder.add(criaPlano(20, -170, 180, 10, material_asfalto));
    cidadeHolder.add(criaPlano(20, -170, 180, 10, material_asfalto));
    cidadeHolder.add(criaPlano(95, -60, 175, 10, material_asfalto));
    cidadeHolder.add(criaPlano(260, -50, 10, 290, material_asfalto_v));
    cidadeHolder.add(criaPlano(150, -50, 10, 290, material_asfalto_v));
    cidadeHolder.add(criaPlano(95, 0, 55, 10, material_asfalto));
    cidadeHolder.add(criaPlano(160, 70, 100, 10, material_asfalto));
    cidadeHolder.add(criaPlano(85, 140, 65, 10, material_asfalto));
    cidadeHolder.add(criaPlano(20, 50, 65, 10, material_asfalto));
    cidadeHolder.add(criaPlano(20, 230, 130, 10, material_asfalto));
    cidadeHolder.add(criaPlano(160, 230, 100, 10, material_asfalto));
    cidadeHolder.add(criaPlano(-250, -280, 250, 10, material_asfalto));
    cidadeHolder.add(criaPlano(-250, -170, 250, 10, material_asfalto));
    cidadeHolder.add(criaPlano(-260, -280, 10, 640, material_asfalto_v));
    cidadeHolder.add(criaPlano(-100, -160, 10, 100, material_asfalto_v));
    cidadeHolder.add(criaPlano(-90, -110, 90, 10, material_asfalto));
    cidadeHolder.add(criaPlano(-170, -60, 170, 10, material_asfalto));
    cidadeHolder.add(criaPlano(-180, -60, 10, 290, material_asfalto_v));
    cidadeHolder.add(criaPlano(-100, -50, 10, 110, material_asfalto_v));
    cidadeHolder.add(criaPlano(-170, 50, 70, 10, material_asfalto));
    cidadeHolder.add(criaPlano(-90, 50, 90, 10, material_asfalto));
    cidadeHolder.add(criaPlano(-250, 50, 70, 10, material_asfalto));
    cidadeHolder.add(criaPlano(-170, 140, 170, 10, material_asfalto));
    cidadeHolder.add(criaPlano(-250, 230, 250, 10, material_asfalto));
    cidadeHolder.add(criaPlano(-130, 240, 10, 110, material_asfalto_v));
    cidadeHolder.add(criaPlano(-250, 350, 250, 10, material_asfalto));

    // Meios fio
    cidadeHolder.add(criaMeioFio(20, -50, 65, 50, material_meio_fio));
    cidadeHolder.add(criaMeioFio(20, -160, 65, 100, material_meio_fio));
    cidadeHolder.add(criaMeioFio(95, -160, 105, 100, material_meio_fio));
    cidadeHolder.add(criaMeioFio(20, -270, 180, 100, material_meio_fio));
    cidadeHolder.add(criaMeioFio(95, -50, 55, 50, material_meio_fio));
    cidadeHolder.add(criaMeioFio(160, -50, 100, 120, material_meio_fio));
    cidadeHolder.add(criaMeioFio(20, 10, 65, 40, material_meio_fio));
    cidadeHolder.add(criaMeioFio(95, 10, 55, 130, material_meio_fio));
    cidadeHolder.add(criaMeioFio(160, 80, 100, 150, material_meio_fio));
    cidadeHolder.add(criaMeioFio(20, 60, 65, 170, material_meio_fio));
    cidadeHolder.add(criaMeioFio(85, 150, 65, 80, material_meio_fio));
    cidadeHolder.add(criaMeioFio(-250, -270, 250, 100, material_meio_fio));
    cidadeHolder.add(criaMeioFio(-90, -160, 90, 50, material_meio_fio));
    cidadeHolder.add(criaMeioFio(-90, -100, 90, 40, material_meio_fio));
    cidadeHolder.add(criaMeioFio(-180, -160, 80, 100, material_meio_fio));
    cidadeHolder.add(criaMeioFio(-250, -160, 70, 210, material_meio_fio));
    cidadeHolder.add(criaMeioFio(-170, -50, 70, 100, material_meio_fio));
    cidadeHolder.add(criaMeioFio(-90, -50, 90, 100, material_meio_fio));
    cidadeHolder.add(criaMeioFio(-250, 60, 70, 170, material_meio_fio));
    cidadeHolder.add(criaMeioFio(-170, 60, 170, 80, material_grama));
    cidadeHolder.add(criaMeioFio(-170, 150, 170, 80, material_meio_fio));
    cidadeHolder.add(criaMeioFio(-250, 240, 120, 110, material_meio_fio));
    cidadeHolder.add(criaMeioFio(-120, 240, 120, 110, material_meio_fio));

    //Fronteiras da cidade
    cidadeHolder.add(criaPlano(270, -310, 90, 700, material_fronteira_cidade));
    cidadeHolder.add(criaPlano(210, -310, 60, 250, material_fronteira_cidade));
    cidadeHolder.add(criaPlano(15, -310, 195, 30, material_fronteira_cidade));
    cidadeHolder.add(criaPlano(-260, -310, 265, 30, material_fronteira_cidade));
    cidadeHolder.add(criaPlano(-340, -310, 80, 700, material_fronteira_cidade));
    cidadeHolder.add(criaPlano(-260, 360, 280, 30, material_fronteira_cidade));
    cidadeHolder.add(criaPlano(20, 240, 250, 150, material_fronteira_cidade));

    //Rua até o aeroporto
    cidadeHolder.add(criaPlano(5, -475, 10, 196, material_asfalto));
    cidadeHolder.add(criaPlano(-560, -485, 575, 10, material_asfalto));

    //Aeroporto
    cidadeHolder.add(criaPlano(-670, -530, 110, 100, material_meio_fio));
    cidadeHolder.add(criaPlano(-700, -575, 30, 600, material_asfalto));

    //Predios
    var predios = [
        predio1,
        predio2,
        predio3,
        predio4,
        predio5,
        predio6
    ]
    // for(let coord=0;coord<posicoesXZPredios.length;coord++){
    //     var posPredio = posicoesXZPredios[coord];
    //     var predioInd = Math.floor((predios.length * Math.random()));
    //     var funcPredio = predios[predioInd];
    //     cidadeHolder.add(funcPredio(posPredio.x,posPredio.z));
    // }
    cidadeHolder.add(predio6(-80,280));
    cidadeHolder.add(predio6(-250,240));


    // cidadeHolder.add(predio1(-205, -236));

    // Posiciona o holder um pouco mais alto que o plano pra não dar conflito
    cidadeHolder.position.set(0, 1.0, 0);

    return cidadeHolder;
}



///////////// Tela de loading das texturas ////////////////////

const texturas = [
    "asfalto.jpg",
    "concreto.jpg"/*,
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
    escondeTelaLoading();
    scene.add(criarCidade(texturasCarregadas));
};

manager.onProgress = function (url, itemsLoaded, itemsTotal) {
    //console.log('Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.');
    setProgresso(itemsLoaded / texturas.length);
};

function setProgresso(progresso){
    if(progresso > 1){
        progresso = 1;
    }
    if(progresso < 0){
        progresso = 0;
    }
    let barraLoading = document.getElementById("barraLoading");
    //console.log('barraLoading',barraLoading, `${200*progresso}px`)
    barraLoading.style.width = `${200*progresso}px`;
}
function escondeTelaLoading(){
    let telaLoading = document.getElementById("telaLoading");
    telaLoading.style.display = 'none';
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
///////////// Aqui termina o código da cidade ////////////////////


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

    stats.begin();
    renderer.render(scene, camera) // Render scene
    stats.end();
}