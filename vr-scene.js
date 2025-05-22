import * as THREE from 'three';
import { VRButton } from 'three/examples/jsm/webxr/VRButton.js';
import { XRControllerModelFactory } from 'three/examples/jsm/webxr/XRControllerModelFactory.js';

let camera, scene, renderer;
let controller1, controller2;
let controllerGrip1, controllerGrip2;
let canvasPanel;
let raycaster;
let isVRMode = false;

init();
animate();

function init() {
    // Create scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x505050);

    // Create camera
    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 20);
    camera.position.set(0, 1.6, 3);

    // Create renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.xr.enabled = true;
    document.body.appendChild(renderer.domElement);

    // Add VR button
    document.body.appendChild(VRButton.createButton(renderer));

    // Add lights
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // Create canvas panel
    const canvasTexture = new THREE.CanvasTexture(createCanvas());
    const canvasMaterial = new THREE.MeshBasicMaterial({ map: canvasTexture });
    const canvasGeometry = new THREE.PlaneGeometry(0.32, 0.18); // 320x180 pixels converted to meters
    canvasPanel = new THREE.Mesh(canvasGeometry, canvasMaterial);
    canvasPanel.position.set(0, 1.6, -1); // Position in front of user
    scene.add(canvasPanel);

    // Setup controllers
    const controllerModelFactory = new XRControllerModelFactory();

    controller1 = renderer.xr.getController(0);
    controller2 = renderer.xr.getController(1);
    scene.add(controller1);
    scene.add(controller2);

    controllerGrip1 = renderer.xr.getControllerGrip(0);
    controllerGrip2 = renderer.xr.getControllerGrip(1);
    controllerGrip1.add(controllerModelFactory.createControllerModel(controllerGrip1));
    controllerGrip2.add(controllerModelFactory.createControllerModel(controllerGrip2));
    scene.add(controllerGrip1);
    scene.add(controllerGrip2);

    // Initialize raycaster
    raycaster = new THREE.Raycaster();

    // Add event listeners
    controller1.addEventListener('selectstart', onSelectStart);
    controller2.addEventListener('selectstart', onSelectStart);

    // Handle VR mode changes
    renderer.xr.addEventListener('sessionstart', () => {
        isVRMode = true;
    });

    renderer.xr.addEventListener('sessionend', () => {
        isVRMode = false;
    });

    // Handle window resize
    window.addEventListener('resize', onWindowResize);
}

function createCanvas() {
    const canvas = document.createElement('canvas');
    canvas.width = 320;
    canvas.height = 180;
    const ctx = canvas.getContext('2d');
    
    // Draw something on the canvas
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#000000';
    ctx.font = '20px Arial';
    ctx.fillText('VR Canvas Panel', 10, 30);
    
    return canvas;
}

function onSelectStart(event) {
    if (!isVRMode) return;

    const controller = event.target;
    const tempMatrix = new THREE.Matrix4();
    tempMatrix.identity().extractRotation(controller.matrixWorld);

    raycaster.setFromXRController(controller);
    const intersects = raycaster.intersectObject(canvasPanel);

    if (intersects.length > 0) {
        const intersect = intersects[0];
        const uv = intersect.uv;
        
        // Convert UV coordinates to canvas coordinates
        const x = Math.floor(uv.x * 320);
        const y = Math.floor((1 - uv.y) * 180);
        
        console.log(`Clicked at canvas coordinates: (${x}, ${y})`);
    }
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    renderer.setAnimationLoop(render);
}

function render() {
    renderer.render(scene, camera);
} 