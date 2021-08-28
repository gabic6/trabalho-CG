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
import checkpoints, { 
    checaColisao,
    caminho,
    registraTimestampInspecao,
    ocultaInfoBox
} from './caminho_checkpoint.js';

////////// Coisas da cena, como renderização, camera/////////////////////

var stats = new Stats();          // To show FPS information
var scene = new THREE.Scene();    // Create main scene
var renderer = initRenderer();    // View function in util/utils
var camera = initCamera(new THREE.Vector3(5.0, 5.0, 30.0)); // Init camera in this position
var trackballControls = new TrackballControls(camera, renderer.domElement);
trackballControls.enabled = false;
var instrucaoAtiva = true;
var somAviaoStatus = false;

document.body.appendChild(stats.dom);
camera.far = 10000;
camera.updateProjectionMatrix();

const lightHem = new THREE.HemisphereLight('rgb(255, 255, 255)', 'rgb(47, 79, 79)', 0.5);
scene.add(lightHem);
scene.background = new THREE.Color('rgb(179, 217, 255)');

var modoInspecaoAtivo = false;
var cameraPilotoAtiva = false;
var keyboard = new KeyboardState();
var clock = new THREE.Clock();

const spotLight = new THREE.SpotLight( 0xffffff );
camera.add(spotLight);
scene.add(camera);
spotLight.visible = false;

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

    return light;
}

// Cria as 4 luzes, uma em cada quadrante do plano pra projeção das 
// sombras estáticas
let dimensaoLuz = 1000;
let raioLuz = dimensaoLuz/2.0;
/*criaLuzDirecionalComSombraEstatica(scene, -raioLuz, raioLuz, raioLuz );
criaLuzDirecionalComSombraEstatica(scene, -raioLuz, -raioLuz, raioLuz );
criaLuzDirecionalComSombraEstatica(scene, raioLuz, -raioLuz, raioLuz );
criaLuzDirecionalComSombraEstatica(scene, raioLuz, raioLuz, raioLuz );*/
var light1 = criaLuzDirecionalComSombraEstatica(scene, -raioLuz, raioLuz, raioLuz );
var light2 = criaLuzDirecionalComSombraEstatica(scene, -raioLuz, -raioLuz, raioLuz );
var light3 = criaLuzDirecionalComSombraEstatica(scene, raioLuz, -raioLuz, raioLuz );
var light4 = criaLuzDirecionalComSombraEstatica(scene, raioLuz, raioLuz, raioLuz );

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
//var axesHelper = new THREE.AxesHelper(200);
//scene.add(axesHelper);

////////////// Objetos /////////////////////
var plane = new THREE.Object3D();
let ambienteHolder = new THREE.Object3D();
let checkpointHolder = new THREE.Object3D();
let caminho_curva = new THREE.Object3D();

function carregaObjetos(){
    // create the ground plane
    var planeGeometry = new THREE.PlaneGeometry(2000, 2000, 800, 800);
    planeGeometry.translate(0.0, 0.0, 0.0);
    var planeMaterial = new THREE.MeshLambertMaterial({
        color:'rgb(89, 179, 0)',
        map: texturasCarregadas['grama_periferia.jpg']
    });

    planeMaterial.map.repeat.set(150, 150);
    planeMaterial.map.wrapS = THREE.RepeatWrapping;
    planeMaterial.map.wrapT = THREE.RepeatWrapping;

    plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotateX(degreesToRadians(-90));
    plane.receiveShadow = true;
    scene.add(plane);

    // Adiciona os meshes do ambiente (arvores e montanhas)
    ambienteHolder = ambiente(texturasCarregadas);
    scene.add(ambienteHolder);

    // Adiciona os checkpoints
    checkpointHolder = checkpoints(texturasCarregadas);
    scene.add(checkpointHolder);

    //Caminho
    caminho_curva = caminho(texturasCarregadas);
    scene.add(caminho_curva);

    // Avião
    var aviaoObj = aviao(texturasCarregadas);
    aviaoHolder = aviaoObj.aviaoHolder;
    eixo_helice = aviaoObj.eixo_helice;
    scene.add(aviaoHolder);

    // Adiciona a câmera com a visão do piloto do avião (isso é um extra)
    aviaoHolder.add(cameraPiloto);

    // Define que a luz direcional vai iluminar o avião
    dirLight.target = aviaoHolder;

    // Atualiza as sombras estáticas
    light1.shadow.needsUpdate = true;
    light2.shadow.needsUpdate = true;
    light3.shadow.needsUpdate = true;
    light4.shadow.needsUpdate = true;

    // Mantem o avião invisível no primeiro render pra não
    // gerar uma sombra fixa no chão
    aviaoHolder.visible=false;
}

