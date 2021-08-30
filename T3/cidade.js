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
function configuraMaterialPeriferia(textura, repeat_largura, repeat_comprimento,cor,material=0){
    textura = textura.clone();
    textura.needsUpdate = true;
    if(material == 1){
        var material = new THREE.MeshLambertMaterial({ 
            color: cor,
            map: textura,
            transparent: true,
            side:THREE.DoubleSide
        });
    }
    else{
        var material = new THREE.MeshPhongMaterial({ 
            color: cor,
            shininess:"200",
            map: textura,
            side:THREE.DoubleSide
        });
    }
    material.map.repeat.set(
        repeat_largura,
        repeat_comprimento
    );
    material.map.wrapS = THREE.RepeatWrapping;
    material.map.wrapT = THREE.RepeatWrapping;

    return material;
}

function criarCidade(texturasCarregadas, objetoExterno) {
    // Clona a textura do asfalto pra nao precisar carregar ela duas vezes
    // e também pra não atrapalhar as outras ruas horizontais
    var asfaltoClonado = texturasCarregadas['asfalto.jpg'].clone()
    asfaltoClonado.needsUpdate = true;

    // Cria os materiais
    material_asfalto = new THREE.MeshLambertMaterial({ 
        color: '#ffffff', 
        map: texturasCarregadas['asfalto.jpg']
    });
    material_asfalto.map.repeat.set(10,1);
    material_asfalto.map.wrapS = THREE.RepeatWrapping;
    material_asfalto.map.wrapT = THREE.RepeatWrapping;

    material_asfalto_v = new THREE.MeshLambertMaterial({ 
        color: '#ffffff', 
        map: asfaltoClonado
    });
    material_asfalto_v.map.rotation = degreesToRadians(90);
    material_asfalto_v.map.repeat.set(10,1);
    material_asfalto_v.map.wrapS = THREE.RepeatWrapping;
    material_asfalto_v.map.wrapT = THREE.RepeatWrapping;
    material_asfalto_v.anisotropy = 0;

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
    cidadeHolder.add(predio2(182,180, texturasCarregadas));
    
    var predio2_menor = predio2(145,30.6, texturasCarregadas);
    predio2_menor.scale.multiplyScalar(0.75);
    cidadeHolder.add(predio2_menor);

    cidadeHolder.add(predio2(-60,-15, texturasCarregadas));

    cidadeHolder.add(predio2(137.5,-235, texturasCarregadas));

    cidadeHolder.add(predio2(-140,-236, texturasCarregadas));

    //predio3
    cidadeHolder.add(predio3(52,-110, texturasCarregadas));
    
    cidadeHolder.add(predio3(122.5,90, texturasCarregadas));

    cidadeHolder.add(predio3(-216,130, texturasCarregadas));

    var predio3_menor=predio3(52,90, texturasCarregadas);
    predio3_menor.scale.multiplyScalar(0.8);
    predio3_menor.position.y = -90*0.8+107;
    cidadeHolder.add(predio3_menor);

    cidadeHolder.add(predio3(-135,-110, texturasCarregadas));
    
    //predio4
    var predio4_maior = predio4(202,-10, texturasCarregadas);
    predio4_maior.scale.multiplyScalar(1.3);
    cidadeHolder.add(predio4_maior);

    cidadeHolder.add(predio4(30,35, texturasCarregadas).rotateY(degreesToRadians(90)));

    cidadeHolder.add(predio4(-60,-78, texturasCarregadas).rotateY(degreesToRadians(90)));

    var predio4_maior2 = predio4_maior.clone();
    predio4_maior2.position.set(-205,0,-236);
    cidadeHolder.add(predio4_maior2);

    cidadeHolder.add(predio4(-230,-40, texturasCarregadas));
    
    //predio5
    cidadeHolder.add(predio5(182,90, texturasCarregadas));

    cidadeHolder.add(predio5(-166,25, texturasCarregadas).rotateY(degreesToRadians(90)));
    
    cidadeHolder.add(predio5(-63,160, texturasCarregadas));

    var predio5_menor = predio5(30,-48, texturasCarregadas);
    predio5_menor.scale.multiplyScalar(0.75);
    cidadeHolder.add(predio5_menor);

    cidadeHolder.add(predio5(-80,-236, texturasCarregadas));

    //predio6
    cidadeHolder.add(predio6(-80,290, texturasCarregadas));

    cidadeHolder.add(predio6(-202,290, texturasCarregadas));

    cidadeHolder.add(predio6(148,-123, texturasCarregadas).rotateY(degreesToRadians(-90)));
    
    var predio6_menor = predio6(0,0, texturasCarregadas).rotateY(degreesToRadians(90));
    predio6_menor.scale.multiplyScalar(0.75);
    predio6_menor.position.set(120,23/2,200.5);
    // predio6_menor.position.y =23/2 ;
    cidadeHolder.add(predio6_menor);

    var predio6_menor2 = predio6_menor.clone();
    predio6_menor2.position.set(55,23/2,-235);
    predio6_menor2.rotateY(degreesToRadians(180));
    cidadeHolder.add(predio6_menor2);
    
    //areia
    var lados_areia = 20;
    var plano_areia = new THREE.PlaneGeometry(lados_areia,lados_areia);
    var areia_material = configuraMaterialPeriferia(texturasCarregadas["areia.png"],2,2,'white',1);
    var areia = new THREE.Mesh(plano_areia,areia_material);
    areia.position.set(280,0.1,220);
    areia.rotateX(degreesToRadians(90));
    areia.rotateZ(degreesToRadians(-90));
    cidadeHolder.add(areia);

    var areia2 = areia.clone();
    areia2.position.set(280,0.1,196.7);
    cidadeHolder.add(areia2);

    var areia3 = areia.clone();
    areia3.position.set(280,0.1,176.7);
    cidadeHolder.add(areia3);

    var areia4 = areia.clone();
    areia4.position.set(280,0.1,155);
    cidadeHolder.add(areia4);

    var areia5 = areia.clone();
    areia5.position.set(280,0.1,135);
    cidadeHolder.add(areia5);

    var areia6 = areia.clone();
    areia6.position.set(280,0.1,115);
    cidadeHolder.add(areia6);

    var areia7 = areia.clone();
    areia7.position.set(280,0.1,91);
    cidadeHolder.add(areia7);

    var areia8 = areia.clone();
    areia8.position.set(280,0.1,71);
    cidadeHolder.add(areia8);

    var areia9 = areia.clone();
    areia9.position.set(280,0.1,45);
    cidadeHolder.add(areia9);

    var areia10 = areia.clone();
    areia10.position.set(280,0.1,20);
    cidadeHolder.add(areia10);

    var areia11 = areia.clone();
    areia11.position.set(280,0.1,0);
    cidadeHolder.add(areia11);

    var areia12 = areia.clone();
    areia12.position.set(280,0.1,-20);
    cidadeHolder.add(areia12);

    var areia13 = areia.clone();
    areia13.position.set(280,0.1,-40);
    cidadeHolder.add(areia13);

    var areia14 = areia.clone();
    areia14.position.set(280,0.1,-60);
    cidadeHolder.add(areia14);

   

    // Posiciona o holder um pouco mais alto que o plano pra não dar conflito
    cidadeHolder.position.set(0, 0.1, 0);

    // Adiciona objeto externo
    cidadeHolder.add(objetoExterno);

    return cidadeHolder;
}

export default criarCidade;