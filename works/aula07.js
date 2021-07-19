import * as THREE from  '../build/three.module.js';
import Stats from       '../build/jsm/libs/stats.module.js';
import {GUI} from       '../build/jsm/libs/dat.gui.module.js';
import {TrackballControls} from '../build/jsm/controls/TrackballControls.js';
import KeyboardState from '../libs/util/KeyboardState.js';
import {TeapotGeometry} from '../build/jsm/geometries/TeapotGeometry.js';
import {initRenderer, 
        InfoBox,
        SecondaryBox,
        createGroundPlane,
        onWindowResize, 
        degreesToRadians, 
        createLightSphere} from "../libs/util/util.js";

///////// Cena, camera e renderização/////////////
var scene = new THREE.Scene();    // Create main scene
var stats = new Stats();          // To show FPS information

var renderer = initRenderer();    // View function in util/utils
    renderer.setClearColor("rgb(30, 30, 42)");
var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.lookAt(0, 0, 0);
    camera.position.set(2.18, 1.62, 3.31);
    camera.up.set( 0, 1, 0 );

///////// Cor de objeto ///////////////////    
var objColor = "rgb(150,150,150)";
var objShininess = 200;

//////// carregando teclado ///////////////
// To use the keyboard
var keyboard = new KeyboardState();

// Enable mouse rotation, pan, zoom etc.
var trackballControls = new TrackballControls( camera, renderer.domElement );

// Listen window size changes
window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );


///////////// Plano ////////////
var planeGeometry = new THREE.PlaneGeometry(4, 4);
planeGeometry.translate(0.0, 0.0, 0.0); // To avoid conflict with the axeshelper
var planeMaterial = new THREE.MeshLambertMaterial({
    color:"rgb(87, 45, 9)",
    //  "rgb(150, 150, 150)"
    side: THREE.DoubleSide
});
var plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotateX(degreesToRadians(90));
plane.receiveShadow = true;
scene.add(plane);



// Show axes (parameter is size of each axis)
var axesHelper = new THREE.AxesHelper( 20 );
    axesHelper.visible = true;
scene.add( axesHelper );

// Show text information onscreen
showInformation();

var infoBox = new SecondaryBox("");

// Teapot
var geometry = new TeapotGeometry(0.5);
var material = new THREE.MeshPhongMaterial({color:objColor, shininess:"200"});
    // material.side = THREE.DoubleSide;
var obj = new THREE.Mesh(geometry, material);
    obj.castShadow = true;
    obj.position.set(0.0, 0.5, 0.0);
scene.add(obj);

/////// Postes/////

var cilindro = new THREE.CylinderGeometry( 0.02, 0.02,2.0,40,1);
var poleMat = new THREE.MeshLambertMaterial();
var poste1 = new THREE.Mesh( cilindro, poleMat );
poste1.position.x = -2.0;
poste1.position.y = 1.0;
poste1.position.z = 2.0;
// poste1.receiveShadow = true;
// poste1.castShadow = true;
scene.add( poste1 );

var poste2= poste1.clone();
poste2.position.set(-2.0,1.0,-2.0);
scene.add(poste2);

var poste3= poste1.clone();
poste3.position.set(2.0,1.0,-2.0);
scene.add(poste3);

var poste4= poste1.clone();
poste4.position.set(2.0,1.0,2.0);
scene.add(poste4);

var cilindro = new THREE.CylinderGeometry( 0.02, 0.02,4.0,40,1);
var poleMat = new THREE.MeshLambertMaterial();
var poste_horizontal1= new THREE.Mesh( cilindro, poleMat );
poste_horizontal1.rotation.set(0,0,degreesToRadians(90));
poste_horizontal1.position.set(0.0,2.0,2.0);
scene.add(poste_horizontal1);

var poste_horizontal2= poste_horizontal1.clone();
poste_horizontal2.rotation.set(degreesToRadians(90),0,0)
poste_horizontal2.position.set(2.0,2.0,0.0);
scene.add(poste_horizontal2);


var poste_horizontal3= poste_horizontal1.clone();
poste_horizontal3.rotation.set(0,0,degreesToRadians(90));
poste_horizontal3.position.set(0.0,2.0,-2.0);
scene.add(poste_horizontal3);
//----------------------------------------------------------------------------
//----------------------------------------------------------------------------

//---------------------------------------------------------
// Default light position, color, ambient color and intensity
var lightPositionRed = new THREE.Vector3(0.0, 2.0, 2.0);
var lightPositionGreen = new THREE.Vector3(0.0, 2.0, -2.0);
var lightPositionBlue = new THREE.Vector3(2.0, 2.0, 0.0);
// var lightColor = "rgb(255,255,255)";
var lightColorRed = "rgb(255,0,0)";
var lightColorGreen = "rgb(0,255,0)";
var lightColorBlue = "rgb(0,0,255)";
var ambientColor = "rgb(50,50,50)";

// Sphere to represent the light
var lightSphereRed = createLightSphere(scene, 0.05, 10, 10, lightPositionRed,'red');
var lightSphereGreen = createLightSphere(scene, 0.05, 10, 10, lightPositionGreen,'green');
var lightSphereBlue = createLightSphere(scene, 0.05, 10, 10, lightPositionBlue,'blue');

//---------------------------------------------------------
// Create and set all lights. Only Spot and ambient will be visible at first
var spotLightRed = new THREE.SpotLight(lightColorRed);
var spotLightGreen = new THREE.SpotLight(lightColorGreen);
var spotLightBlue = new THREE.SpotLight(lightColorBlue);

