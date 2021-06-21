
import * as THREE from '../build/three.module.js';

import {
    degreesToRadians,
} from "../libs/util/util.js";

export default function aviao() {
    var material_aviao = new THREE.MeshPhongMaterial();

    //cilindro1 - corpo principal do avião
    var diametro_cilindro1 = 1.27;
    var altura_cilindro1 = 4.0;
    var geometria_cilindro1 = new THREE.CylinderGeometry(diametro_cilindro1 / 2.0, diametro_cilindro1 / 2.0, altura_cilindro1, 18);
    var cilindro1 = new THREE.Mesh(geometria_cilindro1, material_aviao);
    cilindro1.position.set(0.0, 0.0, 0.0);
    cilindro1.rotation.set(Math.PI / 2, 0, 0);
 

    //esfera bico
    var raio_esfera_bico = diametro_cilindro1 / 2.0;
    var geometria_esfera_bico = new THREE.SphereGeometry(raio_esfera_bico, 18, 18);
    var esfera_bico = new THREE.Mesh(geometria_esfera_bico, material_aviao);
    esfera_bico.position.set(0.0, altura_cilindro1 / 2.0, 0.0);
    cilindro1.add(esfera_bico)

    //"esfera" cabine
    var raio_cabine = diametro_cilindro1 / 2.1;
    var geometria_cabine = new THREE.SphereGeometry(raio_cabine, 18, 18);
    geometria_cabine.scale(0.6, 1.8, 1);
    var cabine = new THREE.Mesh(geometria_cabine, material_aviao);
    cabine.position.set(0.0, 0.0, -diametro_cilindro1 / 3.0);
    cilindro1.add(cabine);

    //cilindro2
    var altura_eixo_helice = 0.2;
    var diametro_eixo_helice = 0.1;
    var geometria_eixo_helice = new THREE.CylinderGeometry(diametro_eixo_helice / 2.0, diametro_eixo_helice / 2.0, altura_eixo_helice, 18);
    var eixo_helice = new THREE.Mesh(geometria_eixo_helice, material_aviao);
    esfera_bico.add(eixo_helice);
    eixo_helice.position.set(0.0, raio_esfera_bico + altura_eixo_helice / 2.0, 0.0);

    //helices
    var tamanho_helice = 1.0;
    var largura_helice = 0.15;
    var angulo_ataque = 15.0;
    var profundidade_helice = 0.015;
    //helice 1
    var helice1_geometry = new THREE.BoxGeometry(tamanho_helice, largura_helice, profundidade_helice);
    helice1_geometry.translate(tamanho_helice / 2.0, 0.0, 0.0);
    helice1_geometry.rotateX(degreesToRadians(angulo_ataque))
    var helice1 = new THREE.Mesh(helice1_geometry, material_aviao);
    helice1.position.set(0.0, altura_eixo_helice / 2.0 - profundidade_helice / 2.0, 0.0);
    helice1.rotation.set(Math.PI / 2, 0, 0);
    eixo_helice.add(helice1);
    //helice 2
    var helice2_geometry = new THREE.BoxGeometry(tamanho_helice, largura_helice, profundidade_helice);
    helice2_geometry.translate(tamanho_helice / 2.0, 0.0, 0.0);
    helice2_geometry.rotateX(degreesToRadians(angulo_ataque))
    var helice2 = new THREE.Mesh(helice2_geometry, material_aviao);
    helice2.position.set(0.0, altura_eixo_helice / 2.0 - profundidade_helice / 2.0, 0.0);
    helice2.rotation.set(Math.PI / 2, 0, degreesToRadians(120));
    eixo_helice.add(helice2);
    //helice 3
    var helice3_geometry = new THREE.BoxGeometry(tamanho_helice, largura_helice, profundidade_helice);
    helice3_geometry.translate(tamanho_helice / 2.0, 0.0, 0.0);
    helice3_geometry.rotateX(degreesToRadians(angulo_ataque))
    var helice3 = new THREE.Mesh(helice3_geometry, material_aviao);
    helice3.position.set(0.0, altura_eixo_helice / 2.0 - profundidade_helice / 2.0, 0.0);
    helice3.rotation.set(Math.PI / 2, 0, degreesToRadians(240));
    eixo_helice.add(helice3);


    //cilindro3
    var diametro_cilindro3 = 0.635;
    var altura_cilindro3 = 3.5;
    var geometria_cilindro3 = new THREE.CylinderGeometry(diametro_cilindro1 / 2.0, diametro_cilindro3 / 2.0, altura_cilindro3, 18);
    var cilindro3 = new THREE.Mesh(geometria_cilindro3, material_aviao);
    cilindro3.position.set(0.0, 0.06 - (altura_cilindro1 / 2.0) - (altura_cilindro3 / 2.0), -0.15);
    cilindro3.rotation.set(degreesToRadians(5), 0.0, 0.0)
    cilindro1.add(cilindro3);

    //asas maiores
    var altura_asas_maiores = 0.1;
    var largura_asas_maiores = 11.0;
    var profundidade_asas_maiores = 1.5;
    var geometria_asas_maiores = new THREE.BoxGeometry(largura_asas_maiores, altura_asas_maiores, profundidade_asas_maiores);
    var asas_maiores = new THREE.Mesh(geometria_asas_maiores, material_aviao);
    asas_maiores.position.set(0.0, 0.0, 0.0);
    asas_maiores.rotation.set(Math.PI / 2, 0, 0);
    cilindro1.add(asas_maiores);
    
    //Ponta das asas maiores
    var formato_para = new THREE.Shape();
    formato_para.moveTo(0,0);
    formato_para.lineTo(0,altura_asas_maiores);
    formato_para.lineTo(0.3,(altura_asas_maiores)+0.1);
    formato_para.lineTo(0.3,-altura_asas_maiores); 
    
    const extrudeSettings2 = {
        steps: 2,
        depth: profundidade_asas_maiores,
        bevelEnabled: false,
        bevelThickness: 0.05,
        bevelSize: 0.05,
        bevelOffset: 0,
        bevelSegments: 10
    };

    var shapePara = new THREE.ExtrudeGeometry(formato_para, extrudeSettings2);
    //ponta direita
    var pontaAsas_aviao_direita = new THREE.Mesh(shapePara, material_aviao);
    pontaAsas_aviao_direita.rotation.set(degreesToRadians(180),0,degreesToRadians(10));
    pontaAsas_aviao_direita.position.set(largura_asas_maiores/2.0 ,altura_asas_maiores/2.0,profundidade_asas_maiores/2.0);
    asas_maiores.add(pontaAsas_aviao_direita);
    //ponta esquerda
    var pontaAsas_aviao_esquerda = new THREE.Mesh(shapePara, material_aviao);
    pontaAsas_aviao_esquerda.rotation.set(0.0,0.0,degreesToRadians(190));
    pontaAsas_aviao_esquerda.position.set(-largura_asas_maiores/2.0 ,altura_asas_maiores/2.0,-profundidade_asas_maiores/2.0);
    asas_maiores.add(pontaAsas_aviao_esquerda);
   

    //Asas menores - parte de trás
    var altura_asas_menores = 0.05;
    var largura_asas_menores = 4.0;
    var profundidade_asas_menores = 0.75;
    var curvaAsa_menor = new THREE.Shape();
    curvaAsa_menor.moveTo(0,0);
    curvaAsa_menor.lineTo( 0, diametro_cilindro3/2.0 ); 
    curvaAsa_menor.lineTo( profundidade_asas_menores/3.0,largura_asas_menores/2.0);    
    curvaAsa_menor.lineTo( profundidade_asas_menores, largura_asas_menores/2.0);
    curvaAsa_menor.lineTo( profundidade_asas_menores, 0 );
    curvaAsa_menor.lineTo(profundidade_asas_menores,-largura_asas_menores/2.0);
    curvaAsa_menor.lineTo(profundidade_asas_menores/3.0,-largura_asas_menores/2.0);
    curvaAsa_menor.lineTo(0,-diametro_cilindro3/2.0);
  
    const extrudeSettings = {
        steps: 2,
        depth: altura_asas_menores*2,
        bevelEnabled: false,
        bevelThickness: 0.05,
        bevelSize: 0.05,
        bevelOffset: 0,
        bevelSegments: 10
    };

    var geometry_asas_menores = new THREE.ExtrudeGeometry(curvaAsa_menor, extrudeSettings);
    var asas_menores = new THREE.Mesh(geometry_asas_menores, material_aviao);
    asas_menores.rotation.set(0,0,degreesToRadians(180+90));
    asas_menores.position.set(0.0, -altura_cilindro3 / 2.0 + profundidade_asas_menores,0.0);
    cilindro3.add(asas_menores);

    //esfera atrás
    var raio_esfera_atras = diametro_cilindro3 / 2.0;
    var geometria_esfera_atras = new THREE.SphereGeometry(raio_esfera_atras, 18, 18);
    var esfera_atras = new THREE.Mesh(geometria_esfera_atras, material_aviao);
    esfera_atras.position.set(0.0, -altura_cilindro3 / 2.0, 0.0);
    cilindro3.add(esfera_atras)
 
    // leme
    var altura_leme1 = 0.1;
    var largura_leme1 = 1.5;
    var profundidade_leme1 = 0.75;
    var geometria_leme1 = new THREE.BoxGeometry(largura_leme1, altura_leme1, profundidade_leme1);
    var leme1 = new THREE.Mesh(geometria_leme1, material_aviao);
    cilindro3.add(leme1);
    leme1.position.set(0.0, -largura_leme1 - profundidade_leme1 / 5.0, -largura_leme1 / 3 - profundidade_leme1 / 3.0);
    leme1.rotation.set(Math.PI / 3, 0, Math.PI / 2);

    //leme2
    var altura_leme2 = 0.1;
    var largura_leme2 = 1.8;
    var profundidade_leme2 = 0.75;
    var geometria_leme2 = new THREE.BoxGeometry(largura_leme2, altura_leme2, profundidade_leme2);
    var leme2 = new THREE.Mesh(geometria_leme2, material_aviao);
    leme2.position.set(profundidade_leme1 - 0.508, 0.0, -profundidade_leme1 + 0.4);
    leme2.rotation.set(0.0, degreesToRadians(20), 0.0);
    leme1.add(leme2);

    //objeto que armazena o cilindro1(corpo principal do avião)
    var aviaoHolder= new THREE.Object3D();
    var axesHelper = new THREE.AxesHelper(200);

    aviaoHolder.add(cilindro1);
    //aviaoHolder.add(axesHelper);

    return { aviaoHolder, eixo_helice};

}
