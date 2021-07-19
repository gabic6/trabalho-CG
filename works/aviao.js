
import * as THREE from '../build/three.module.js';

import {
    degreesToRadians,
} from "../libs/util/util.js";

export default function aviao() {
    var objColor_r = 'red';
    var material_aviao_red = new THREE.MeshPhongMaterial({color:objColor_r, shininess:"200"})
    var objColor_y = 'yellow';
    var material_aviao_yellow = new THREE.MeshPhongMaterial({color:objColor_y, shininess:"200"})
    
    //cilindro1 - corpo principal do avião
    var diametro_cilindro1 = 1.27;
    var altura_cilindro1 = 4.0;
    var geometria_cilindro1 = new THREE.CylinderGeometry(diametro_cilindro1 / 2.0, diametro_cilindro1 / 2.0, altura_cilindro1, 18);
    var cilindro1 = new THREE.Mesh(geometria_cilindro1, material_aviao_red);
    cilindro1.castShadow = true;
    cilindro1.position.set(0.0, 0.0, 0.0);
    cilindro1.rotation.set(degreesToRadians(85), 0, 0);

    //bracinhos das rodinhas do avião
    var ponto_rodinha = diametro_cilindro1/4.0;
    var horizontal_rodinha = (diametro_cilindro1+0.3)/2.0;
    const geometria_braco1 = new THREE.BoxGeometry(0.2,0.7,0.8,18,18);
    const braco1 = new THREE.Mesh( geometria_braco1, material_aviao_red);
    braco1.castShadow = true;
    braco1.position.set(ponto_rodinha, 0.5, horizontal_rodinha);
    braco1.rotation.set(degreesToRadians(-90),0,0.0);
    cilindro1.add( braco1);
    var braco2 = braco1.clone()
    braco2.position.set(-ponto_rodinha,0.5,horizontal_rodinha);
    braco2.castShadow = true;
    cilindro1.add(braco2);
    //cilindro que liga as rodinhas
    var cilindro_amarelo = new THREE.CylinderGeometry(0.05,0.05,1.7,18,18);
    var cilindro_rodinhas = new THREE.Mesh(cilindro_amarelo,material_aviao_yellow);
    cilindro_rodinhas.castShadow = true;
    cilindro_rodinhas.rotation.set(0,0,degreesToRadians(90));
    cilindro_rodinhas.position.set(-0.3,-0.15,0);
    braco1.add(cilindro_rodinhas);

    //rodinhas
    var objColor_borracha ="rgb(64,64,64)" ;
    var material_aviao_borracha = new THREE.MeshLambertMaterial({color:objColor_borracha})
    const geometria_torus = new THREE.TorusGeometry(0.20, 0.20, 30, 80);
    const torus1 = new THREE.Mesh( geometria_torus, material_aviao_borracha);
    torus1.castShadow = true;
    torus1.rotation.set(degreesToRadians(90),0,0);
    torus1.position.set(0,-0.7,0);
    cilindro_rodinhas.add( torus1 );
    var torus2 = torus1.clone();
    torus2.castShadow = true;
    torus2.rotation.set(degreesToRadians(90),0,0);
    torus2.position.set(0,0.7,0);
    cilindro_rodinhas.add( torus2 );
    
    
    

    //esfera bico
    
    var raio_esfera_bico = diametro_cilindro1 / 2.0;
    var geometria_esfera_bico = new THREE.SphereGeometry(raio_esfera_bico, 18, 18);
    var esfera_bico = new THREE.Mesh(geometria_esfera_bico, material_aviao_yellow);
    esfera_bico.castShadow = true;
    esfera_bico.position.set(0.0, altura_cilindro1 / 2.0, 0.0);
    cilindro1.add(esfera_bico)

    //"esfera" cabine
    var objColor_grey ="rgb(192,192,192)";
    var material_aviao_grey = new THREE.MeshPhongMaterial({color:objColor_grey, shininess:"200", opacity: 0.8,
    transparent: true})
    var raio_cabine = diametro_cilindro1 / 2.1;
    var geometria_cabine = new THREE.SphereGeometry(raio_cabine, 18, 18);
    geometria_cabine.scale(0.6, 1.8, 1);
    var cabine = new THREE.Mesh(geometria_cabine, material_aviao_grey);
    cabine.castShadow = true;
    cabine.position.set(0.0, 0.0, -diametro_cilindro1 / 3.0);
    cilindro1.add(cabine);

    //cilindro2 - bico da hélice
    var altura_eixo_helice = 0.2;
    var diametro_eixo_helice = 0.1;
    var geometria_eixo_helice = new THREE.CylinderGeometry(diametro_eixo_helice / 2.0, diametro_eixo_helice / 2.0, altura_eixo_helice, 18);
    var eixo_helice = new THREE.Mesh(geometria_eixo_helice, material_aviao_yellow);
    eixo_helice.castShadow = true;
    esfera_bico.add(eixo_helice);
    eixo_helice.position.set(0.0, raio_esfera_bico + altura_eixo_helice / 2.0, 0.0);

    

    //helices
    var tamanho_helice = 1.0;
    var largura_helice = 0.15;
    var angulo_ataque = 15.0;
    var profundidade_helice = 0.015;
    var objColor_black ="rgb(0,0,0)";
    var material_aviao_black = new THREE.MeshPhongMaterial({color:objColor_black, shininess:"200"})
    //helice 1
    var helice1_geometry = new THREE.BoxGeometry(tamanho_helice, largura_helice, profundidade_helice);
    helice1_geometry.translate(tamanho_helice / 2.0, 0.0, 0.0);
    helice1_geometry.rotateX(degreesToRadians(angulo_ataque))
    var helice1 = new THREE.Mesh(helice1_geometry, material_aviao_black);
    helice1.castShadow = true;
    helice1.position.set(0.0, altura_eixo_helice / 2.0 - profundidade_helice / 2.0, 0.0);
    helice1.rotation.set(Math.PI / 2, 0, 0);
    eixo_helice.add(helice1);
    //helice 2
    var helice2_geometry = new THREE.BoxGeometry(tamanho_helice, largura_helice, profundidade_helice);
    helice2_geometry.translate(tamanho_helice / 2.0, 0.0, 0.0);
    helice2_geometry.rotateX(degreesToRadians(angulo_ataque))
    var helice2 = new THREE.Mesh(helice2_geometry, material_aviao_black);
    helice2.castShadow = true;
    helice2.position.set(0.0, altura_eixo_helice / 2.0 - profundidade_helice / 2.0, 0.0);
    helice2.rotation.set(Math.PI / 2, 0, degreesToRadians(120));
    eixo_helice.add(helice2);
    //helice 3
    var helice3_geometry = new THREE.BoxGeometry(tamanho_helice, largura_helice, profundidade_helice);
    helice3_geometry.translate(tamanho_helice / 2.0, 0.0, 0.0);
    helice3_geometry.rotateX(degreesToRadians(angulo_ataque))
    var helice3 = new THREE.Mesh(helice3_geometry, material_aviao_black);
    helice3.castShadow = true;
    helice3.position.set(0.0, altura_eixo_helice / 2.0 - profundidade_helice / 2.0, 0.0);
    helice3.rotation.set(Math.PI / 2, 0, degreesToRadians(240));
    eixo_helice.add(helice3);


    //cilindro3 - parte de trás
    var diametro_cilindro3 = 0.635;
    var altura_cilindro3 = 3.5;
    var geometria_cilindro3 = new THREE.CylinderGeometry(diametro_cilindro1 / 2.0, diametro_cilindro3 / 2.0, altura_cilindro3, 18);
    var cilindro3 = new THREE.Mesh(geometria_cilindro3, material_aviao_red);
    cilindro3.castShadow = true;
    cilindro3.position.set(0.0, 0.06 - (altura_cilindro1 / 2.0) - (altura_cilindro3 / 2.0), -0.15);
    cilindro3.rotation.set(degreesToRadians(5), 0.0, 0.0)
    cilindro1.add(cilindro3);

    //apoios rodinhas de trás
    var apoio1_geometria = new THREE.BoxGeometry(0.03,0.7,0.18,18,18);
    var apoio1 = new THREE.Mesh(apoio1_geometria,material_aviao_red);
    apoio1.castShadow = true;
    apoio1.position.set(diametro_cilindro3/8.0,-1.0,diametro_cilindro3);
    apoio1.rotation.set(degreesToRadians(-55),0,0)
    cilindro3.add(apoio1);
    var apoio2=apoio1.clone();
    apoio2.position.set(-diametro_cilindro3/8.0,-1.0,diametro_cilindro3);
    apoio2.rotation.set(degreesToRadians(-55),0,0);
    cilindro3.add(apoio2);

    //cilindro que cola o roda de trás
    var cilindro2_amarelo = new THREE.CylinderGeometry(0.03,0.03,(diametro_cilindro3-0.1)/2.0,18,18);
    var cilindro2_rodinhas = new THREE.Mesh(cilindro2_amarelo,material_aviao_yellow);
    cilindro2_rodinhas.castShadow = true;
    cilindro2_rodinhas.rotation.set(0,0,degreesToRadians(90));
    cilindro2_rodinhas.position.set(-diametro_cilindro3/8.0,-0.2,0.05);//set(-0.3,-0.15,0);
    apoio1.add(cilindro2_rodinhas);

    //rodinha de trás
    const geometria_torus1 = new THREE.TorusGeometry(0.10, 0.15, 30, 80);
    const torus3 = new THREE.Mesh( geometria_torus1, material_aviao_borracha);
    torus3.castShadow = true;
    torus3.rotation.set(degreesToRadians(90),0,0);
    torus3.position.set(0,0,0);
    cilindro2_rodinhas.add( torus3 );
    //asas maiores
    var altura_asas_maiores = 0.1;
    var largura_asas_maiores = 11.0;
    var profundidade_asas_maiores = 1.5;
    var geometria_asas_maiores = new THREE.BoxGeometry(largura_asas_maiores, altura_asas_maiores, profundidade_asas_maiores);
    var asas_maiores = new THREE.Mesh(geometria_asas_maiores, material_aviao_red);
    asas_maiores.castShadow = true;
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
    var pontaAsas_aviao_direita = new THREE.Mesh(shapePara, material_aviao_yellow);
    pontaAsas_aviao_direita.rotation.set(degreesToRadians(180),0,degreesToRadians(10));
    pontaAsas_aviao_direita.position.set(largura_asas_maiores/2.0 ,altura_asas_maiores/2.0,profundidade_asas_maiores/2.0);
    asas_maiores.add(pontaAsas_aviao_direita);
    //ponta esquerda
    var pontaAsas_aviao_esquerda = new THREE.Mesh(shapePara, material_aviao_yellow);
    pontaAsas_aviao_esquerda.castShadow = true;
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
    var asas_menores = new THREE.Mesh(geometry_asas_menores, material_aviao_yellow);
    asas_menores.castShadow = true;
    asas_menores.rotation.set(0,0,degreesToRadians(180+90));
    asas_menores.position.set(0.0, -altura_cilindro3 / 2.0 + profundidade_asas_menores,0.0);
    cilindro3.add(asas_menores);

    //esfera atrás
    var raio_esfera_atras = diametro_cilindro3 / 2.0;
    var geometria_esfera_atras = new THREE.SphereGeometry(raio_esfera_atras, 18, 18);
    var esfera_atras = new THREE.Mesh(geometria_esfera_atras, material_aviao_red);
    esfera_atras.castShadow = true;
    esfera_atras.position.set(0.0, -altura_cilindro3 / 2.0, 0.0);
    cilindro3.add(esfera_atras)
 
    // leme
    var altura_leme1 = 0.1;
    var largura_leme1 = 1.5;
    var profundidade_leme1 = 0.75;
    var geometria_leme1 = new THREE.BoxGeometry(largura_leme1, altura_leme1, profundidade_leme1);
    var leme1 = new THREE.Mesh(geometria_leme1, material_aviao_yellow);
    leme1.castShadow = true;
    cilindro3.add(leme1);
    leme1.position.set(0.0, -largura_leme1 - profundidade_leme1 / 5.0, -largura_leme1 / 3 - profundidade_leme1 / 3.0);
    leme1.rotation.set(Math.PI / 3, 0, Math.PI / 2);

    //leme2
    var altura_leme2 = 0.1;
    var largura_leme2 = 1.8;
    var profundidade_leme2 = 0.75;
    var geometria_leme2 = new THREE.BoxGeometry(largura_leme2, altura_leme2, profundidade_leme2);
    var leme2 = new THREE.Mesh(geometria_leme2, material_aviao_yellow);
    leme2.castShadow = true;
    leme2.position.set(profundidade_leme1 - 0.508, 0.0, -profundidade_leme1 + 0.4);
    leme2.rotation.set(0.0, degreesToRadians(20), 0.0);
    leme1.add(leme2);

    //objeto que armazena o cilindro1(corpo principal do avião)
    var aviaoHolder= new THREE.Object3D();
    var axesHelper = new THREE.AxesHelper(200);

    aviaoHolder.add(cilindro1);
    aviaoHolder.add(axesHelper);

    return { aviaoHolder, eixo_helice};

}