setSpotLight(spotLightRed,lightPositionRed);
setSpotLight(spotLightGreen,lightPositionGreen);
setSpotLight(spotLightBlue,lightPositionBlue);

// More info here: https://threejs.org/docs/#api/en/lights/AmbientLight
var ambientLight = new THREE.AmbientLight(ambientColor);
scene.add( ambientLight );

buildInterface();
render();



// Set Spotlight
function setSpotLight(spotLight, position)
{
    spotLight.position.copy(position);
    spotLight.shadow.mapSize.width = 512;
    spotLight.shadow.mapSize.height = 512;
    spotLight.angle = degreesToRadians(40);    
    spotLight.castShadow = true;
    spotLight.decay = 2;
    spotLight.penumbra = 0.1;
    spotLight.name = "Spot Light"
    spotLight.intensity = 2;

    scene.add(spotLight);
    // lightArray.push( spotLight );
}


// Update light position of the current light
function updateLightPosition()
{
    spotLightRed.position.copy(lightPositionRed);
    lightSphereRed.position.copy(lightPositionRed);
    
    spotLightGreen.position.copy(lightPositionGreen);
    lightSphereGreen.position.copy(lightPositionGreen);
    
    spotLightBlue.position.copy(lightPositionBlue);
    lightSphereBlue.position.copy(lightPositionBlue);
    
    infoBox.changeMessage(        
        "Position Red:" + lightPositionRed.x.toFixed(2) +
        ", Green: " + lightPositionGreen.x.toFixed(2) +
        ", Blue: " + lightPositionBlue.z.toFixed(2)
    );
}
var clock = new THREE.Clock();

function roda_TeaPot() {
    if(clock){
        var delta = clock.getDelta();
        if(rotateTeaPot){
        let velAngular = degreesToRadians(30);
        obj.rotateY(delta * velAngular);
        }
    }
    
}


var rotateTeaPot=false;
function buildInterface()
{
    //------------------------------------------------------------
    // Interface
    var controls = new function ()
    {

    this.spotLightRed = true;

    this.onEnableSpotLightRed = function(){
        spotLightRed.visible = this.spotLightRed;
    };
    this.spotLightGreen = true;

    this.onEnableSpotLightGreen = function(){
        spotLightGreen.visible = this.spotLightGreen;
    };
    this.spotLightBlue= true;

    this.onEnableSpotLightBlue = function(){
        spotLightBlue.visible = this.spotLightBlue;
    };
    
    this.rotateTeaPot =false;
    this.onEnableRotateTeaPot = function(){
        rotateTeaPot=this.rotateTeaPot;
    };

    };

    var gui = new GUI();
    
    
    gui.add(controls, 'spotLightRed', true)
    .name("Red Light")
    .onChange(function(e) { controls.onEnableSpotLightRed() });

    gui.add(controls, 'spotLightGreen', true)
    .name("Green Light")
    .onChange(function(e) { controls.onEnableSpotLightGreen() });
    
    gui.add(controls, 'spotLightBlue', true)
    .name("Blue Light")
    .onChange(function(e) { controls.onEnableSpotLightBlue() });
    
    gui.add(controls, 'rotateTeaPot', false)
    .name("Rotate TeaPot")
    .onChange(function(e) { controls.onEnableRotateTeaPot() });
}

function keyboardUpdate()
{
    keyboard.update();
    if ( keyboard.pressed("D") )
    {
        if(lightPositionRed.x>-2.0){
            lightPositionRed.x -= 0.05;
            updateLightPosition();
        }
   
    }
    if ( keyboard.pressed("A") )
    {
        if(lightPositionRed.x<2.0){
            lightPositionRed.x += 0.05;
            updateLightPosition();
        }
    
    }
    if ( keyboard.pressed("right") )
    {
        if(lightPositionRed.z<=2.0){
            lightPositionRed.z -= 0.05;
            updateLightPosition();
        }
    
    }
    if ( keyboard.pressed("left") )
    {
        if(lightPositionRed.z>-2.0){
            lightPositionRed.z += 0.05;
            updateLightPosition();
        }
    
    }
    if ( keyboard.pressed("S") )
    {
        if(lightPositionBlue.z<2.0){
            lightPositionBlue.z += 0.05;
            updateLightPosition();
        }
    
    }
    if ( keyboard.pressed("F") )
    {
        if(lightPositionBlue.z>-2.0){
            lightPositionBlue.z -= 0.05;
             updateLightPosition();
        }
    
    }
    if ( keyboard.pressed("Z") )
    {
        if(lightPositionGreen.x>-2.0){
            lightPositionGreen.x -= 0.05;
            updateLightPosition();
        }
   
    }
    if ( keyboard.pressed("C") )
    {
        if(lightPositionGreen.x<2.0){
            lightPositionGreen.x += 0.05;
            updateLightPosition();
        }
    
    }
    if ( keyboard.pressed("G") )
    {
        if(lightPositionGreen.z>-2.0){
            lightPositionRed.z += 0.05;
            updateLightPosition();
        }
   
    }
    if ( keyboard.pressed("H") )
    {
        if(lightPositionGreen.z<2.0){
            lightPositionGreen.z += 0.05;
            updateLightPosition();
        }
    
    }
}

function showInformation()
{
    // Use this to show information onscreen
    var controls = new InfoBox();
    controls.add("Spotlight");
    controls.addParagraph();
    controls.add("Red- AD");
    controls.add("Green-ZC");
    controls.add('Blue -SF');
    controls.show();
}

function render()
{
    stats.update();
    trackballControls.update();
    keyboardUpdate();
    roda_TeaPot();
    requestAnimationFrame(render);
    renderer.render(scene, camera)
}
