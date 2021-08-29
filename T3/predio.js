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
function configuraMaterial(textura, repeat_largura, repeat_comprimento,cor){
    textura = textura.clone();
    textura.needsUpdate = true;
    var material = new THREE.MeshLambertMaterial({ 
        color: cor,
        map: textura,
        side:THREE.DoubleSide
    });
    material.map.repeat.set(
        repeat_largura,
        repeat_comprimento
    );
    material.map.wrapS = THREE.RepeatWrapping;
    material.map.wrapT = THREE.RepeatWrapping;

    return material;
}

const materiaisTeste = [
    new THREE.MeshLambertMaterial({color: 'red', side:THREE.DoubleSide}),
    new THREE.MeshLambertMaterial({color: 'green', side:THREE.DoubleSide}),
    new THREE.MeshLambertMaterial({color: 'blue', side:THREE.DoubleSide}),
    new THREE.MeshLambertMaterial({color: '#ff5500', side:THREE.DoubleSide}),//laranja
    new THREE.MeshLambertMaterial({color: '#fc17ed', side:THREE.DoubleSide}),//rosa
    new THREE.MeshLambertMaterial({color: '#5c5b5a', side:THREE.DoubleSide})//cinza
]

export function predio1(x, z,texturasCarregadas){
    const largura = 30; // x
    const comprimento = 30; // z
    const altura = 140; // y
    const boxGeometry = new THREE.BoxGeometry( largura, altura, comprimento );

    var box_material = [
        configuraMaterial(texturasCarregadas["predio1_teste.jpg"],1,3,'#ffffff'),
        configuraMaterial(texturasCarregadas["predio1_teste.jpg"],1,3,'#ffffff'),
        configuraMaterial(texturasCarregadas["concreto.jpg"],1,1,"rgb(59,69,71)"),
        configuraMaterial(texturasCarregadas["predio1_teste.jpg"],1,3,'#ffffff'),
        configuraMaterial(texturasCarregadas["predio1_teste.jpg"],1,3,'#ffffff'),
        configuraMaterial(texturasCarregadas["predio1_teste.jpg"],1,3,'#ffffff')
        // new THREE.MeshLambertMaterial({map:texturasCarregadas["predio1_sem_cano.jpg"],side:THREE.DoubleSide}),
        // new THREE.MeshLambertMaterial({map:texturasCarregadas["predio1_sem_cano.jpg"],side:THREE.DoubleSide}),
        // new THREE.MeshLambertMaterial({map:texturasCarregadas["concreto.jpg"],side:THREE.DoubleSide,color:"rgb(59,69,71)"}),
        // new THREE.MeshLambertMaterial({map:texturasCarregadas["predio1_cano.jpg"],side:THREE.DoubleSide}),
        // new THREE.MeshLambertMaterial({map:texturasCarregadas["predio1_cano.jpg"],side:THREE.DoubleSide}),
        // new THREE.MeshLambertMaterial({map:texturasCarregadas["predio1_cano.jpg"],side:THREE.DoubleSide})
        
    ];

    const box = new THREE.Mesh( boxGeometry, box_material );
    box.castShadow = true;
    box.receiveShadow = true;
    // Conversão de coordenadas do draw.io pro threejs
    box.position.set(x + largura/2.0, altura / 2.0, z + comprimento/2.0);

    //caixinha de cima
    var box_material2 = new THREE.MeshLambertMaterial({ color: 'red'});
    // var box_material2 = [
    //     configuraMaterial(texturasCarregadas["predio1_caixinha.jpg"],1,1,'#ffffff'),
    //     configuraMaterial(texturasCarregadas["predio1_caixinha_porta.jpg"],1,1,'#ffffff'),
    //     configuraMaterial(texturasCarregadas["container_roof.jpg"],1,1,"rgb(59,69,71)"),
    //     configuraMaterial(texturasCarregadas["predio1_caixinha.jpg"],1,1,'#ffffff'),
    //     configuraMaterial(texturasCarregadas["predio1_caixinha.jpg"],1,1,'#ffffff'),
    //     configuraMaterial(texturasCarregadas["predio1_caixinha.jpg"],1,1,'#ffffff')
    //     // new THREE.MeshLambertMaterial({map:texturasCarregadas["predio1_caixinha_porta.jpg"],side:THREE.DoubleSide}),
    //     // new THREE.MeshLambertMaterial({map:texturasCarregadas["predio1_caixinha.jpg"],side:THREE.DoubleSide}),
    //     // new THREE.MeshLambertMaterial({map:texturasCarregadas["container_roof.jpg"],side:THREE.DoubleSide, color:"rgb(59,69,71)"}),//rgb(110,118,119)
    //     // new THREE.MeshLambertMaterial({map:texturasCarregadas["predio1_caixinha.jpg"],side:THREE.DoubleSide}),
    //     // new THREE.MeshLambertMaterial({map:texturasCarregadas["predio1_caixinha.jpg"],side:THREE.DoubleSide}),
    //     // new THREE.MeshLambertMaterial({map:texturasCarregadas["concreto.jpg"],side:THREE.DoubleSide})
    // ];
    const altura_caixinha = 10;
    const largura_caixinha = 20;
    const geometria_caixinha = new THREE.BoxGeometry( largura_caixinha, altura_caixinha, largura_caixinha );
    const caixinha = new THREE.Mesh( geometria_caixinha, box_material2 );
    caixinha.castShadow = true;
    caixinha.receiveShadow = true;
    caixinha.position.set(0,1+ altura/2,0);

    box.add(caixinha);

    var objeto = new THREE.Object3D();
    objeto.add(box);
    return objeto; 
}

