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

// https://discourse.threejs.org/t/collisions-two-objects/4125/3
function detectCollisionCubes(object1, object2){
    //console.log(object1.geometry!==null, object2.geometry!==null);
    // if(object1?.geometry!==null && object2?.geometry!==null){
    //     object1.geometry.computeBoundingBox(); //not needed if its already calculated
    //     object2.geometry.computeBoundingBox();
    //     object1.updateMatrixWorld();
    //     object2.updateMatrixWorld();
        
    //     var box1 = object1.geometry.boundingBox.clone();
    //     box1.applyMatrix4(object1.matrixWorld);
    
    //     var box2 = object2.geometry.boundingBox.clone();
    //     box2.applyMatrix4(object2.matrixWorld);
    //     console.log('checaColiscao')
    //     return box1.intersectsBox(box2);
    // }
    return false;
  }

var listaCheckpoints = [];

export function checaColisao(aviao) {
    let meshes = [];
  
    for(var i=0; i<listaCheckpoints.length; i++){
        if(listaCheckpoints[i].visible && detectCollisionCubes(aviao, listaCheckpoints[i])){
            // Deu colisão com o checkpoint atual
            listaCheckpoints[i].visible=false;
        }
    }
}
  

  ///////////// Cria e exporta os tórus /////////////////

  function criaTorus(posicao, rotacao){
      
    const material = new THREE.MeshPhongMaterial({
        color:"#ffff00", 
        shininess:"200", 
        opacity: 0.8,
        transparent: true
    });
    
    const geometry = new THREE.TorusGeometry( 20.0, 1.7, 10, 32 );
    const torus = new THREE.Mesh( geometry, material );
    torus.position.copy(posicao);
    torus.rotation.copy(rotacao);
    return torus;
  }

export default function checkpoints() {
    let meshes = [];
    listaCheckpoints = [];

    for(var i=0; i<pontos.length; i++){
        let ponto = pontos[i];
        let rotacao_ponto = rotacao_pontos[i];
        let torus = criaTorus(ponto, rotacao_ponto);
        meshes.push(torus);
        listaCheckpoints.push(torus);
    }
  
    return meshes;
}
var rotacao_pontos = [
    new THREE.Vector3(0,0,0),
    new THREE.Vector3(0,0,0),
    new THREE.Vector3(0,0,0),
    new THREE.Vector3(0,0,0),
    new THREE.Vector3(0,0,0),
    new THREE.Vector3(0,0,0),
    new THREE.Vector3(0,0,0),
    new THREE.Vector3(0,0,0),
    new THREE.Vector3(0,0,0),
    new THREE.Vector3(0,0,0),
    new THREE.Vector3(0,0,0),
    new THREE.Vector3(0,0,0),
    new THREE.Vector3(0,0,0),
    new THREE.Vector3(0,0,0),
    new THREE.Vector3(0,0,0),
];

/////////////Caminho//////////////////////
var pontos = [
	new THREE.Vector3(0,10,0),//A
	new THREE.Vector3(-920.417,100,617.8045),//B
	new THREE.Vector3(-920.417,80,1258.365),//C
	new THREE.Vector3(215,672,55,669.291),//D
	new THREE.Vector3( 1000,35,1000),//E
    new THREE.Vector3(1593.5,20,0),//F
    new THREE.Vector3(1448.4,50,1231.4),//G
    new THREE.Vector3(699.1,45,735.8),//H
    new THREE.Vector3(106.9,60,738.9),//I
    new THREE.Vector3(-642.4,80,1400.6),//J
    new THREE.Vector3(-1210.5,100,1098.4),//K
    new THREE.Vector3(-1597.2,90,699.6),//L
    new THREE.Vector3(-1246.7,50,240.3),//M
    new THREE.Vector3(-751.2,60,397.4),//N
    new THREE.Vector3(-219.4,100,699.6)//O
    ];
export function caminho() {

    const curve = new THREE.CatmullRomCurve3( pontos);

    const points = curve.getPoints( 50 );
    const geometry = new THREE.BufferGeometry().setFromPoints( points );

    const material = new THREE.LineBasicMaterial( {
        color: 'rgb(0,0,0)',
        linewidth: 100,
        scale: 1,
        linecap: 'round', 
	    linejoin:  'round'
    } );
    // Create the final object to add to the scene
    const curveObject = new THREE.Line( geometry, material );
    return curveObject;
}
