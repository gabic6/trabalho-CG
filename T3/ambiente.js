import * as THREE from '../../build/three.module.js';
import Stats from '../../build/jsm/libs/stats.module.js';
import {ConvexGeometry} from '../build/jsm/geometries/ConvexGeometry.js';
import { BufferGeometryUtils } from '../build/jsm/utils/BufferGeometryUtils.js';
import { TrackballControls } from '../../build/jsm/controls/TrackballControls.js';
import {
  initRenderer,
  initCamera,
  degreesToRadians,
  onWindowResize,
  initDefaultBasicLight,
  createGroundPlaneWired,

} from "../../libs/util/util.js";
import KeyboardState from '../../libs/util/KeyboardState.js';
import aviao from './aviao.js';

///////////// montanhas /////////////////

function geraMontanha(){

  function gerarPontosCone(raio, altura){
    var coneGeometry = new THREE.ConeGeometry( raio, altura, 5, 5 );
    coneGeometry.deleteAttribute( 'normal' );
    coneGeometry.deleteAttribute( 'uv' );
    coneGeometry = BufferGeometryUtils.mergeVertices( coneGeometry );

    var vertices = [];
    var positionAttribute = coneGeometry.getAttribute( 'position' );

    for ( let i = 0; i < positionAttribute.count; i ++ ) {

      const vertex = new THREE.Vector3();
      vertex.fromBufferAttribute( positionAttribute, i );
      vertices.push( vertex );
    }

    return vertices;
  }

  //// MONTANHA 1 ////
  
  // objeto 1
  var m1g1 = gerarPontosCone(20, 50);

  m1g1[0].x += 8;     m1g1[0].y -= 4;     m1g1[0].z += 5;

  m1g1[9].z += 7;

  m1g1[10].x += 5;    m1g1[10].z += 5;

  m1g1[25].x -= 6;    m1g1[25].z += 7;

  m1g1[15].z -= 4;

  m1g1[20].z -= 3;

  m1g1[21].x += 4;     m1g1[21].y += 3;

  m1g1[16].y -= 2;

  m1g1[2].y += 4;

  m1g1[7].x += 7;     m1g1[7].y += 8;     m1g1[7].z += 4;

  m1g1[24].x -= 2;     m1g1[24].z += 3;

  m1g1[23].x -= 4;
  m1g1[23].z -= 7;

  m1g1[13].x += 5;

  m1g1[4].x += 9;     m1g1[4].z += 7;

  m1g1[3].x -= 3;     m1g1[3].z += 4;

  m1g1[19].x += 5;     m1g1[19].y += 3;     m1g1[19].z -= 2;

  m1g1[14].x += 10;     m1g1[14].z += 9;  

  m1g1[6].x += 4;     m1g1[6].z += 13;

  const geom_m1Obj1 = new ConvexGeometry( m1g1 );
  const mat_m1Obj1 = new THREE.MeshLambertMaterial( { color: 'rgb(82, 43, 5)' } );
  const m1Obj1 = new THREE.Mesh( geom_m1Obj1, mat_m1Obj1 );
  m1Obj1.castShadow = true;
  m1Obj1.receiveShadow = true;
  m1Obj1.position.set(40,25,10);

  // objeto 2
  var m1g2 = gerarPontosCone(15, 30);


  m1g2[0].x += 10;     m1g2[0].y -= 9;     m1g2[0].z -= 5;

  m1g2[9].x += 6;     m1g2[9].z -= 2;

  m1g2[7].x += 12;     m1g2[7].z -= 5;

  m1g2[11].y += 5;     m1g2[11].z -= 8;

  m1g2[1].x += 9;

  m1g2[21].x -= 4;     m1g2[21].y -= 2;

  m1g2[25].x -= 10;     m1g2[25].z += 7;

  m1g2[23].x -= 7;     m1g2[23].y += 4;

  m1g2[24].x -= 7;     m1g2[24].y += 3;     m1g2[24].z -= 5;

  m1g2[20].x -= 5;     m1g2[20].z -= 9;

  m1g2[15].x += 7;     m1g2[15].z -= 4;

  m1g2[14].x -= 8;     m1g2[14].y += 9;     m1g2[14].z -= 8;

  m1g2[17].x -= 8;     m1g2[17].y += 2;     m1g2[17].z -= 10;

  const geom_m1Obj2 = new ConvexGeometry( m1g2 );
  const mat_m1Obj2 = new THREE.MeshLambertMaterial( { color: 'rgb(82, 43, 5)' } );
  const m1Obj2 = new THREE.Mesh( geom_m1Obj2, mat_m1Obj2 );
  m1Obj2.castShadow = true;
  m1Obj2.receiveShadow = true;
  m1Obj2.position.set(25,-10,-2);
  m1Obj1.add(m1Obj2);

// objeto 3
var m1g3 = gerarPontosCone(15, 20);

m1g3[0].x -= 3;   m1g3[0].y += 2;   m1g3[0].z -= 3;

m1g3[1].x += 6;   m1g3[1].y -= 1;   m1g3[1].z -= 17;

m1g3[2].x += 5;   m1g3[2].y += 2;   m1g3[2].z += 3;

m1g3[11].x += 3;   m1g3[11].y += 2;   m1g3[11].z += 10;

m1g3[10].x += 7;   m1g3[10].z += 8;

m1g3[8].x += 7;   m1g3[8].y += 7;   m1g3[8].z += 7;

m1g3[14].x += 3;   m1g3[14].y += 4;   m1g3[14].z -= 9;

m1g3[15].x += 6;   m1g3[15].z -= 7;

m1g3[25].x += 4;

m1g3[24].x += 8;   m1g3[24].y += 3;   m1g3[24].z += 9;

m1g3[12].x += 11;   m1g3[12].y += 4;   m1g3[12].z += 6;

m1g3[6].x += 12;   m1g3[6].z -= 11;

const geom_m1Obj3 = new ConvexGeometry( m1g3 );
const mat_m1Obj3 = new THREE.MeshLambertMaterial( { color: 'rgb(82, 43, 5)' } );
const m1Obj3 = new THREE.Mesh( geom_m1Obj3, mat_m1Obj3 );
m1Obj3.castShadow = true;
m1Obj3.receiveShadow = true;
m1Obj3.position.set(0,-5,-22);
m1Obj2.add(m1Obj3);

m1Obj1.scale.set( 6, 6, 6 );
m1Obj1.position.set(150,150,800);
m1Obj1.rotation.set(0, (2*Math.PI)/3, 0);


//// MONTANHA 2 ////
  
// objeto 1
var m2g1 = gerarPontosCone(20, 40);

m2g1[0].x -= 6;   m2g1[0].y += 5;   m2g1[0].z += 7;

m2g1[2].x += 5;   m2g1[2].z += 6;

m2g1[9].y -= 10;   m2g1[9].z += 18;

m2g1[25].x -= 14;   m2g1[25].y -= 10;   m2g1[25].z += 11;

m2g1[7].x -= 12;   m2g1[7].y += 6;   m2g1[7].z += 14;

m2g1[5].x += 2;   m2g1[5].y += 7;   m2g1[5].z += 16;

m2g1[3].x += 15;   m2g1[3].z += 8;

m2g1[17].x -= 8;

m2g1[22].x -= 20;   m2g1[22].y -= 7;   m2g1[22].z += 8;

m2g1[10].y -= 10;

m2g1[15].y -= 10;

m2g1[20].y -= 10;

const geom_m2Obj1 = new ConvexGeometry( m2g1 );
const mat_m2Obj1 = new THREE.MeshLambertMaterial( { color: 'rgb(82, 43, 5)' } );
const m2Obj1 = new THREE.Mesh( geom_m2Obj1, mat_m2Obj1 );
m2Obj1.castShadow = true;
m2Obj1.receiveShadow = true;
m2Obj1.position.set(-40,30,10);

// objeto 2
  var m2g2 = gerarPontosCone(15, 30);

  m2g2[0].x += 6;     m2g2[0].y += 2;     m2g2[0].z -= 7;

  m2g2[1].x += 5;     m2g2[1].z -= 6;

  m2g2[21].x -= 4;    m2g2[21].z -= 5;

  m2g2[2].x += 8;     m2g2[2].y += 5;     m2g2[2].z -= 6;

  m2g2[3].x += 5;     m2g2[3].y += 5;     m2g2[3].z += 4;

  m2g2[20].x -= 8;     m2g2[20].z -= 5;

  m2g2[25].x += 3;     m2g2[25].z += 9;

  m2g2[15].z += 5;

  m2g2[24].x -= 7;     m2g2[24].z -= 5;

  m2g2[23].x -= 4;     m2g2[23].y += 4;     m2g2[23].z += 7;

  m2g2[10].x += 5;     m2g2[10].z -= 5;

  m2g2[4].x += 10;     m2g2[4].z += 3;

  const geom_m2Obj2 = new ConvexGeometry( m2g2 );
  const mat_m2Obj2 = new THREE.MeshLambertMaterial( { color: 'rgb(82, 43, 5)' } );
  const m2Obj2 = new THREE.Mesh( geom_m2Obj2, mat_m2Obj2 );
  m2Obj2.castShadow = true;
  m2Obj2.receiveShadow = true;
  m2Obj2.position.set(-11,-15,35);
  m2Obj1.add(m2Obj2);

  m2Obj1.scale.set( 3, 3, 3 );
  //m2Obj1.position.set(350,90,-80);
  m2Obj1.position.set(500,90,-600);


//// MONTANHA 3 ////
  
// objeto 1
var m3g1 = gerarPontosCone(25, 40);

m3g1[0].x += 2;   m3g1[0].y -= 3;   m3g1[0].z -= 7;

m3g1[1].y -= 2;

m3g1[2].y -= 2;

m3g1[21].y -= 2;

m3g1[5].x += 6;

m3g1[9].x -= 5;   m3g1[9].y -= 5;

m3g1[13].x += 6;   m3g1[13].z -= 7;

m3g1[12].x += 9;   m3g1[12].y -= 4;   m3g1[12].z += 3;

m3g1[18].x -= 7;   m3g1[18].z += 6;

m3g1[19].x -= 6;   m3g1[19].z += 4;

m3g1[20].x -= 1;   m3g1[20].y -= 5;   m3g1[20].z -= 2;

m3g1[17].x += 4;   m3g1[17].z -= 10;

m3g1[15].x += 3;   m3g1[15].y -= 5;   m3g1[15].z -= 3;

m3g1[14].x -= 4;   m3g1[14].z -= 8;

m3g1[24].x += 9;   m3g1[24].z += 12;

m3g1[10].x -= 4;   m3g1[10].y -= 5;   m3g1[10].z += 4;

m3g1[25].y -= 5;

const geom_m3Obj1 = new ConvexGeometry( m3g1 );
const mat_m3Obj1 = new THREE.MeshLambertMaterial( { color: 'rgb(82, 43, 5)' } );
const m3Obj1 = new THREE.Mesh( geom_m3Obj1, mat_m3Obj1 );
m3Obj1.castShadow = true;
m3Obj1.receiveShadow = true;
m3Obj1.position.set(-15,25,30);
  
// objeto 2
var m3g2 = gerarPontosCone(15, 25);

m3g2[0].x -= 4;   m3g2[0].y -= 3.5;   m3g2[0].z -= 2;

m3g2[13].x += 4;   m3g2[13].z += 3;

m3g2[22].x -= 2;   m3g2[22].z -= 2;

m3g2[24].x += 2;   m3g2[24].y += 3;   m3g2[24].z += 3;

m3g2[9].x -= 3;   m3g2[9].y -= 3;

m3g2[7].y -= 1;   m3g2[7].z += 1;

m3g2[2].x += 2;

m3g2[11].y -= 3;   m3g2[11].z -= 3;

m3g2[16].x += 2;   m3g2[16].y -= 0.5;

m3g2[17].x -= 3;   m3g2[17].y -= 3;   m3g2[17].z -= 8;

m3g2[20].x += 2;   m3g2[20].y -= 3;   m3g2[20].z -= 3;

m3g2[19].x -= 4;   m3g2[19].z += 6;

m3g2[4].x += 1;   m3g2[4].y -= 2;   m3g2[4].z += 6;

m3g2[10].y -= 3;

m3g2[15].y -= 3;

m3g2[25].y -= 3;

const geom_m3Obj2 = new ConvexGeometry( m3g2 );
const mat_m3Obj2 = new THREE.MeshLambertMaterial( { color: 'rgb(82, 43, 5)' } );
const m3Obj2 = new THREE.Mesh( geom_m3Obj2, mat_m3Obj2 );
m3Obj2.castShadow = true;
m3Obj2.receiveShadow = true;
m3Obj2.scale.set(1.25, 1.25, 1.25); 
m3Obj2.position.set(24,-5.625,-6);
m3Obj1.add(m3Obj2);

m3Obj1.scale.set( 4, 4, 4 );
//m3Obj1.position.set(-500,100,-150);
m3Obj1.position.set(-800,100,-800);

  return {m1Obj1, m2Obj1, m3Obj1};
}


