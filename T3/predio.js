import * as THREE from '../../build/three.module.js';
import {
    degreesToRadians,
} from "../../libs/util/util.js";

export function predio1(x, z){
    var material = new THREE.MeshLambertMaterial({ color: '#83BAD6'});

    const depth = 100 * Math.random() + 10;
    const width = 30;
    const height = 30;
    const boxGeometry = new THREE.BoxGeometry( width, depth, height );
    const box = new THREE.Mesh( boxGeometry, material );
    box.castShadow = true;
    box.receiveShadow = true;

    // Conversão de coordenadas do draw.io pro threejs
    //box.rotateX(degreesToRadians(-90));
    box.position.set(x + width/2.0, depth/2.0, z + height/2.0);

    return box; 
}

export function predio2(x, z){
    var material = new THREE.MeshLambertMaterial({ color: '#83BAD6'});

    const depth = 100 * Math.random() + 10;
    const width = 30;
    const height = 30;
    const boxGeometry = new THREE.BoxGeometry( width, depth, height );
    const box = new THREE.Mesh( boxGeometry, material );
    box.castShadow = true;
    box.receiveShadow = true;

    // Conversão de coordenadas do draw.io pro threejs
    //box.rotateX(degreesToRadians(-90));
    box.position.set(x + width/2.0, depth/2.0, z + height/2.0);

    return box; 
}

export function predio3(x, z){
    var material = new THREE.MeshLambertMaterial({ color: '#83BAD6'});

    const depth = 100 * Math.random() + 10;
    const width = 30;
    const height = 30;
    const boxGeometry = new THREE.BoxGeometry( width, depth, height );
    const box = new THREE.Mesh( boxGeometry, material );
    box.castShadow = true;
    box.receiveShadow = true;

    // Conversão de coordenadas do draw.io pro threejs
    //box.rotateX(degreesToRadians(-90));
    box.position.set(x + width/2.0, depth/2.0, z + height/2.0);

    return box; 
}

export function predio4(x, z){
    var material = new THREE.MeshLambertMaterial({ color: '#83BAD6'});

    const depth = 100 * Math.random() + 10;
    const width = 30;
    const height = 30;
    const boxGeometry = new THREE.BoxGeometry( width, depth, height );
    const box = new THREE.Mesh( boxGeometry, material );
    box.castShadow = true;
    box.receiveShadow = true;

    // Conversão de coordenadas do draw.io pro threejs
    //box.rotateX(degreesToRadians(-90));
    box.position.set(x + width/2.0, depth/2.0, z + height/2.0);

    return box; 
}

export function predio5(x, z){
    var material = new THREE.MeshLambertMaterial({ color: '#83BAD6'});

    const depth = 100 * Math.random() + 10;
    const width = 30;
    const height = 30;
    const boxGeometry = new THREE.BoxGeometry( width, depth, height );
    const box = new THREE.Mesh( boxGeometry, material );
    box.castShadow = true;
    box.receiveShadow = true;

    // Conversão de coordenadas do draw.io pro threejs
    //box.rotateX(degreesToRadians(-90));
    box.position.set(x + width/2.0, depth/2.0, z + height/2.0);

    return box; 
}

export function predio6(x, z){
    var material = new THREE.MeshLambertMaterial({ color: '#83BAD6'});

    const depth = 100 * Math.random() + 10;
    const width = 30;
    const height = 30;
    const boxGeometry = new THREE.BoxGeometry( width, depth, height );
    const box = new THREE.Mesh( boxGeometry, material );
    box.castShadow = true;
    box.receiveShadow = true;

    // Conversão de coordenadas do draw.io pro threejs
    //box.rotateX(degreesToRadians(-90));
    box.position.set(x + width/2.0, depth/2.0, z + height/2.0);

    return box; 
}