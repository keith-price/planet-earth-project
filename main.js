import './style.css';

import * as THREE from 'three';

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
// import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { AmbientLight } from 'three';
import { DoubleSide } from 'three';
// import { PointLight } from 'three';

let wInner = window.innerWidth;
let wHeight = window.innerHeight;
const scene = new THREE.Scene();
// scene.fog = new THREE.FogExp2(0xffffff, 0.00001);

const camera = new THREE.PerspectiveCamera(45, wInner / wHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
	canvas: document.querySelector('#bg'),
	alpha: true,
	antialias: true,
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(wInner, wHeight);
camera.position.set(0, 40, 100);

const renderScene = new RenderPass(scene, camera);
// bloom vector (resolution, strength, radius, threshold)
// bloom adds a very visible and strange looking halo around the moon
// const bloomPass = new UnrealBloomPass(
// 	new THREE.Vector2(wInner, wHeight),
// 	.5,
// 	.5,
// 	.5
// );

const composer = new EffectComposer(renderer);
composer.addPass(renderScene);
// removed bloom due to strange effect around moon
// composer.addPass(bloomPass);

// Sun
const sunTexture = new THREE.TextureLoader().load('/textures/2k_sun.jpg');
// const sunNormalMap = new THREE.TextureLoader().load(
// 	'/textures/normal_map_for_sun.jpg'
// );

const sunGeometry = new THREE.SphereGeometry(7.5, 64, 64);
const sunMaterial = new THREE.MeshBasicMaterial({
	map: sunTexture,
});

const sun = new THREE.Mesh(sunGeometry, sunMaterial);
sun.castShadow = true;
scene.add(sun);

// Mecury
const mercuryTexture = new THREE.TextureLoader().load(
	'/textures/2k_mercury.jpg'
);

const mercuryGeometry = new THREE.SphereGeometry(0.24, 64, 64);
const mercuryMaterial = new THREE.MeshLambertMaterial({
	map: mercuryTexture,
});

const mercury = new THREE.Mesh(mercuryGeometry, mercuryMaterial);
mercury.castShadow = true;
mercury.receiveShadow = true;
mercury.position.set(9, 0, 0);
scene.add(mercury);

const mercuryOrbitCenter = new THREE.Object3D();
mercuryOrbitCenter.position.set(0, 0, 0);
scene.add(mercuryOrbitCenter);

// Venus
const venusTexture = new THREE.TextureLoader().load(
	'/textures/2k_venus_surface.jpg'
);

const venusGeometry = new THREE.SphereGeometry(1, 64, 64);
const venusMaterial = new THREE.MeshLambertMaterial({
	map: venusTexture,
});

const venus = new THREE.Mesh(venusGeometry, venusMaterial);
venus.castShadow = true;
venus.receiveShadow = true;
venus.position.set(13, 0, 0);
scene.add(venus);

const venusOrbitCenter = new THREE.Object3D();
venusOrbitCenter.position.set(0, 0, 0);
scene.add(venusOrbitCenter);

// Earth
const earthTexture = new THREE.TextureLoader().load(
	'/textures/2k_earth_daymap.jpg'
);

const earthGeometry = new THREE.SphereGeometry(1, 64, 64);
const earthMaterial = new THREE.MeshLambertMaterial({
	map: earthTexture,
});

const earth = new THREE.Mesh(earthGeometry, earthMaterial);
earth.castShadow = true;
earth.receiveShadow = true;
earth.position.set(20, 0, 0);
scene.add(earth);

// Earth clouds sphere
const earthCloudsTexture = new THREE.TextureLoader().load(
	'textures/2k_earth_clouds.jpg'
);

const earthCloudsGeometry = new THREE.SphereGeometry(1.025, 64, 64);
const earthCloudsMaterial = new THREE.MeshLambertMaterial({
	map: earthCloudsTexture,
	transparent: true,
	opacity: 0.4,
});

const earthOrbitCenter = new THREE.Object3D();
earthOrbitCenter.position.set(0, 0, 0);
scene.add(earthOrbitCenter);

const earthClouds = new THREE.Mesh(earthCloudsGeometry, earthCloudsMaterial);
earthClouds.castShadow = true;
earthClouds.receiveShadow = true;
earthClouds.position.set(20, 0, 0);

scene.add(earthClouds);

// Object to control moon orbit
const moonOrbitCenter = new THREE.Object3D();
moonOrbitCenter.position.set(20, 0, 0);
scene.add(moonOrbitCenter);

// add ISS gltf model to the scene
const loader = new GLTFLoader();
let iss;
loader.load('textures/iss/scene.gltf', (gltf) => {
	iss = gltf.scene;
	iss.scale.set(0.001, 0.001, 0.001);
	iss.position.set(1, 0, 0.4);

	iss.rotateZ(1.4);
	iss.rotateX(2.5);

	iss.castShadow = true;
	iss.receiveShadow = true;

	scene.add(iss);
	// console.log(iss.getWorldPosition());
});

const issOrbitCenter = new THREE.Object3D();
issOrbitCenter.rotateX(-0.7);
issOrbitCenter.position.set(20, 0, 0);

scene.add(issOrbitCenter);

// Moon
const moonTexture = new THREE.TextureLoader().load('textures/2k_moon.jpg');

const moonGeometry = new THREE.SphereGeometry(0.1, 64, 64);
const moonMaterial = new THREE.MeshLambertMaterial({
	map: moonTexture,
});

const moon = new THREE.Mesh(moonGeometry, moonMaterial);
moon.position.set(2, 0, 0);
moon.castShadow = true;
moon.receiveShadow = true;

scene.add(moon);

// mars
const marsTexture = new THREE.TextureLoader().load('textures/2k_mars.jpg');

const marsGeometry = new THREE.SphereGeometry(0.85, 64, 64);
const marsMaterial = new THREE.MeshLambertMaterial({
	map: marsTexture,
});

const mars = new THREE.Mesh(marsGeometry, marsMaterial);
mars.position.set(28, 0, 0);
mars.castShadow = true;
mars.receiveShadow = true;

scene.add(mars);

const marsOrbitCenter = new THREE.Object3D();
marsOrbitCenter.position.set(0, 0, 0);
scene.add(marsOrbitCenter);

// jupiter
const jupiterTexture = new THREE.TextureLoader().load(
	'textures/2k_jupiter.jpg'
);

const jupiterGeometry = new THREE.SphereGeometry(2.5, 64, 64);
const jupiterMaterial = new THREE.MeshLambertMaterial({
	map: jupiterTexture,
});

const jupiter = new THREE.Mesh(jupiterGeometry, jupiterMaterial);
jupiter.position.set(38, 0, 0);
jupiter.castShadow = true;
jupiter.receiveShadow = true;
scene.add(jupiter);

const jupiterOrbitCenter = new THREE.Object3D();
jupiterOrbitCenter.position.set(0, 0, 0);
scene.add(jupiterOrbitCenter);

// saturn
const saturnTexture = new THREE.TextureLoader().load('/textures/2k_saturn.jpg');

const saturnGeometry = new THREE.SphereGeometry(2, 64, 64);
const saturnMaterial = new THREE.MeshLambertMaterial({
	map: saturnTexture,
});

const saturn = new THREE.Mesh(saturnGeometry, saturnMaterial);
saturn.position.set(48, 0, 0);
saturn.castShadow = true;
saturn.receiveShadow = true;
scene.add(saturn);

const saturnOrbitCenter = new THREE.Object3D();
saturnOrbitCenter.position.set(0, 0, 0);
scene.add(saturnOrbitCenter);

// saturn's rings
const saturnRingsTexture = new THREE.TextureLoader().load(
	'/textures/2k_saturn_ring_alpha.jpg',
	
);

const saturnsRingsGeometry = new THREE.RingBufferGeometry(3, 5, 64);
var pos = saturnsRingsGeometry.attributes.position;
var v3 = new THREE.Vector3();
for (let i = 0; i < pos.count; i++){
    v3.fromBufferAttribute(pos, i);
    saturnsRingsGeometry.attributes.uv.setXY(i, v3.length() < 4 ? 0 : 1, 1);
}

// const saturnRingsGeometry = new THREE.RingGeometry(2.5, 3.5, 64);
const saturnRingsMaterial = new THREE.MeshLambertMaterial({
	side: THREE.DoubleSide,
	map: saturnRingsTexture,
	
});

const saturnsRings = new THREE.Mesh(saturnsRingsGeometry, saturnRingsMaterial);
saturnsRings.position.set(48, 0, 0);
saturnsRings.rotateX(4.7);
saturnsRings.castShadow = true;
saturnsRings.receiveShadow = true;
scene.add(saturnsRings);

// const saturnsRingsOrbitCenter = new THREE.Object3D();
// saturnsRingsOrbitCenter.position.set(48, 0, 0);
// scene.add(saturnsRingsOrbitCenter);

// uranus
const uranusTexture = new THREE.TextureLoader().load('/textures/2k_uranus.jpg');

const uranusGeometry = new THREE.SphereGeometry(1.4, 64, 64);
const uranusMaterial = new THREE.MeshLambertMaterial({
	map: uranusTexture,
});

const uranus = new THREE.Mesh(uranusGeometry, uranusMaterial);
uranus.position.set(58, 0, 0);
uranus.castShadow = true;
uranus.receiveShadow = true;
scene.add(uranus);

const uranusOrbitCenter = new THREE.Object3D();
uranusOrbitCenter.position.set(0, 0, 0);
scene.add(uranusOrbitCenter);

// neptune
const neptuneTexture = new THREE.TextureLoader().load(
	'/textures/2k_neptune.jpg'
);

const neptuneGeometry = new THREE.SphereGeometry(1.2, 64, 64);
const neptuneMaterial = new THREE.MeshLambertMaterial({
	map: neptuneTexture,
});

const neptune = new THREE.Mesh(neptuneGeometry, neptuneMaterial);
neptune.position.set(68, 0, 0);
neptune.castShadow = true;
neptune.receiveShadow = true;
scene.add(neptune);

const neptuneOrbitCenter = new THREE.Object3D();
neptuneOrbitCenter.position.set(0, 0, 0);
scene.add(neptuneOrbitCenter);

// lighting
const pointLight = new THREE.PointLight(0xffffff, 1.1);

pointLight.position.set(0, 0, 0);
pointLight.castShadow = true;

const ambientLight = new THREE.AmbientLight(0xffffff, .1);
ambientLight.position.set(0, 50, 0);

scene.add(pointLight, ambientLight);

// const lightHelper = new THREE.PointLightHelper(pointLight);

// const gridHelper = new THREE.GridHelper(200, 50);

// scene.add(lightHelper);

const controls = new OrbitControls(camera, renderer.domElement);

// stars
// function addStar() {
// 	const starGeometry = new THREE.SphereGeometry(0.25, 24, 25);
// 	const starMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
// 	const star = new THREE.Mesh(starGeometry, starMaterial);

// 	const [x, y, z] = Array(3)
// 		.fill()
// 		.map(() => THREE.MathUtils.randFloatSpread(1000));
// 	star.position.set(x, y, z);
// 	scene.add(star);
// }

// Array(200).fill().forEach(addStar);

// get position of iss
// const cameraOffset = new Vector3(100, 10, 50)
// const issPosition = iss.getWorldPosition(issPosition);

// const updateCameraPosition = (event) => {
// 	if (window.scrollY < 800) {
// 		moonOrbitCenter.remove(camera);
// 		camera.position.set(0, 0, 30);
// 	} else if (window.scrollY >= 800 && window.scrollY < 1800) {
// 		// attach to moonOrbitCenter in order to see the Earth rotate, if attach to Earth then we don't see the rotation
// 		moonOrbitCenter.add(camera);
// 		camera.position.set(-5, 0, 20);
// 	} else if (window.scrollY >= 1800 && window.scrollY < 2750) {
// 		moon.add(camera);
// 		camera.position.set(2, 0, 5);
// 	} else if (window.scrollY >= 2750) {
// 		iss.add(camera);

// 		camera.position.set(11, 0, 10);
// 	}
// };

// window.addEventListener('scroll', updateCameraPosition);

// animation
function animate() {
	requestAnimationFrame(animate);
	// sun
	sun.rotation.y += 0.001;

	// mercury
	mercuryOrbitCenter.add(mercury);
	mercuryOrbitCenter.rotation.y += 0.01;
	mercury.rotation.y += 0.0001;

	// venus
	venusOrbitCenter.add(venus);
	venusOrbitCenter.rotation.y += 0.002;
	venus.rotation.y -= 0.01;

	// earth
	earthOrbitCenter.add(earth, earthClouds);
	earthOrbitCenter.rotation.y += 0.001;
	earth.rotation.y += 0.01;
	earthClouds.rotation.y += 0.01;
	// not sure of orbit time, need to calculate more accurately
	earth.attach(moonOrbitCenter);

	// moon
	moonOrbitCenter.rotation.y += 0.0000037037037;
	moonOrbitCenter.add(moon);
	moon.rotation.y += 0.00000378;

	// iss and orbit
	issOrbitCenter.add(iss);
	issOrbitCenter.rotation.y += 0.001;

	// mars
	marsOrbitCenter.add(mars);
	marsOrbitCenter.rotation.y += 0.0005;
	mars.rotation.y += 0.01;

	// jupiter
	jupiterOrbitCenter.add(jupiter);
	jupiterOrbitCenter.rotation.y += 0.0005;
	jupiter.rotation.y += 0.05;

	// saturn
	saturnOrbitCenter.add(saturn, saturnsRings);
	saturnOrbitCenter.rotation.y += 0.0003;
	saturn.rotation.y += 0.03;
	saturnsRings.rotation.z += 0.04;

	// saturn's rings

	// uranus
	uranusOrbitCenter.add(uranus);
	uranusOrbitCenter.rotation.y += 0.0001;
	uranus.rotation.y += 0.02;

	// neptune
	neptuneOrbitCenter.add(neptune);
	neptuneOrbitCenter.rotation.y += 0.00005;
	neptune.rotation.y += 0.04;

	controls.update();

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