///////////// Arvores /////////////////


function arvoreModelo1(x, z) {
  var material_tronco = new THREE.MeshLambertMaterial({ color: '#AD3409' });
  var material_folhagem = new THREE.MeshLambertMaterial({ color: '#66AD34' });

  let altura_tronco = 9.0;
  let raio_folhagem = 3.5;

  // tronco
  var tronco_geometry = new THREE.CylinderGeometry(0.15, 0.15, altura_tronco, 6, 1);
  var tronco = new THREE.Mesh(tronco_geometry, material_tronco);
  tronco.castShadow = true;
  tronco.receiveShadow = true;

  // 'folhagem'
  var folhagem_geometry = new THREE.SphereGeometry(raio_folhagem, 5, 5);
  var folhagem = new THREE.Mesh(folhagem_geometry, material_folhagem);
  folhagem.castShadow = true;
  folhagem.receiveShadow = true;

  folhagem.position.set(0.0, altura_tronco / 2.0 + raio_folhagem / 2.0, 0.0);
  tronco.add(folhagem);

  tronco.position.set(x, altura_tronco / 2.0, z);
  return tronco;
}

function arvoreModelo2(x, z) {
  var material_tronco = new THREE.MeshLambertMaterial({ color: '#AD3409' });
  var material_folhagem = new THREE.MeshLambertMaterial({ color: '#66AD34' });

  // tronco
  var tronco_geometry = new THREE.CylinderGeometry(0.15, 0.15, 9.0, 6, 1);
  var tronco = new THREE.Mesh(tronco_geometry, material_tronco);
  tronco.castShadow = true;
  tronco.receiveShadow = true;

  // tronco 2
  var tronco2_geometry = new THREE.CylinderGeometry(0.10, 0.10, 3.0, 6, 1);
  var tronco2 = new THREE.Mesh(tronco2_geometry, material_tronco);
  tronco2.castShadow = true;
  tronco2.receiveShadow = true;
  tronco2.position.set(0.0, 2.0, 1.0);
  tronco2.rotation.set(degreesToRadians(45), 0.0, 0.0)
  tronco.add(tronco2);

  // tronco 3
  var tronco3_geometry = new THREE.CylinderGeometry(0.10, 0.10, 3.0, 6, 1);
  var tronco3 = new THREE.Mesh(tronco3_geometry, material_tronco);
  tronco3.castShadow = true;
  tronco3.receiveShadow = true;
  tronco3.position.set(0.0, 1.5, -1.0);
  tronco3.rotation.set(degreesToRadians(-45), 0.0, 0.0)
  tronco.add(tronco3);

  // 'folhagem' 1
  var folhagem1_geometry = new THREE.SphereGeometry(2.0, 5, 5);
  var folhagem1 = new THREE.Mesh(folhagem1_geometry, material_folhagem);
  folhagem1.castShadow = true;
  folhagem1.receiveShadow = true;
  folhagem1.position.set(0.0, 5.5, 0.0);
  tronco.add(folhagem1);

  // 'folhagem' 2
  var folhagem2_geometry = new THREE.SphereGeometry(1.0, 5, 5);
  var folhagem2 = new THREE.Mesh(folhagem2_geometry, material_folhagem);
  folhagem2.castShadow = true;
  folhagem2.receiveShadow = true;
  folhagem2.position.set(0.0, 1.0, 0.0);
  tronco2.add(folhagem2);
  tronco3.add(folhagem2.clone());

  tronco.position.set(0, 3.3, 0);

  var arvoreHolder = new THREE.Object3D();
  arvoreHolder.add(tronco);
  arvoreHolder.scale.set(2.0, 2.0, 2.0);
  arvoreHolder.position.set(x, 1.75, z);
  return arvoreHolder;
}

