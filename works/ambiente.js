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
  function generatePoints(numberOfPoints) {
    var points = [];
    var maxSize = 50;
    for (var i = 0; i < numberOfPoints; i++) {
      var randomX = Math.round(-maxSize + Math.random() * maxSize * 2);
      var randomY = Math.round(0.1 + Math.random() * maxSize);
      var randomZ = Math.round(-maxSize + Math.random() * maxSize * 2);

      points.push(new THREE.Vector3(randomX, randomY, randomZ));
    }
    return points;
  }
  //var localPoints = generatePoints(20);

  function gerarPontosCone(){
    var coneGeometry = new THREE.ConeGeometry( 20, 50, 5, 5 );
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

  var localPoints = gerarPontosCone();

  localPoints[20].x += 5;
  localPoints[5].x -= 5;

  console.log('localPoints',localPoints)
  // Then, build the convex geometry with the generated points
  //convexGeometry = new THREE.ConvexBufferGeometry(localPoints);

  console.log('THREE.ConvexGeometry', ConvexGeometry)

  const geometry = new ConvexGeometry( localPoints );
  const material = new THREE.MeshLambertMaterial( { color: 0x00ff00 } );
  const mesh = new THREE.Mesh( geometry, material );
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  mesh.position.set(40,25,10);
  //scene.add( mesh );
  return mesh;
}


///////////// Arvores /////////////////


function arvoreModelo1(x, z) {
  var material_tronco = new THREE.MeshLambertMaterial({ color: '#AD3409' });
  var material_folhagem = new THREE.MeshLambertMaterial({ color: '#66AD34' });

  let altura_tronco = 3.0;
  let raio_folhagem = 1.5;

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
  var tronco_geometry = new THREE.CylinderGeometry(0.15, 0.15, 8.0, 6, 1);
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

  tronco.position.set(x, 4.0, z);
  return tronco;
}

function arvoreModelo3(x, z) {
  var material_tronco = new THREE.MeshLambertMaterial({ color: '#AD3409' });
  var material_folhagem = new THREE.MeshLambertMaterial({ color: '#66AD34' });

  // tronco
  var tronco_geometry = new THREE.CylinderGeometry(0.10, 0.10, 1.0, 6, 1);
  var tronco = new THREE.Mesh(tronco_geometry, material_tronco);
  tronco.castShadow = true;
  tronco.receiveShadow = true;

  // 'folhagem' 1
  var folhagem1_geometry = new THREE.ConeGeometry(1.0, 3.0, 8, 1);
  var folhagem1 = new THREE.Mesh(folhagem1_geometry, material_folhagem);
  folhagem1.castShadow = true;
  folhagem1.receiveShadow = true;

  folhagem1.position.set(0.0, 2.0, 0.0);
  tronco.add(folhagem1);

  tronco.position.set(x, 0.5, z);
  return tronco;
}

function arvoreModelo4(x, z) {
  var material_tronco = new THREE.MeshLambertMaterial({ color: '#AD3409' });
  var material_folhagem = new THREE.MeshLambertMaterial({ color: '#66AD34', wireframe: false, side: THREE.DoubleSide });

  // tronco
  var tronco_geometry = new THREE.CylinderGeometry(0.10, 0.10, 3.5, 6, 1);
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

  tronco.position.set(x, 1.75, z);
  return tronco;
}

// Cria uma grade onde as arvores vão aparecer
let pontos = [];
function obtemGrid() {
  if (pontos.length > 0) {
      return pontos
  }
  let diametro = 200;
  let espacamento = 5;
  for (let x = -diametro; x <= diametro; x += espacamento) {
      for (let z = -diametro; z <= diametro; z += espacamento) {
          pontos.push({
              x, z, usado: false
          });
      }
  }

  return pontos;
}


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

export default function ambiente() {
  let meshes = [];

  //gera montanhas
  meshes.push(geraMontanha());
  //meshes.push(geraMontanha());
  //meshes.push(geraMontanha());

  //gera arvores
  for (let i = 0; i < 100; i++) {
      meshes.push(geraArvore());
  }

  //meshes.push(arvoreModelo4(0,0))
  return meshes;
}



/*
0: Vector3 {x: 0, y: 10, z: 0}
1: Vector3 {x: 0, y: 6, z: 1}
2: Vector3 {x: 0.9510565400123596, y: 6, z: 0.30901700258255005}
3: Vector3 {x: 0, y: 2, z: 2}
4: Vector3 {x: 1.9021130800247192, y: 2, z: 0.6180340051651001}
5: Vector3 {x: 0, y: -2, z: 3}
6: Vector3 {x: 2.8531694412231445, y: -2, z: 0.9270510077476501}
7: Vector3 {x: 0, y: -6, z: 4}
8: Vector3 {x: 3.8042261600494385, y: -6, z: 1.2360680103302002}
9: Vector3 {x: 0, y: -10, z: 5}
10: Vector3 {x: 4.755282402038574, y: -10, z: 1.5450849533081055}
11: Vector3 {x: 0.5877852439880371, y: 6, z: -0.80901700258255}
12: Vector3 {x: 1.1755704879760742, y: 2, z: -1.6180340051651}
13: Vector3 {x: 1.7633557319641113, y: -2, z: -2.427051067352295}
14: Vector3 {x: 2.3511409759521484, y: -6, z: -3.2360680103302}
15: Vector3 {x: 2.9389262199401855, y: -10, z: -4.0450849533081055}
16: Vector3 {x: -0.5877852439880371, y: 6, z: -0.80901700258255}
17: Vector3 {x: -1.1755704879760742, y: 2, z: -1.6180340051651}
18: Vector3 {x: -1.7633557319641113, y: -2, z: -2.427051067352295}
19: Vector3 {x: -2.3511409759521484, y: -6, z: -3.2360680103302}
20: Vector3 {x: -2.9389262199401855, y: -10, z: -4.0450849533081055}
21: Vector3 {x: -0.9510565400123596, y: 6, z: 0.30901700258255005}
22: Vector3 {x: -1.9021130800247192, y: 2, z: 0.6180340051651001}
23: Vector3 {x: -2.8531694412231445, y: -2, z: 0.9270510077476501}
24: Vector3 {x: -3.8042261600494385, y: -6, z: 1.2360680103302002}
25: Vector3 {x: -4.755282402038574, y: -10, z: 1.5450849533081055}
26: Vector3 {x: 0, y: -10, z: 0}
*/