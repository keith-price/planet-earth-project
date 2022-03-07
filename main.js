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
// scene.fog = new THREE.FogExp2(0x000000, 0.0011);

const camera = new THREE.PerspectiveCamera(70, wInner / wHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
	canvas: document.querySelector('#bg'),
	antialias: true,
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(wInner, wHeight);
camera.position.setZ(30);

const renderScene = new RenderPass(scene, camera);
// bloom vector (resolution, strength, radius, threshold)
const bloomPass = new UnrealBloomPass(
	new THREE.Vector2(wInner, wHeight),
	0.17,
	0,
	0
);

const composer = new EffectComposer(renderer);
composer.addPass(renderScene);
composer.addPass(bloomPass);

// Earth
const earthTexture = new THREE.TextureLoader().load(
	'/textures/8k_earth_daymap_ultra.jpg'
);
const earthNormalMap = new THREE.TextureLoader().load(
	'./textures/8k_earth_normal_map.tif'
);

const earthGeometry = new THREE.SphereGeometry(10, 256, 256);
const earthMaterial = new THREE.MeshLambertMaterial({
	map: earthTexture,
	normalMap: earthNormalMap,
});

const earth = new THREE.Mesh(earthGeometry, earthMaterial);
earth.castShadow = true;
earth.receiveShadow = true;

scene.add(earth);

// Earth clouds sphere
const earthCloudsTexture = new THREE.TextureLoader().load(
	'textures/fair_clouds_8k.jpg'
);

const earthCloudsGeometry = new THREE.SphereGeometry(10.05, 256, 256);
const earthCloudsMaterial = new THREE.MeshLambertMaterial({
	map: earthCloudsTexture,
	transparent: true,
	opacity: 0.4,
});

const earthClouds = new THREE.Mesh(earthCloudsGeometry, earthCloudsMaterial);
earthClouds.castShadow = true;
earthClouds.receiveShadow = true;

scene.add(earthClouds);

// Moon
const moonTexture = new THREE.TextureLoader().load(
	'textures/Moon.Diffuse_alt.jpg'
);
const moonNormalMap = new THREE.TextureLoader().load(
	'./textures/Moon.Normal_map.jpg'
);

const moonGeometry = new THREE.SphereGeometry(2, 256, 256);
const moonMaterial = new THREE.MeshLambertMaterial({
	map: moonTexture,
	normalMap: moonNormalMap,
});

const moon = new THREE.Mesh(moonGeometry, moonMaterial);
moon.position.set(40, 0, 0);
moon.castShadow = true;
moon.receiveShadow = true;

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
	iss.position.set(2.5, 0, 10);

	iss.rotateZ(1.6);
	iss.rotateX(1.6);
	iss.castShadow = true;
	iss.receiveShadow = true;

	scene.add(iss);
	// console.log(iss.getWorldPosition());
});

const issOrbitCenter = new THREE.Object3D();
issOrbitCenter.rotateX(-0.7);

scene.add(issOrbitCenter);

// lighting
const pointLight = new THREE.PointLight(0xfff5f2, 1.5);

pointLight.position.set(-10, 0, 250);
pointLight.castShadow = true;

const ambientLight = new THREE.AmbientLight(0xadd8e6, 0.03);
ambientLight.position.set(0, 0, 0);

scene.add(pointLight, ambientLight);

const lightHelper = new THREE.PointLightHelper(pointLight);

// const gridHelper = new THREE.GridHelper(200, 50);

// scene.add(lightHelper);

// const controls = new OrbitControls(camera, renderer.domElement);

// stars
function addStar() {
	const starGeometry = new THREE.SphereGeometry(0.25, 24, 25);
	const starMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
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
		moonOrbitCenter.remove(camera);
		camera.position.set(0, 0, 30);
	} else if (window.scrollY >= 800 && window.scrollY < 1800) {
		// attach to moonOrbitCenter in order to see the Earth rotate, if attach to Earth then we don't see the rotation
		moonOrbitCenter.add(camera);
		camera.position.set(-5, 0, 20);
	} else if (window.scrollY >= 1800 && window.scrollY < 2750) {
		moon.add(camera);
		camera.position.set(2, 0, 5);
	} else if (window.scrollY >= 2750) {
		iss.add(camera);

		camera.position.set(11, 0, 10);
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