//////////// Avião ////////////////

var posicaoAviaoSalva = new THREE.Vector3();
var rotacaoAviaoSalva = new THREE.Vector3();
var rotacaoAviao = new THREE.Vector3();

// Cria objetos temporários enquanto as variaveis não são
// sobrescritas pelos objetos definitivos
var aviaoHolder = new THREE.Object3D();
var eixo_helice = new THREE.Object3D();

// Adiciona o avião na cena e o posiciona

aviaoHolder.position.set(0.0, 1.0, 0.0);//0,20.0,0

// Cria um boxHelper pra poder visualizar a area de colisão do avião
// const box_1 = new THREE.Box3();
// box_1.setFromObject(aviaoHolder);
// const helper = new THREE.Box3Helper( box_1, 0xffff00 );
// scene.add( helper );


// Define a posição da câmera em relação ao centróide do avião
var cameraPosition = new THREE.Vector3(0.0, 8.0, -20.0);



///////////// Instruções /////////////

var controls = new InfoBox();
  controls.add("Controles:");
  controls.addParagraph();
  controls.add("Modos:");
  controls.add("* Espaço: alterna entre inspeção/simulação");
  controls.add("* C: alterna entre simulação/cockpit");
  controls.addParagraph();
  controls.add("Movimentação:");
  controls.add("* Seta para cima: desce o avião");
  controls.add("* Seta para baixo: sobe o avião");
  controls.add("* Seta para a esquerda: vira o avião para a esquerda");
  controls.add("* Seta para a direita: vira o avião para a direita");
  controls.add("* Q: acelera o avião");
  controls.add("* A: desacelera o avião");
  controls.addParagraph();
  controls.add("* Enter: mostra/oculta caminho");
  controls.addParagraph();
  controls.add("* H: mostra/oculta instruções");
  controls.show();

///////////// Modos de câmera /////////////////////