function arvoreModelo3(x, z) {
  var material_tronco = new THREE.MeshLambertMaterial({ color: '#AD3409' });
  var material_folhagem = new THREE.MeshLambertMaterial({ color: '#66AD34' });

  // tronco
  var tronco_geometry = new THREE.CylinderGeometry(0.15, 0.15, 4.0, 6, 1);
  var tronco = new THREE.Mesh(tronco_geometry, material_tronco);
  tronco.castShadow = true;
  tronco.receiveShadow = true;

  // 'folhagem' 1
  var folhagem1_geometry = new THREE.ConeGeometry(2.0, 6.0, 8, 1);
  var folhagem1 = new THREE.Mesh(folhagem1_geometry, material_folhagem);
  folhagem1.castShadow = true;
  folhagem1.receiveShadow = true;

  folhagem1.position.set(0.0, 4.0, 0.0);
  tronco.add(folhagem1);

  tronco.position.set(x, 2.0, z);
  return tronco;
}

function arvoreModelo4(x, z) {
  var material_tronco = new THREE.MeshLambertMaterial({ color: '#AD3409' });
  var material_folhagem = new THREE.MeshLambertMaterial({ color: '#66AD34', wireframe: false, side: THREE.DoubleSide });

  // tronco
  var tronco_geometry = new THREE.CylinderGeometry(0.10, 0.10, 4.5, 6, 1);
  var tronco = new THREE.Mesh(tronco_geometry, material_tronco);
  tronco.castShadow = true;
  tronco.receiveShadow = true;

  // tronco 2
  var tronco2_geometry = new THREE.CylinderGeometry(0.05, 0.05, 1.2, 6, 1);
  var tronco2 = new THREE.Mesh(tronco2_geometry, material_tronco);
  tronco2.castShadow = true;
  tronco2.receiveShadow = true;
  tronco2.position.set(0.0, 1.2, 0.25);
  tronco2.rotation.set(degreesToRadians(30), 0.0, 0.0)
  tronco.add(tronco2);

  // tronco 3
  var tronco2_geometry = new THREE.CylinderGeometry(0.05, 0.05, 0.8, 6, 1);
  var tronco2 = new THREE.Mesh(tronco2_geometry, material_tronco);
  tronco2.castShadow = true;
  tronco2.receiveShadow = true;
  tronco2.position.set(0.0, 1.5, -0.3);
  tronco2.rotation.set(degreesToRadians(-45), 0.0, 0.0)
  tronco.add(tronco2);

  // 'folhagem' 1
  var folhagem1_geometry = new THREE.SphereGeometry(1.0, 6, 6, 0, Math.PI, 0, Math.PI);
  var folhagem1 = new THREE.Mesh(folhagem1_geometry, material_folhagem);
  folhagem1.castShadow = true;
  folhagem1.receiveShadow = true;

  var folhagem1_circulo_geometry = new THREE.CircleGeometry( 1.0, 12 );
  var folhagem1_circulo = new THREE.Mesh( folhagem1_circulo_geometry, material_folhagem );

  folhagem1.position.set(0.0, 1.7, 0.0);
  folhagem1.rotation.set(-Math.PI / 2, 0.0, 0.0);

  folhagem1_circulo.position.set(0.0, 1.7, 0.0);
  folhagem1_circulo.rotation.set(Math.PI / 2, 0.0, 0.0);

  
  tronco.add(folhagem1);
  tronco.add(folhagem1_circulo);

  tronco.position.set(0, 1.25 , 0);

  var arvoreHolder = new THREE.Object3D();
  arvoreHolder.add(tronco);
  arvoreHolder.scale.set(2.0, 2.0, 2.0);
  arvoreHolder.position.set(x, 1.75, z);
  return arvoreHolder;
}

