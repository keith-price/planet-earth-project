import './style.css';

import * as THREE from 'three';

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';

// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
let wInner = window.innerWidth;
let wHeight = window.innerHeight;
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x000000, 0.011);

const camera = new THREE.PerspectiveCamera(70, wInner / wHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
	canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(wInner, wHeight);
camera.position.setZ(30);

const renderScene = new RenderPass(scene, camera);
// bloom vector (resolution, strength, radius, threshold)
const bloomPass = new UnrealBloomPass(
	new THREE.Vector2(wInner, wHeight),
	0.25,
	0,
	0
);

const composer = new EffectComposer(renderer);
composer.addPass(renderScene);
composer.addPass(bloomPass);

// Earth
const earthTexture = new THREE.TextureLoader().load(
	'/textures/2k_earth_daymap.jpg'
);

const earthGeometry = new THREE.SphereGeometry(10, 256, 256);
const earthMaterial = new THREE.MeshStandardMaterial({
	map: earthTexture,
});

const earth = new THREE.Mesh(earthGeometry, earthMaterial);

scene.add(earth);

// Earth clouds sphere
const earthCloudsTexture = new THREE.TextureLoader().load(
	'textures/2k_earth_clouds.jpg'
);

const earthCloudsGeometry = new THREE.SphereGeometry(10.2, 64, 64);
const earthCloudsMaterial = new THREE.MeshStandardMaterial({
	map: earthCloudsTexture,
	transparent: true,
	opacity: 0.3,
});

const earthClouds = new THREE.Mesh(earthCloudsGeometry, earthCloudsMaterial);

scene.add(earthClouds);

// Moon
const moonTexture = new THREE.TextureLoader().load('textures/2k_moon.jpg');

const moonGeometry = new THREE.SphereGeometry(2.7, 64, 64);
const moonMaterial = new THREE.MeshStandardMaterial({
	map: moonTexture,
	transparent: true,
	opacity: 0.8,
});

const moon = new THREE.Mesh(moonGeometry, moonMaterial);
moon.position.set(40, 0, 0);

scene.add(moon);

// Object to control moon orbit
const moonOrbitCenter = new THREE.Object3D();
scene.add(moonOrbitCenter);

// add ISS gltf model to the scene
const loader = new GLTFLoader();
let iss;
loader.load('textures/iss/scene.gltf', (gltf) => {
	iss = gltf.scene;
	iss.scale.set(0.02, 0.02, 0.02);
	iss.position.set(3.5, 0, 10);

	iss.rotateZ(1.6);
	iss.rotateX(1.6);

	scene.add(iss);
	// console.log(iss.getWorldPosition());
});

const issOrbitCenter = new THREE.Object3D();
issOrbitCenter.rotateX(-0.7);

scene.add(issOrbitCenter);

// lighting
const pointLight = new THREE.PointLight(0xffffff, 1);
// const ambientLight = new THREE.AmbientLight(0xffffff);
pointLight.position.set(0, 0, 250);

scene.add(pointLight);

// const lightHelper = new THREE.PointLightHelper(pointLight);
// const gridHelper = new THREE.GridHelper(200, 50);

// scene.add(lightHelper);

// const controls = new OrbitControls(camera, renderer.domElement);

// stars
function addStar() {
	const starGeometry = new THREE.SphereGeometry(0.25, 24, 25);
	const starMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
	const star = new THREE.Mesh(starGeometry, starMaterial);

	const [x, y, z] = Array(3)
		.fill()
		.map(() => THREE.MathUtils.randFloatSpread(1000));
	star.position.set(x, y, z);
	scene.add(star);
}

Array(200).fill().forEach(addStar);

// get position of iss
// const cameraOffset = new Vector3(100, 10, 50)
// const issPosition = iss.getWorldPosition(issPosition);

const updateCameraPosition = (event) => {
	if (window.scrollY < 800) {
		iss.remove(camera);

		camera.position.set(0, 0, 30);
	} else if (window.scrollY >= 800 && window.scrollY < 1800) {
		iss.remove(camera);
		camera.position.set(-5, 0, 20);
	} else if (window.scrollY >= 1800 && window.scrollY < 2600) {
		iss.remove(camera);
		camera.position.set(42, 0, 5.5);
	} else if (window.scrollY >= 2600) {
		iss.add(camera);

		// camera.position.set(8, 4, -20);

		camera.position.set(10, 0, 10);
	}
};

window.addEventListener('scroll', updateCameraPosition);

// animation
function animate() {
	requestAnimationFrame(animate);

	earth.rotation.y += 0.0001;
	earthClouds.rotation.y += 0.00011;
	// not sure of orbit time, need to calculate more accurately
	moonOrbitCenter.rotation.y += 0.0000037037037;
	moonOrbitCenter.add(moon);
	moon.rotation.y += 0.00000378;
	// iss and orbit

	issOrbitCenter.add(iss);
	issOrbitCenter.rotation.y += 0.001;
	// controls.update();

	composer.render(scene, camera);
}

animate();

// function that dynamically sets on window resize
const handleWindowResize = () => {
	wInner = window.innerWidth;
	wHeight = window.innerHeight;
	camera.aspect = wInner / wHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
};
window.addEventListener('resize', handleWindowResize, false);