export function predio2(x, z, texturasCarregadas){

    const largura = 40;
    const altura = 110;
    const comprimento = largura;
    const boxGeometry = new THREE.BoxGeometry( largura, altura, comprimento );

    var box_material = [
        configuraMaterial(texturasCarregadas["predio2_sem_cano.jpg"],1,1,'#ffffff'),
        configuraMaterial(texturasCarregadas["predio2_sem_cano.jpg"],1,1,'#ffffff'),
        configuraMaterial(texturasCarregadas["concreto.jpg"],1,1,"rgb(59,69,71)"),
        configuraMaterial(texturasCarregadas["predio2_sem_cano.jpg"],1,1,'#ffffff'),
        configuraMaterial(texturasCarregadas["predio2_sem_cano.jpg"],1,1,'#ffffff'),
        configuraMaterial(texturasCarregadas["predio2_sem_cano.jpg"],1,1,'#ffffff')
        // new THREE.MeshLambertMaterial({map:texturasCarregadas["predio1_sem_cano.jpg"],side:THREE.DoubleSide}),
        // new THREE.MeshLambertMaterial({map:texturasCarregadas["predio1_sem_cano.jpg"],side:THREE.DoubleSide}),
        // new THREE.MeshLambertMaterial({map:texturasCarregadas["concreto.jpg"],side:THREE.DoubleSide,color:"rgb(59,69,71)"}),
        // new THREE.MeshLambertMaterial({map:texturasCarregadas["predio1_cano.jpg"],side:THREE.DoubleSide}),
        // new THREE.MeshLambertMaterial({map:texturasCarregadas["predio1_cano.jpg"],side:THREE.DoubleSide}),
        // new THREE.MeshLambertMaterial({map:texturasCarregadas["predio1_cano.jpg"],side:THREE.DoubleSide})
        
    ];

    const box = new THREE.Mesh( boxGeometry, box_material );
    box.castShadow = true;
    box.receiveShadow = true;
    // Conversão de coordenadas do draw.io pro threejs
    box.position.set(x + largura/2.0, altura / 2.0, z + comprimento/2.0);

    //caixinha de cima
    const altura_caixinha = 10;
    const largura_caixinha = 20;
    const comprimento_caixinha = 10;
    const geometria_caixinha = new THREE.BoxGeometry( largura_caixinha, altura_caixinha, comprimento_caixinha );

    var box_material2 = [
        configuraMaterial(texturasCarregadas["predio2_caixinha.jpg"],1,1,'#ffffff'),
        configuraMaterial(texturasCarregadas["predio2_caixinha_porta.jpg"],1,1,'#ffffff'),
        configuraMaterial(texturasCarregadas["container_roof.jpg"],1,1,"rgb(59,69,71)"),
        configuraMaterial(texturasCarregadas["predio2_caixinha.jpg"],1,1,'#ffffff'),
        configuraMaterial(texturasCarregadas["predio2_caixinha.jpg"],1,1,'#ffffff'),
        configuraMaterial(texturasCarregadas["predio2_caixinha.jpg"],1,1,'#ffffff')
        // new THREE.MeshLambertMaterial({map:texturasCarregadas["predio1_caixinha_porta.jpg"],side:THREE.DoubleSide}),
        // new THREE.MeshLambertMaterial({map:texturasCarregadas["predio1_caixinha.jpg"],side:THREE.DoubleSide}),
        // new THREE.MeshLambertMaterial({map:texturasCarregadas["container_roof.jpg"],side:THREE.DoubleSide, color:"rgb(59,69,71)"}),//rgb(110,118,119)
        // new THREE.MeshLambertMaterial({map:texturasCarregadas["predio1_caixinha.jpg"],side:THREE.DoubleSide}),
        // new THREE.MeshLambertMaterial({map:texturasCarregadas["predio1_caixinha.jpg"],side:THREE.DoubleSide}),
        // new THREE.MeshLambertMaterial({map:texturasCarregadas["concreto.jpg"],side:THREE.DoubleSide})
    ];

    const caixinha = new THREE.Mesh( geometria_caixinha, box_material2 );
    caixinha.castShadow = true;
    caixinha.receiveShadow = true;
    caixinha.position.set(0,1+ altura/2,-largura/4.0);

    box.add(caixinha);

    //triangulo 
    var altura_triangulo=10;
    var largura_triangulo=22;
    var comprimento_triangulo=15;
    const boxGeometry2 = new THREE.BoxGeometry(largura_triangulo,altura_triangulo, comprimento_triangulo );
    var box_material3 = [
        configuraMaterial(texturasCarregadas["predio2_triangulo_lados.jpg"],1,1,'#ffffff'),
        configuraMaterial(texturasCarregadas["predio2_triangulo_frente.jpg"],1,1,'#ffffff'),
        configuraMaterial(texturasCarregadas["predio2_roof.jpg"],1,1.4,"rgb(59,69,71)"),
        configuraMaterial(texturasCarregadas["predio2_triangulo_lados.jpg"],1,1,'#ffffff'),
        configuraMaterial(texturasCarregadas["predio2_triangulo_lados.jpg"],1,1,'#ffffff'),
        configuraMaterial(texturasCarregadas["predio2_triangulo_lados.jpg"],1,1,'#ffffff')
        // configuraMaterial(texturasCarregadas["predio2_triangulo_frente.jpg"],0.08,0.08,'#ffffff'),
        // configuraMaterial(texturasCarregadas["predio2_triangulo_frente.jpg"],0.08,0.08,'#ffffff'),
        // configuraMaterial(texturasCarregadas["predio2_triangulo_frente.jpg"],0.08,0.08,'#ffffff'),
        // configuraMaterial(texturasCarregadas["predio2_triangulo_frente.jpg"],0.08,0.08,'#ffffff'),
        // configuraMaterial(texturasCarregadas["predio2_triangulo_frente.jpg"],0.08,0.08,'#ffffff'),
        // configuraMaterial(texturasCarregadas["predio2_triangulo_frente.jpg"],0.08,0.08,'#ffffff')
        // configuraMaterial(texturasCarregadas["predio2_triangulo_lados.jpg"],1,1,'#ffffff')
        // new THREE.MeshLambertMaterial({map:texturasCarregadas["predio1_caixinha_porta.jpg"],side:THREE.DoubleSide}),
        // new THREE.MeshLambertMaterial({map:texturasCarregadas["predio1_caixinha.jpg"],side:THREE.DoubleSide}),
        // new THREE.MeshLambertMaterial({map:texturasCarregadas["container_roof.jpg"],side:THREE.DoubleSide, color:"rgb(59,69,71)"}),//rgb(110,118,119)
        // new THREE.MeshLambertMaterial({map:texturasCarregadas["predio1_caixinha.jpg"],side:THREE.DoubleSide}),
        // new THREE.MeshLambertMaterial({map:texturasCarregadas["predio1_caixinha.jpg"],side:THREE.DoubleSide}),
        // new THREE.MeshLambertMaterial({map:texturasCarregadas["concreto.jpg"],side:THREE.DoubleSide})
    ];
    var triangulo = new THREE.Mesh(boxGeometry2, box_material3);
    triangulo.castShadow = true;
    triangulo.receiveShadow = true;
    triangulo.position.set(-largura/2.0 +20.0,altura/2.0 +6.0,9.0);

    box.add(triangulo)

    var holderObj = new THREE.Object3D();
    holderObj.add(box);
    return holderObj; 
}