function alternaModo() {
    //keyboard.update();

    // Alterna entre modo inspeção e simulação
    if (keyboard.down("space")) {
        modoInspecaoAtivo = !modoInspecaoAtivo;

        // Esconde o plano no modo inspeção
        plane.visible = modoInspecaoAtivo === false;
        // Eesconde caminho no modo de inspeção
        caminho_curva.visible = modoInspecaoAtivo===false;
        // Esconde os elementos do ambiente no modo de inspeção
        ambienteHolder.visible = modoInspecaoAtivo===false;
        // Esconde os checkpoints no modo de inspeção
        checkpointHolder.visible = modoInspecaoAtivo===false;

        spotLight.visible = modoInspecaoAtivo===true;
        lightHem.visible = modoInspecaoAtivo===false;
        dirLight.visible = modoInspecaoAtivo===false;
        light1.visible = modoInspecaoAtivo===false;
        light2.visible = modoInspecaoAtivo===false;
        light3.visible = modoInspecaoAtivo===false;
        light4.visible = modoInspecaoAtivo===false;

 
        // Esconde infobox do tempo
        ocultaInfoBox(modoInspecaoAtivo);

        // Registra timestamp de inspeção pra excluir o tempo em inspeção do timer
        registraTimestampInspecao();

        if (modoInspecaoAtivo) {
            trackballControls.enabled = true;
            sound.pause();
            
            somAviaoStatus = aviaoSound.isPlaying;
            
            if(somAviaoStatus == true) {
                aviaoSound.pause();
            }

            // Aqui salva a posição
            posicaoAviaoSalva = aviaoHolder.position.clone();
            rotacaoAviaoSalva = rotacaoAviao.clone();

            // Aqui zera tudo pro modo inspeção
            aviaoHolder.position.set(0.0, 0.0, 0.0);
            aviaoHolder.rotation.set(0.0, 0.0, 0.0);
            rotacaoAviao.set(0,0,0);

        } else {
            trackballControls.enabled = false;
            sound.play();

            if(somAviaoStatus == true) {
                aviaoSound.play();
            }

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
    //dirLightHolder.rotation.y = rotacaoAviao.y;//+ degreesToRadians(180);

    lightPosition.set(
        aviaoHolder.position.x,
        aviaoHolder.position.y,
        aviaoHolder.position.z
    )
    updateLightPosition();

    //Atualiza o boxHelper do avião
    //box_1.setFromObject(aviaoHolder);
}

///////////////////// Movimentação /////////////////////

var delta = clock.getDelta();
var speedRot = THREE.Math.degToRad(45);
var speed = 0; // m/s     //50
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

    // Toca ou pausa o som o avião
    if(speed > 0){
        if(aviaoSound.isPlaying == false){
            aviaoSound.play();
        }
    } else {
        aviaoSound.pause();
    }

    aplicaRotacao();

    // Aplica translação no avião
    aviaoHolder.translateZ(speed * delta);

    // Impede que o avião "entre" no chão
    if(aviaoHolder.position.y < 1.0){
        aviaoHolder.position.set(
            aviaoHolder.position.x,
            1.0,
            aviaoHolder.position.z
        )
    }

    // Roda a hélice
    eixo_helice.rotateY(0.5 * speed * delta);

    //Caminho visualização
    if(keyboard.down("enter")){
        liga_Caminho=!liga_Caminho;
        caminho_curva.visible=liga_Caminho;
    };
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
    "aviao_corpo.png",
    "comunismo.jpg",
    "corpo_opcao2.jpg",
    "crown.png",
    "opcao3.jpg",
    "predio_com_janelas.jpg",
    "wings.jpg"
]

const manager = new THREE.LoadingManager();
manager.onStart = function (url, itemsLoaded, itemsTotal) {
    //console.log('Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.');
    setProgresso(0);
};

manager.onLoad = function () {
    //console.log('Loading complete!');
    mostraBotaoContinuar();    
    
    // Carrega os objetos que dependem das texturas
    carregaObjetos();
};

manager.onProgress = function (url, itemsLoaded, itemsTotal) {
    console.log('Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.');
    setProgresso(itemsLoaded / (texturas.length + 5));
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
function escondeTelaLoading(){
    let telaLoading = document.getElementById("telaLoading");
    telaLoading.style.display = 'none';
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
manager.onError = function (url) {
    console.error('There was an error loading ' + url);
};

const loader = new THREE.TextureLoader(manager);

// Dicionário que contem as texturas carregadas
var texturasCarregadas = {};

// Carrega as texturas no dicionário
for (let i = 0; i < texturas.length; i++) {
    let caminho_textura = "assets\\textures\\" + texturas[i];
    loader.load(caminho_textura, function (object) {
        //Faz um dicionario com as texturas carregadas
        texturasCarregadas[texturas[i]] = object;
    });
}

///////////// Áudio /////////////

var listener = new THREE.AudioListener();
  camera.add( listener );
  cameraSimula.add( listener );
  cameraPiloto.add( listener );

// create a global audio source
const sound = new THREE.Audio( listener );  

// Create ambient sound
var audioLoader = new THREE.AudioLoader(manager);
audioLoader.load( './assets/sounds/musica.mp3', function( buffer ) {
	sound.setBuffer( buffer );
	sound.setLoop( true );
	sound.setVolume( 0.4 );
    sound.play();
    sound.autoplay = true;
});

const aviaoSound = new THREE.Audio( listener );
audioLoader.load( './assets/sounds/aviao.ogg', function ( buffer ) {
  aviaoSound.setBuffer( buffer );
  aviaoSound.setLoop( true );
  aviaoSound.setVolume( 0.2 );
} );

const checkpointSound = new THREE.Audio( listener );
audioLoader.load( './assets/sounds/checkpoint.wav', function ( buffer ) {
    checkpointSound.setBuffer( buffer );
    checkpointSound.setVolume( 0.5 );
} );

const fimPercursoSound = new THREE.Audio( listener );
audioLoader.load( './assets/sounds/final_percurso.wav', function ( buffer ) {
    fimPercursoSound.setBuffer( buffer );
    fimPercursoSound.setVolume( 1.0 );
} );

export default function tocaSomCheckpoint(final){
    if(final){
        checkpointSound.pause();
        fimPercursoSound.play();
    } else {
        checkpointSound.play();
    }
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
var liga_Caminho =true;

function render() {
    stats.update(); // Update FPS
    keyboard.update();

    trackballControls.update();
    requestAnimationFrame(render);
    delta = clock.getDelta();
    
    // Só movimenta o avião se estiver no modo simulação
    if (!modoInspecaoAtivo) {
        movimentaAviao();
        checaColisao(aviaoHolder);
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

    // Coloca o avião como visível no segundo render da cena
    // já que no primeiro render ele faz as sombras estáticas
    // Isso é feito pra não ter uma sombra estática do avião presa
    // no chão.
    if(!aviaoHolder.visible){
        aviaoHolder.visible=true;
    }

    // Visualização das instruções
    if(keyboard.down("H")) {
        instrucaoAtiva = !instrucaoAtiva;
        var infobox = document.getElementById("InfoxBox");
        if(instrucaoAtiva){
            infobox.style.display = 'block';
        } else {
            infobox.style.display = 'none';
        }
    } 
}