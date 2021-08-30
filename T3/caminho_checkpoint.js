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
import tocaSomCheckpoint from './trabalho3.js';

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
var infoTempoCont = new SecondaryBox();
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

    var num_checkpoints = listaCheckpoints.length - 1;
    
    for(var i=0; i<listaCheckpoints.length; i++){
        if(listaCheckpoints[i].visible && detectCollisionCubes(aviao, listaCheckpoints[i])){
            // Deu colisão com o checkpoint atual
            listaCheckpoints[i].visible=false;

            cont += 1;
            var timeElapsed = timer.getElapsedTime() - calculaTempoEmInspecao();
            infoTempoCont.changeMessage("Checkpoints atravessados: " + cont + "/" + num_checkpoints + " / Tempo decorrido: " + timeElapsed.toFixed(3) + " s");
            
            if(cont == 1){
                timer.start();
                timerIniciado = true;            
            }

            if (cont == listaCheckpoints.length - 1) {
                tempoFinal = timeElapsed;
                tocaSomCheckpoint(true);
            } else {
                tocaSomCheckpoint(false);
            }
            
        }
        
        if(cont >= 1 && cont < listaCheckpoints.length-1) {
            var timeElapsed = timer.getElapsedTime() - calculaTempoEmInspecao();
            infoTempoCont.changeMessage("Checkpoints atravessados: " + cont + "/" + num_checkpoints + " / Tempo decorrido: " + timeElapsed.toFixed(3) + " s");
        }
        if(cont == listaCheckpoints.length-1){
            timer.stop();
            var timeElapsed = timer.getElapsedTime() - calculaTempoEmInspecao();
            infoTempoCont.changeMessage("Checkpoints atravessados: " + cont + "/" + num_checkpoints + " / Tempo decorrido: " + tempoFinal.toFixed(3) + " s");
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
export default function checkpoints(texturasCarregadas) {
    
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

    infoTempoCont.changeMessage("Checkpoints atravessados: 0/" + (listaCheckpoints.length - 1) + " / Tempo decorrido: 0.000 s");

    return checkpointHolder;
}

// Pontos onde vão aparecer os checkpoints
var pontos = [
    new THREE.Vector3(-685, 25, 85),//A
    new THREE.Vector3(-545, 30, 425),//B
    new THREE.Vector3(-180, 60, 580),//C
    new THREE.Vector3(13, 40, 315),//D
    new THREE.Vector3(10, 55, -165),//E
    new THREE.Vector3(108, 45, -625),//F
    new THREE.Vector3(589, 60, -615),//G
    new THREE.Vector3(735, 40, -155),//H
    new THREE.Vector3(745, 20, 245),//I
    new THREE.Vector3(525, 30, 515),//J
    new THREE.Vector3(183, 55, 355),//K
    new THREE.Vector3(-165, 60, 90),//L
    new THREE.Vector3(-160, 70, -385),//M
    new THREE.Vector3(-335, 60, -785),//N
    new THREE.Vector3(-685, 30, -550),//O
    new THREE.Vector3(-685, 25, 85),//A
];



export function caminho(texturasCarregadas) {
    
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
