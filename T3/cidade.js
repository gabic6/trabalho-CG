import * as THREE from '../../build/three.module.js';
import Stats from '../../build/jsm/libs/stats.module.js';
import { TrackballControls } from '../../build/jsm/controls/TrackballControls.js';
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

function updateLightPosition()
{
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
    light.shadow.mapSize.width = 5000;
    light.shadow.mapSize.height = 5000;
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
let raioLuz = dimensaoLuz/2.0;
criaLuzDirecionalComSombraEstatica(scene, -raioLuz, raioLuz, raioLuz );
criaLuzDirecionalComSombraEstatica(scene, -raioLuz, -raioLuz, raioLuz );
criaLuzDirecionalComSombraEstatica(scene, raioLuz, -raioLuz, raioLuz );
criaLuzDirecionalComSombraEstatica(scene, raioLuz, raioLuz, raioLuz );


///////////Mostrar axis////////////////

// Show world axes
var axesHelper = new THREE.AxesHelper(200);
scene.add(axesHelper);


// create the ground plane
var planeGeometry = new THREE.PlaneGeometry(2000, 2000, 1, 1);
planeGeometry.translate(0.0, 0.0, 0.0);
var planeMaterial = new THREE.MeshLambertMaterial({
    color:'rgb(89, 179, 0)',
    //side: THREE.DoubleSide
});
var plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotateX(degreesToRadians(-90));
plane.receiveShadow = true;
scene.add(plane);


////////////// Aqui entra o código da cidade /////////////////////

var material_asfalto = new THREE.MeshLambertMaterial({ color: '#333333', side: THREE.DoubleSide });
var material_meio_fio = new THREE.MeshLambertMaterial({ color: '#cccccc', side: THREE.DoubleSide });

var cidadeHolder = new THREE.Object3D();

function criaPlano(x, z, width, height, material){
    // create the ground plane
    var planeGeometry = new THREE.PlaneGeometry(width, height, 1, 1);
    var plane = new THREE.Mesh(planeGeometry, material);
    plane.receiveShadow = true;

    // Conversão de coordenadas do draw.io pro threejs
    plane.rotateX(degreesToRadians(-90));
    plane.position.set(x + width/2.0, 0, z + height/2.0);
    
    return plane;
}

function criaMeioFio(x, z, width, height, material){
    const depth = 0.2;
    const boxGeometry = new THREE.BoxGeometry( width, depth, height );
    const box = new THREE.Mesh( boxGeometry, material );
    box.receiveShadow = true;

    // Conversão de coordenadas do draw.io pro threejs
    //box.rotateX(degreesToRadians(-90));
    box.position.set(x + width/2.0, depth/2.0, z + height/2.0);

    return box;
}

function criarCidade(){

    //Ruas
    cidadeHolder.add(criaPlano(0,-280,20,640, material_asfalto));
    cidadeHolder.add(criaPlano(20,-60,65,10, material_asfalto));
    cidadeHolder.add(criaPlano(85,-160,10,300, material_asfalto));
    cidadeHolder.add(criaPlano(20,0,65,10, material_asfalto));
    cidadeHolder.add(criaPlano(20,-280,180,10, material_asfalto));
    cidadeHolder.add(criaPlano(200,-280,10,220, material_asfalto));
    cidadeHolder.add(criaPlano(20,-170,180,10, material_asfalto));
    cidadeHolder.add(criaPlano(20,-170,180,10, material_asfalto));
    cidadeHolder.add(criaPlano(95,-60,175,10, material_asfalto));

    // Meios fio
    cidadeHolder.add(criaMeioFio(20,-50,65,50, material_meio_fio));
    cidadeHolder.add(criaMeioFio(20,-160,65,100, material_meio_fio));
    cidadeHolder.add(criaMeioFio(95,-160,105,100, material_meio_fio));
    cidadeHolder.add(criaMeioFio(20,-270,180,100, material_meio_fio));

    // Posiciona o holder um pouco mais alto que o plano pra não dar conflito
    cidadeHolder.position.set(0, 1.0, 0);

    return cidadeHolder;
}

scene.add(criarCidade());

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