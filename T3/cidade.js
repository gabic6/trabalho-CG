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

var material_asfalto = new THREE.MeshLambertMaterial({ color: '#333333' });
var material_asfalto_v = new THREE.MeshLambertMaterial({ color: '#333333' });
var material_concreto = new THREE.MeshLambertMaterial({ color: '#cccccc' });
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

function criarCidade(texturasCarregadas) {
    // Clona a textura do asfalto pra nao precisar carregar ela duas vezes
    // e também pra não atrapalhar as outras ruas horizontais
    var asfaltoClonado = texturasCarregadas['asfalto.jpg'].clone()
    asfaltoClonado.needsUpdate = true;

    // Cria os materiais
    material_asfalto = new THREE.MeshLambertMaterial({ 
        color: '#ffffff', 
        map: texturasCarregadas['asfalto.jpg']
    });

    material_asfalto_v = new THREE.MeshLambertMaterial({ 
        color: '#ffffff', 
        map: asfaltoClonado
    });
    material_asfalto_v.map.rotation = degreesToRadians(90);
    material_asfalto_v.map.repeat.set(10,1);
    material_asfalto_v.map.wrapS = THREE.RepeatWrapping;
    material_asfalto_v.map.wrapT = THREE.RepeatWrapping;

    material_concreto = new THREE.MeshLambertMaterial({ 
        color: '#ffffff',
        map: texturasCarregadas['conc02.jpg'] 
    });
    material_concreto.map.repeat.set(10,10);
    material_concreto.map.wrapS = THREE.RepeatWrapping;
    material_concreto.map.wrapT = THREE.RepeatWrapping;

    material_grama = new THREE.MeshLambertMaterial({ 
        color: '#ffffff',
        map: texturasCarregadas['grama.jpg'] 
    });
    material_grama.map.repeat.set(17,8);
    material_grama.map.wrapS = THREE.RepeatWrapping;
    material_grama.map.wrapT = THREE.RepeatWrapping;

    // material_grama = new THREE.MeshLambertMaterial({ 
    //     color: '#ffffff',
    //  });
    // material_fronteira_cidade = new THREE.MeshLambertMaterial({ 
    //     color: '#ffffff',
    //     map: texturasCarregadas['Grass0018_1_350.jpg'] 
    // });
    // material_grama.map.repeat.set(8,8);
    // material_grama.map.wrapS = THREE.RepeatWrapping;
    // material_grama.map.wrapT = THREE.RepeatWrapping;

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
    cidadeHolder.add(criaMeioFio(20, -50, 65, 50, material_concreto));
    cidadeHolder.add(criaMeioFio(20, -160, 65, 100, material_concreto));
    cidadeHolder.add(criaMeioFio(95, -160, 105, 100, material_concreto));
    cidadeHolder.add(criaMeioFio(20, -270, 180, 100, material_concreto));
    cidadeHolder.add(criaMeioFio(95, -50, 55, 50, material_concreto));
    cidadeHolder.add(criaMeioFio(160, -50, 100, 120, material_concreto));
    cidadeHolder.add(criaMeioFio(20, 10, 65, 40, material_concreto));
    cidadeHolder.add(criaMeioFio(95, 10, 55, 130, material_concreto));
    cidadeHolder.add(criaMeioFio(160, 80, 100, 150, material_concreto));
    cidadeHolder.add(criaMeioFio(20, 60, 65, 170, material_concreto));
    cidadeHolder.add(criaMeioFio(85, 150, 65, 80, material_concreto));
    cidadeHolder.add(criaMeioFio(-250, -270, 250, 100, material_concreto));
    cidadeHolder.add(criaMeioFio(-90, -160, 90, 50, material_concreto));
    cidadeHolder.add(criaMeioFio(-90, -100, 90, 40, material_concreto));
    cidadeHolder.add(criaMeioFio(-180, -160, 80, 100, material_concreto));
    cidadeHolder.add(criaMeioFio(-250, -160, 70, 210, material_concreto));
    cidadeHolder.add(criaMeioFio(-170, -50, 70, 100, material_concreto));
    cidadeHolder.add(criaMeioFio(-90, -50, 90, 100, material_concreto));
    cidadeHolder.add(criaMeioFio(-250, 60, 70, 170, material_concreto));
    // Pracinha
    cidadeHolder.add(criaMeioFio(-168, 62, 166, 76, material_grama));
    cidadeHolder.add(criaMeioFio(-2, 60, 2, 80, material_concreto));
    cidadeHolder.add(criaMeioFio(-168, 138, 166, 2, material_concreto));
    cidadeHolder.add(criaMeioFio(-170, 60, 2, 80, material_concreto));
    cidadeHolder.add(criaMeioFio(-168, 60, 166, 2, material_concreto));
    //
    cidadeHolder.add(criaMeioFio(-170, 150, 170, 80, material_concreto));
    cidadeHolder.add(criaMeioFio(-250, 240, 120, 110, material_concreto));
    cidadeHolder.add(criaMeioFio(-120, 240, 120, 110, material_concreto));

    //Fronteiras da cidade
    let textura_grama_periferia = texturasCarregadas['Grass0018_1_350.jpg'];
    cidadeHolder.add(criaPlano(270, -310, 90, 700, configuraMaterial(textura_grama_periferia, 90, 700, 15)));
    cidadeHolder.add(criaPlano(210, -310, 60, 250, configuraMaterial(textura_grama_periferia, 60, 250, 15)));
    cidadeHolder.add(criaPlano(15, -310, 195, 30, configuraMaterial(textura_grama_periferia, 195, 30, 15)));
    cidadeHolder.add(criaPlano(-260, -310, 265, 30, configuraMaterial(textura_grama_periferia, 265, 30, 15)));
    cidadeHolder.add(criaPlano(-340, -310, 80, 700, configuraMaterial(textura_grama_periferia, 80, 700, 15)));
    cidadeHolder.add(criaPlano(-260, 360, 280, 30, configuraMaterial(textura_grama_periferia, 280, 30, 15)));
    cidadeHolder.add(criaPlano(20, 240, 250, 150, configuraMaterial(textura_grama_periferia, 250, 150, 15)));
    
    // Planos da periferia
    let textura_fazendinha_feliz = texturasCarregadas['fazendinha_feliz.jpg'];
    cidadeHolder.add(criaPlano(400, 600, 150, 150, configuraMaterial(textura_fazendinha_feliz, 150, 150, 150)));
    
    // Lago
    var material_lago = new THREE.MeshLambertMaterial({ 
        color: '#ffffff',
        map: texturasCarregadas['lago.png'],
        transparent: true
    });
    var lago = criaPlano(20, 240, 130, 84.5, material_lago);
    lago.position.y=0.1;
    lago.rotateZ(degreesToRadians(180));
    cidadeHolder.add(lago);

    //Rua até o aeroporto
    cidadeHolder.add(criaPlano(5, -475, 10, 196, material_asfalto_v));
    cidadeHolder.add(criaPlano(-560, -485, 575, 10, material_asfalto));

    //Aeroporto
    cidadeHolder.add(criaPlano(-670, -530, 110, 100, material_concreto));
    cidadeHolder.add(criaPlano(-700, -575, 30, 600, material_asfalto_v));

    //Predios
    var predios = [
        predio1,
        predio2,
        predio3,
        predio4,
        predio5,
        predio6
    ]

    //predio1 - 30 comprimento e 30 largura
    //predio2 - 40 comprimento e 40 largura
    //predio3 - 60 comprimento e 50 largura
    //predio4 - 40 comprimento e 15 largura
    //predio5 - 60 comprimento e 60 largura
    //predio6 - 110 comprimento e 60 largura

    //predio1  
    cidadeHolder.add(predio1(107.5,-40,texturasCarregadas));
    
    cidadeHolder.add(predio1(37.5,176.7,texturasCarregadas));
    
    var predio1_menor = predio1(0,0,texturasCarregadas);
    predio1_menor.scale.multiplyScalar(0.75);
    predio1_menor.position.set(-60,0,-150);
    cidadeHolder.add(predio1_menor);

    cidadeHolder.add(predio1(-230,-125,texturasCarregadas));

    cidadeHolder.add(predio1(-140,175,texturasCarregadas));

    //predio2
    cidadeHolder.add(predio2(182,180));
    
    var predio2_menor = predio2(145,30.6);
    predio2_menor.scale.multiplyScalar(0.75);
    cidadeHolder.add(predio2_menor);

    cidadeHolder.add(predio2(-60,-15));

    cidadeHolder.add(predio2(137.5,-235));

    cidadeHolder.add(predio2(-140,-236));

    //predio3
    cidadeHolder.add(predio3(52,-110));
    
    cidadeHolder.add(predio3(122.5,90));

    cidadeHolder.add(predio3(-216,130));

    var predio3_menor=predio3(52,90);
    predio3_menor.scale.multiplyScalar(0.8);
    predio3_menor.position.y = -90*0.8+107;
    cidadeHolder.add(predio3_menor);

    cidadeHolder.add(predio3(-135,-110));
    
    //predio4
    var predio4_maior = predio4(202,-10);
    predio4_maior.scale.multiplyScalar(1.3);
    cidadeHolder.add(predio4_maior);

    cidadeHolder.add(predio4(30,35).rotateY(degreesToRadians(90)));

    cidadeHolder.add(predio4(-60,-78).rotateY(degreesToRadians(90)));

    var predio4_maior2 = predio4_maior.clone();
    predio4_maior2.position.set(-205,0,-236);
    cidadeHolder.add(predio4_maior2);

    cidadeHolder.add(predio4(-230,-40));
    
    //predio5
    cidadeHolder.add(predio5(182,90));

    cidadeHolder.add(predio5(-166,25).rotateY(degreesToRadians(90)));
    
    cidadeHolder.add(predio5(-63,160));

    var predio5_menor = predio5(30,-48);
    predio5_menor.scale.multiplyScalar(0.75);
    cidadeHolder.add(predio5_menor);

    cidadeHolder.add(predio5(-80,-236));

    //predio6
    cidadeHolder.add(predio6(-80,290));

    cidadeHolder.add(predio6(-202,290));

    cidadeHolder.add(predio6(148,-123).rotateY(degreesToRadians(-90)));
    
    var predio6_menor = predio6(0,0).rotateY(degreesToRadians(90));
    predio6_menor.scale.multiplyScalar(0.75);
    predio6_menor.position.set(120,23/2,200.5);
    // predio6_menor.position.y =23/2 ;
    cidadeHolder.add(predio6_menor);

    var predio6_menor2 = predio6_menor.clone();
    predio6_menor2.position.set(55,23/2,-235);
    predio6_menor2.rotateY(degreesToRadians(180));
    cidadeHolder.add(predio6_menor2);
    
    // predio6_menor.position.set(
    //     15,
    //     predio6_menor.position.y,
    //     predio6_menor.position.z
    // )


    // Posiciona o holder um pouco mais alto que o plano pra não dar conflito
    cidadeHolder.position.set(0, 0.1, 0);

    return cidadeHolder;
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
    "predio1_cano.jpg",
    "predio1_sem_cano.jpg",
    "predio1_caixinha_porta.jpg",
    "predio1_caixinha.jpg",
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
    mostraBotaoContinuar();
};
function escondeTelaLoading(){
    let telaLoading = document.getElementById("telaLoading");
    telaLoading.style.display = 'none';

    // Carrega os objetos que dependem das texturas
    texturaPlanoPrincipal();
    scene.add(criarCidade(texturasCarregadas));
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
        scene.add ( obj );
        
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