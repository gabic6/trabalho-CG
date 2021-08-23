import * as THREE from '../../build/three.module.js';
import {
    degreesToRadians,
} from "../../libs/util/util.js";

export function predio1(x, z){
    var material = new THREE.MeshLambertMaterial({ color: '#83BAD6'});

    const largura = 30;
    const altura = 140;
    const boxGeometry = new THREE.BoxGeometry( largura, altura, largura );
    const box = new THREE.Mesh( boxGeometry, material );
    box.castShadow = true;
    box.receiveShadow = true;
    // Conversão de coordenadas do draw.io pro threejs
    box.position.set(x + largura/2.0, largura/2.0, z + altura/2.0);

    //caixinha de cima
    var material2 = new THREE.MeshLambertMaterial({ color: 'red'});
    const altura_caixinha = 10;
    const largura_caixinha = 20;
    const geometria_caixinha = new THREE.BoxGeometry( largura_caixinha, altura_caixinha, largura_caixinha );
    const caixinha = new THREE.Mesh( geometria_caixinha, material2 );
    caixinha.castShadow = true;
    caixinha.receiveShadow = true;
    caixinha.position.set(0,1+ altura/2,0);

    box.add(caixinha);
    return box; 
}

export function predio2(x, z){
    var material = new THREE.MeshLambertMaterial({ color: '#83BAD6'});

    const largura = 40;
    const altura = 110;
    const boxGeometry = new THREE.BoxGeometry( largura, altura, largura );
    const box = new THREE.Mesh( boxGeometry, material );
    box.castShadow = true;
    box.receiveShadow = true;
    // Conversão de coordenadas do draw.io pro threejs
    box.position.set(x + largura/2.0, largura/2.0, z + altura/2.0);

    //caixinha de cima
    var material2 = new THREE.MeshLambertMaterial({ color: 'red'});
    const altura_caixinha = 10;
    const largura_caixinha = 20;
    const comprimento_caixinha = 10;
    const geometria_caixinha = new THREE.BoxGeometry( largura_caixinha, altura_caixinha, comprimento_caixinha );
    const caixinha = new THREE.Mesh( geometria_caixinha, material2 );
    caixinha.castShadow = true;
    caixinha.receiveShadow = true;
    caixinha.position.set(0,1+ altura/2,-largura/4.0);

    box.add(caixinha);

    //triangulo 
    var altura_triangulo=10;
    var largura_triangulo=25;
    var comprimento_triangulo=15;
    var pontos = new THREE.Shape();
    pontos.moveTo(0,0);
    pontos.lineTo(0,altura_triangulo);
    pontos.lineTo(largura_triangulo,0);
    pontos.lineTo(0,0); 
    
    const extrudeSettings2 = {
        steps: 2,
        depth: comprimento_triangulo,
        bevelEnabled: false,
        bevelThickness: 0.05,
        bevelSize: 0.05,
        bevelOffset: 0,
        bevelSegments: 10
    };

    var formato_triangulo = new THREE.ExtrudeGeometry(pontos, extrudeSettings2);
    var triangulo = new THREE.Mesh(formato_triangulo, material2);
    triangulo.castShadow = true;
    triangulo.receiveShadow = true;
    triangulo.position.set(-largura/3.0, altura/2,0);

    box.add(triangulo)
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