///////////////// Criação do grid onde as arvores vão aparecer //////////////////

//3 circulos que delimitam a area das montanhas
function limiteMontanhas(x, z) {
  var posMontanha1 = new THREE.Vector3(40, 0, 800);
  var posMontanha2 = new THREE.Vector3(350, 0, -80);
  var posMontanha3 = new THREE.Vector3(-500, 0, -150);
  var posAtual = new THREE.Vector3(x, 0, z);

  var limMontanha1 = 280;
  var limMontanha2 = 150;
  var limMontanha3 = 150;

  var dentroMontanha1 = posMontanha1.distanceTo(posAtual) < limMontanha1;
  var dentroMontanha2 = posMontanha2.distanceTo(posAtual) < limMontanha2;
  var dentroMontanha3 = posMontanha3.distanceTo(posAtual) < limMontanha3;

  return !dentroMontanha1 && !dentroMontanha2 && !dentroMontanha3;
}

// Retangulo que delimita uma "pista" pro avião delocar, que não contenha arvores
function limitePistaAviao(x, z){
  var box = new THREE.Box2( new THREE.Vector2(-30,-30), new THREE.Vector2(30,300) )
  return !box.containsPoint(new THREE.Vector2(x,z));
}

// Circulos e retângulos onde não vai ser posicionada nenhuma arvore
function limitesArbitrarios(x, z){
  var box = new THREE.Box2( new THREE.Vector2(500,0), new THREE.Vector2(2000,2000) );
  var box2 = new THREE.Box2( new THREE.Vector2(-2000,-2000), new THREE.Vector2(-680,-300) );

  var pos1 = new THREE.Vector3(-580, 0, 250);
  var posAtual = new THREE.Vector3(x, 0, z);
  var dentroLim1 = pos1.distanceTo(posAtual) < 200;

  var pos2 = new THREE.Vector3(-250, 0, 100);
  var posAtual = new THREE.Vector3(x, 0, z);
  var dentroLim2 = pos2.distanceTo(posAtual) < 150;

  var pos3 = new THREE.Vector3(450, 0, -600);
  var posAtual = new THREE.Vector3(x, 0, z);
  var dentroLim3 = pos3.distanceTo(posAtual) < 200;

  var pos4 = new THREE.Vector3(100, 0, -710);
  var posAtual = new THREE.Vector3(x, 0, z);
  var dentroLim4 = pos4.distanceTo(posAtual) < 150;

  return (
    !box.containsPoint(new THREE.Vector2(x,z)) &&
    !box2.containsPoint(new THREE.Vector2(x,z)) &&
    !dentroLim1 &&
    !dentroLim2 &&
    !dentroLim3 &&
    !dentroLim4
  );
}

