import * as THREE from '../../build/three.module.js';
import {
    degreesToRadians,
} from "../../libs/util/util.js";

/**
 * Faz a conversão de coordenadas do Diagrams.net (Draw.io) para o Three.JS
 * @param {THREE.Mesh} objeto 
 * @param {number} x 
 * @param {number} z 
 * @param {number} largura 
 * @param {number} altura 
 * @param {number} comprimento 
 */
 function setPosicaoDraw(objeto, x, z, largura, altura, comprimento){
    objeto.position.set(x + largura/2.0, altura/2.0, z + comprimento / 2.0);
}

export function predio1(x, z){
    var material = new THREE.MeshLambertMaterial({ color: '#83BAD6'});

    const largura = 30; // x
    const comprimento = 30; // z
    const altura = 140; // y
    const boxGeometry = new THREE.BoxGeometry( largura, altura, comprimento );
    const box = new THREE.Mesh( boxGeometry, material );
    box.castShadow = true;
    box.receiveShadow = true;
    // Conversão de coordenadas do draw.io pro threejs
    box.position.set(x + largura/2.0, altura / 2.0, z + comprimento/2.0);

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
    const comprimento = largura;
    const boxGeometry = new THREE.BoxGeometry( largura, altura, comprimento );
    const box = new THREE.Mesh( boxGeometry, material );
    box.castShadow = true;
    box.receiveShadow = true;
    // Conversão de coordenadas do draw.io pro threejs
    box.position.set(x + largura/2.0, altura / 2.0, z + comprimento/2.0);

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

    const depth1 = 60;//altura
    const width1 = 50;//largura
    const height1 = 90;//comprimento
    const boxGeometry1 = new THREE.BoxGeometry( width1, height1, depth1 );
    const box1 = new THREE.Mesh( boxGeometry1, material );
    box1.castShadow = true;
    box1.receiveShadow = true;

    const depth2 = 50;
    const width2 = 40;
    const height2 = 20;
    const boxGeometry2 = new THREE.BoxGeometry( width2, height2, depth2 );
    const box2 = new THREE.Mesh( boxGeometry2, material );
    box2.castShadow = true;
    box2.receiveShadow = true;
    box1.add(box2);
    box2.translateY(height1/2 + height2/2);

    const depth3 = 35;
    const width3 = 25;
    const height3 = 20;
    const boxGeometry3 = new THREE.BoxGeometry( width3, height3, depth3 );
    const box3 = new THREE.Mesh( boxGeometry3, material );
    box3.castShadow = true;
    box3.receiveShadow = true;
    box2.add(box3);
    box3.translateY(height2/2 + height3/2);

    const depth4 = 15;
    const width4 = 20;
    const height4 = 15;
    const boxGeometry4 = new THREE.BoxGeometry( width4, height4, depth4 );
    const box4 = new THREE.Mesh( boxGeometry4, material );
    box4.castShadow = true;
    box4.receiveShadow = true;
    box3.add(box4);
    box4.translateY(height3/2 + height4/2);

    box1.translateY(height1/2);
    box1.translateX(x);
    box1.translateZ(z);

    // Conversão de coordenadas do draw.io pro threejs
    //box.rotateX(degreesToRadians(-90));
    //box.position.set(x + width/2.0, depth/2.0, z + height/2.0);

    return box1; 
}

