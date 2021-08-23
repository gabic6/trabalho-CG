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

// https://threejs.org/docs/index.html?q=Box3#api/en/math/Box3
// Implementação da detecção de colisão por bounding box, do ThreeJS
function detectCollisionCubes(object1, object2) {
    const box_1 = new THREE.Box3();
    const box_2 = new THREE.Box3();

    if(object1 && object2){
        box_1.setFromObject(object1);
        box_2.setFromObject(object2);
        return box_1.intersectsBox (box_2);
    }

    return false;
}

var timer = new THREE.Clock();
var listaCheckpoints = [];
var cont = -1;
var infoTempoCont = new SecondaryBox("Checkpoints atravessados: 0 / Tempo decorrido: 0.000 s");
//var infoTempoCont = new SecondaryBox("Checkpoints: 0 / " + listaCheckpoints.length-1 + " / Tempo decorrido: 0.000 s");
var tempoFinal = 0.0;
var listaTimestamps = [];
var timerIniciado = false;

// Registra o timestamp da mudança de modo de inspeção, pra marcar os intervalos
// de inicio e fim da inspeção
export function registraTimestampInspecao(){
    if(timerIniciado){
        listaTimestamps.push(new Date().getTime());
    }
}

// Calcula o tempo total que o usuário ficou em modo de inspeção pela lista de 
// timestamps gerada pela função anterior
function calculaTempoEmInspecao(){
    var tempoEmInspecao = 0;
    for(let i=0; i<listaTimestamps.length; i+=2){
        var timestampInicial = listaTimestamps[i];
        var timestampFinal = listaTimestamps[i+1];
        tempoEmInspecao += (timestampFinal - timestampInicial) / 1000
    }
    return tempoEmInspecao;
}

//https://www.w3schools.com/jsref/met_document_getelementbyid.asp
// Esconde o infobox de tempo e contagem de checkpoints no modo de inspeção
export function ocultaInfoBox(ocultar){
    var infobox = document.getElementById("box");
    if(ocultar){
        infobox.style.display = 'none';
    } else {
        infobox.style.display = 'block';
    }
}

// Checa se o avião passou pelo checkpoint, conta a passagem dele e processa o tempo
// que levou do usuário cruzar o primeiro checkpoint até cruzar o ultimo
export function checaColisao(aviao) {

    for(var i=0; i<listaCheckpoints.length; i++){
        if(listaCheckpoints[i].visible && detectCollisionCubes(aviao, listaCheckpoints[i])){
            // Deu colisão com o checkpoint atual
            listaCheckpoints[i].visible=false;

            cont += 1;
            var timeElapsed = timer.getElapsedTime() - calculaTempoEmInspecao();
            infoTempoCont.changeMessage("Checkpoints atravessados: " + cont + " / Tempo decorrido: " + timeElapsed.toFixed(3) + " s");
            
            if(cont == 1){
                timer.start();
                timerIniciado = true;            
            }

            if (cont == listaCheckpoints.length - 1) {
                tempoFinal = timeElapsed;
            }
            
        }
        
        if(cont >= 1 && cont < listaCheckpoints.length-1) {
            var timeElapsed = timer.getElapsedTime() - calculaTempoEmInspecao();
            infoTempoCont.changeMessage("Checkpoints atravessados: " + cont + " / Tempo decorrido: " + timeElapsed.toFixed(3) + " s");
        }
        if(cont == listaCheckpoints.length-1){
            timer.stop();
            var timeElapsed = timer.getElapsedTime() - calculaTempoEmInspecao();
            infoTempoCont.changeMessage("Checkpoints atravessados: " + cont + " / Tempo decorrido: " + tempoFinal.toFixed(3) + " s");
        }

    }
}


///////////// Cria e exporta os tórus /////////////////

function criaTorus(posicao) {

    const material = new THREE.MeshPhongMaterial({
        color: "#ffff00",
        shininess: "200",
        opacity: 0.8,
        transparent: true
    });

    const geometry = new THREE.TorusGeometry(20.0, 1.7, 10, 32);
    const torus = new THREE.Mesh(geometry, material);
    torus.position.copy(posicao);
    return torus;
}