// Cria uma grade onde as arvores vão aparecer
let pontos = [];
function obtemGrid() {
  if (pontos.length > 0) {
    return pontos
  }
  // Limites de geração da grid
  let left = -900;
  let right = 950;
  let top = -940;
  let bottom = 800;
  let espacamento = 20;

  for (let x = left; x <= right; x += espacamento) {
    for (let z = top; z <= bottom; z += espacamento) {
      // As funções nesse if são o que define a exclusão de pontos da grid, onde as arvores não podem
      // aparecer, como dentro das montanhas ou em cima do avião
      if (limiteMontanhas(x, z) && limitePistaAviao(x, z) && limitesArbitrarios(x, z)) {
        pontos.push({
          x, z, usado: false
        });
      }
    }
  }

  return pontos;
}

///////////////// Criação das arvores /////////////////////

function geraArvore() {

  // Randomiza uma posição no grid
  let grid = obtemGrid();

  // pega o primeiro ponto
  let indice = Math.floor(Math.random() * grid.length);
  let ponto = grid[indice];

  // enquanto o ponto estiver marcado como usado, vai vendo
  // outros até achar um que não foi usado
  while (ponto.usado) {
      indice = Math.floor(Math.random() * grid.length);
      ponto = grid[indice];
  }

  // Marca o ponto escolhido como usado
  grid[indice].usado = true;

  // Randomiza qual modelo de arvore vai ser retornado
  let numModelo = Math.floor(Math.random() * 4);
  switch (numModelo) {
      case 0:
          return arvoreModelo1(ponto.x, ponto.z);
      case 1:
          return arvoreModelo2(ponto.x, ponto.z);
      case 2:
          return arvoreModelo3(ponto.x, ponto.z);
      case 3:
          return arvoreModelo4(ponto.x, ponto.z);
      default:
          return arvoreModelo1(ponto.x, ponto.z);
  }

}

///////////// Exporta o ambiente /////////////////

export default function ambiente(texturasCarregadas) {
  var arvoresHolder = new THREE.Object3D();

  //gera montanhas
  var {m1Obj1, m2Obj1, m3Obj1} = geraMontanha();

  arvoresHolder.add(m1Obj1);
  arvoresHolder.add(m2Obj1);
  arvoresHolder.add(m3Obj1);

  //gera arvores
  for (let i = 0; i < 200; i++) {
      arvoresHolder.add(geraArvore());
  }

  return arvoresHolder;
}