export function predio4(x, z){
    var material = new THREE.MeshLambertMaterial({ color: '#83BAD6'});

    // Dimensões
    const largura1 = 15;
    const altura1 = 70;
    const comprimento1 = 20;

    const largura2 = 10;
    const altura2 = 70;
    const comprimento2 = 20;

    const boxGeometry1 = new THREE.BoxGeometry( largura1, altura1, comprimento1 );
    const box1 = new THREE.Mesh( boxGeometry1, material );
    box1.castShadow = true;
    box1.receiveShadow = true;
    //Foi criado um group (CRTL-G) no Draw e essa posição x,z é de dentro do grupo
    setPosicaoDraw(box1, 0, 0, largura1, altura1, comprimento1);

    const boxGeometry2 = new THREE.BoxGeometry( largura2, altura2, comprimento2 );
    const box2 = new THREE.Mesh( boxGeometry2, material );
    box2.castShadow = true;
    box2.receiveShadow = true;
    //Foi criado um group (CRTL-G) no Draw e essa posição x,z é de dentro do grupo
    setPosicaoDraw(box2, 5, 20, largura2, altura2, comprimento2);

    var predioHolder = new THREE.Object3D();
    predioHolder.add(box1);
    predioHolder.add(box2);

    // Aqui vai direto o x,z porque a conversão de coordenadas já foi feita 
    // na função setPosicaoDraw
    predioHolder.position.set(x, 0, z);

    return predioHolder; 
}

export function predio5(x, z){
    var material = new THREE.MeshLambertMaterial({ color: '#83BAD6'});

    // Dimensões
    const largura1 = 20;
    const altura1 = 30;
    const comprimento1 = 60;

    const largura2 = 40;
    const altura2 = 30;
    const comprimento2 = 20;

    const boxGeometry1 = new THREE.BoxGeometry( largura1, altura1, comprimento1 );
    const box1 = new THREE.Mesh( boxGeometry1, material );
    box1.castShadow = true;
    box1.receiveShadow = true;
    //Foi criado um group (CRTL-G) no Draw e essa posição x,z é de dentro do grupo
    setPosicaoDraw(box1, 0, 0, largura1, altura1, comprimento1);

    const boxGeometry2 = new THREE.BoxGeometry( largura2, altura2, comprimento2 );
    const box2 = new THREE.Mesh( boxGeometry2, material );
    box2.castShadow = true;
    box2.receiveShadow = true;
    //Foi criado um group (CRTL-G) no Draw e essa posição x,z é de dentro do grupo
    setPosicaoDraw(box2, 20, 0, largura2, altura2, comprimento2);

    // Caixa em cima do prédio
    const boxGeometry3 = new THREE.BoxGeometry( 10, 6, 10 );
    const box3 = new THREE.Mesh( boxGeometry3, material );
    box3.castShadow = true;
    box3.receiveShadow = true;
    box3.position.set(0, 3 + altura1/2.0, (comprimento1 / 2.0) - 10);
    box1.add(box3)

    var predioHolder = new THREE.Object3D();
    predioHolder.add(box1);
    predioHolder.add(box2);

    // Aqui vai direto o x,z porque a conversão de coordenadas já foi feita 
    // na função setPosicaoDraw
    predioHolder.position.set(x, 0, z);

    return predioHolder; 
}

export function predio6(x, z){
    var material = new THREE.MeshLambertMaterial({ color: '#83BAD6'});

    const depth1 = 80;
    const width1 = 60;
    const height1 = 30;
    const boxGeometry1 = new THREE.BoxGeometry( width1, height1, depth1 );
    const box1 = new THREE.Mesh( boxGeometry1, material );
    box1.castShadow = true;
    box1.receiveShadow = true;

    const depth2 = 80;
    const width2 = 30;
    const height2 = 20;
    const boxGeometry2 = new THREE.BoxGeometry( width2, height2, depth2 );
    const box2 = new THREE.Mesh( boxGeometry2, material );
    box2.castShadow = true;
    box2.receiveShadow = true;

    box2.position.set(width1/2 + width2/2, -(height1/2 - height2/2), 0);

    box1.add(box2);

    box1.translateY(height1/2);
    box1.translateX(x);
    box1.translateZ(z);

    // Conversão de coordenadas do draw.io pro threejs
    //box.rotateX(degreesToRadians(-90));
    //box.position.set(x + width/2.0, depth/2.0, z + height/2.0);

    return box1; 
}