export function predio3(x, z, texturasCarregadas){
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

export function predio4(x, z, texturasCarregadas){
    var material = new THREE.MeshLambertMaterial({ color: '#83BAD6'});

    var building_l2 = texturasCarregadas["building_l2.png"];
    var concreto = texturasCarregadas["concreto.jpg"];

    const materiaisBox1 = [
        configuraMaterial(building_l2, 1, 3,'white'),//lateral
        configuraMaterial(building_l2, 1, 3,'white'),//lateral
        configuraMaterial(concreto, 1, 1,'white'),//topo
        configuraMaterial(concreto, 1, 1,'white'),//base
        configuraMaterial(concreto, 2, 7,'white'),//lateral
        configuraMaterial(concreto, 2, 7,'white'),//lateral
    ];

    const materiaisBox2 = [
        configuraMaterial(building_l2, 1, 3,'white'),//lateral
        configuraMaterial(building_l2, 1, 3,'white'),//lateral
        configuraMaterial(concreto, 1, 1,'white'),//topo
        configuraMaterial(concreto, 1, 1,'white'),//base
        configuraMaterial(concreto, 2, 7,'white'),//lateral
        configuraMaterial(concreto, 2, 7,'white'),//lateral
    ];
    
    // Dimensões
    const largura1 = 15;
    const altura1 = 70;
    const comprimento1 = 20;

    const largura2 = 10;
    const altura2 = 70;
    const comprimento2 = 20;

    const boxGeometry1 = new THREE.BoxGeometry( largura1, altura1, comprimento1 );
    const box1 = new THREE.Mesh( boxGeometry1, materiaisBox1 );//materiaisTeste
    box1.castShadow = true;
    box1.receiveShadow = true;
    //Foi criado um group (CRTL-G) no Draw e essa posição x,z é de dentro do grupo
    setPosicaoDraw(box1, 0, 0, largura1, altura1, comprimento1);

    const boxGeometry2 = new THREE.BoxGeometry( largura2, altura2, comprimento2 );
    const box2 = new THREE.Mesh( boxGeometry2, materiaisBox2 );
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

export function predio5(x, z, texturasCarregadas){
    var material = new THREE.MeshLambertMaterial({ color: '#ff00ff'});
    //var parede_tijolo = new THREE.MeshLambertMaterial({ color: '#ff00ff'});
    //var apto_block5 = texturasCarregadas["apartment_block5.png"];
    var building_factory = texturasCarregadas["building_factory.png"];
    var concreto = texturasCarregadas["concreto.jpg"];
    var container_roof = texturasCarregadas["container_roof.jpg"];
    var parede_tijolo = texturasCarregadas["brick01.jpg"];

    //Materiais box1 apartment_block5.png
    const materiaisBox1 = [
        configuraMaterial(building_factory, 4, 2,'white'),//lateral
        configuraMaterial(building_factory, 4, 2,'white'),//lateral
        configuraMaterial(concreto, 1, 3,'white'),//topo
        configuraMaterial(concreto, 1, 1,'white'),//base
        configuraMaterial(parede_tijolo, 15, 20,'white'),//lateral
        configuraMaterial(parede_tijolo, 15, 20,'white'),//lateral
    ];

    // Dimensões
    const largura1 = 20;
    const altura1 = 30;
    const comprimento1 = 60;

    const boxGeometry1 = new THREE.BoxGeometry( largura1, altura1, comprimento1 );
    const box1 = new THREE.Mesh( boxGeometry1, materiaisBox1 );//materiaisTeste
    box1.castShadow = true;
    box1.receiveShadow = true;
    //Foi criado um group (CRTL-G) no Draw e essa posição x,z é de dentro do grupo
    setPosicaoDraw(box1, 0, 0, largura1, altura1, comprimento1);

    // Caixa em cima do prédio
    const boxGeometry3 = new THREE.BoxGeometry( 10, 6, 10 );
    const box3 = new THREE.Mesh( boxGeometry3, configuraMaterial(container_roof, 1, 1,'white') );
    box3.castShadow = true;
    box3.receiveShadow = true;
    box3.position.set(0, 3 + altura1/2.0, (comprimento1 / 2.0) - 10);
    box1.add(box3)

    var predioHolder = new THREE.Object3D();
    predioHolder.add(box1);

    // Aqui vai direto o x,z porque a conversão de coordenadas já foi feita 
    // na função setPosicaoDraw
    predioHolder.position.set(x, 0, z);

    return predioHolder; 
}

export function predio6(x, z, texturasCarregadas){
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