function criaCone(posicao) {
    const material = new THREE.MeshPhongMaterial({
        color: "#ffff00",
        shininess: "200",
        opacity: 0.8,
        transparent: true
    });
    
    var cone_geometry = new THREE.ConeGeometry(5.0, 15.0, 4, 1);
    var cone = new THREE.Mesh(cone_geometry, material);
    var coneHolder= new THREE.Object3D();
    coneHolder.add(cone);
    coneHolder.position.copy(posicao);
    cone.rotation.set(degreesToRadians(90),0,0);
    return coneHolder;
}

// Aponta o objeto pra um ponto
// https://threejs.org/docs/#api/en/core/Object3D.lookAt
export default function checkpoints() {
    
    var checkpointHolder = new THREE.Object3D();
    listaCheckpoints = [];
    let numSegmentos = 500;

    const curve = new THREE.CatmullRomCurve3(pontos);
    const curve_points = curve.getPoints(numSegmentos);

    for (var i = 0; i < pontos.length; i++) {
        let ponto = pontos[i];
        //let linhaDebug = null;

        // Acha o ponto com a menor distancia do ponto definido na lista
        // Esse ponto resultante é muito proximo do ponto definido
        let pontoMaisProximo = 0;
        let min = curve_points[pontoMaisProximo].distanceTo(ponto);

        for (let i = 1; i < curve_points.length; i++) {
            let d = curve_points[i].distanceTo(ponto);
            if (d < min) {
                min = d;
                pontoMaisProximo = i;
            }
        }

        // Cria o torus nesse ponto calculado
        let torus = criaTorus(curve_points[pontoMaisProximo]);
        
        // Aponta o torus pro proximo ponto. Isso vai dar uma aproximação razoavel
        // pra tangente sem precisar de calculos complicados
        if (pontoMaisProximo < curve_points.length - 1) {
            // Se pontoMaisProximo não for o ultimo ponto, aponta pro próximo
            torus.lookAt(curve_points[pontoMaisProximo + 1]);
        } else {
            // Se pontoMaisProximo for o ultimo ponto, aponta pro primeiro ponto
            torus.lookAt(curve_points[0]);
        }

        // Helper para visualização da boundingBox dos torus
        // const box_1 = new THREE.Box3();
        // box_1.setFromObject(torus);
        // const helper = new THREE.Box3Helper( box_1, 0xffff00 );

        checkpointHolder.add(torus);
        //checkpointHolder.add(helper);
        listaCheckpoints.push(torus);
    }


    return checkpointHolder;
}

// Pontos onde vão aparecer os checkpoints
var pontos = [
    new THREE.Vector3(0,25,143.8),//A
    new THREE.Vector3(222.1,30,467.1),//B
    new THREE.Vector3(-236.5,60,466.1),//C
    new THREE.Vector3(-558.9,40,688.5),//D
    new THREE.Vector3(-825.7, 55, 288.3),//E
    new THREE.Vector3(-650.0,45, -170.3),//F
    new THREE.Vector3(120.0,60,-420.9),//G
    new THREE.Vector3(291.2,40, -182.5),//H
    new THREE.Vector3(609.0,20,-335.3),//I
    new THREE.Vector3(902.4,30,-249.8),//J
    new THREE.Vector3(853.5,55,-628.7),//K
    new THREE.Vector3(560.1,60,-812.1),//L
    new THREE.Vector3(-130.5,70,-793.7),//M
    new THREE.Vector3(-500,60,-500),//N
    new THREE.Vector3(0,30,-194),//O
    new THREE.Vector3(0,25,143.8)//A
];


export function caminho() {
    
    const curve = new THREE.CatmullRomCurve3( pontos);
    let numSegmentos = 500;

    const points = curve.getPoints( numSegmentos );
    const geometry = new THREE.BufferGeometry().setFromPoints( points);

    const material = new THREE.LineBasicMaterial( {
        color: 'rgb(0,0,0)',
        linewidth: 25,
        linecap: 'round', 
	    linejoin:  'miter'
    } );
    
    var lineObject = new THREE.Object3D();

    // Cria setinhas do caminho com cones
    let numSetas = 50
    for (var i = 0; i < numSegmentos; i+=Math.floor(numSegmentos / numSetas)) {
        let cone_setinha = criaCone(points[i]);
        cone_setinha.lookAt(points[i + 1]);
        lineObject.add(cone_setinha);
    }

    // Create the final object to add to the scene
    const line = new THREE.Line( geometry, material );
    lineObject.add(line);
    return lineObject;
}
