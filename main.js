import './style.css';

import * as THREE from 'three';

// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
	75,
	window.innerWidth / window.innerHeight,
	0.1,
	1000
);

const renderer = new THREE.WebGLRenderer({
	canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(40);


// Created this object to text the planetMaker function
// const arrakis = {
// 	texture: './textures/2k_earth_daymap.jpg',
// 	geometry: [5, 64, 64],
// 	position: [-30, 0, 0],
// 	name: 'arrakis',
// };

// function to create planets - function currently doesn't return anything that can be used to animate the spehere
// const planetMaker = (planet) => {
// 	const [a, b, c] = planet.geometry;
// 	const [x, y, z] = planet.position;

// 	const texture = new THREE.TextureLoader().load(planet['texture']);
// 	const geometry = new THREE.SphereGeometry(a, b, c);
// 	const material = new THREE.MeshStandardMaterial({
// 		map: texture,
// 	});

// 	planet = new THREE.Mesh(geometry, material);
// 	planet.position.set(x, y, z);
// scene.add(planet)
// };

// planetMaker(arrakis);

// Earth
const earthTexture = new THREE.TextureLoader().load(
	'./textures/2k_earth_daymap.jpg'
);

const earthGeometry = new THREE.SphereGeometry(10, 64, 64);
const earthMaterial = new THREE.MeshStandardMaterial({
	map: earthTexture,
});

const earth = new THREE.Mesh(earthGeometry, earthMaterial);

scene.add(earth);

// Earth clouds sphere
const earthCloudsTexture = new THREE.TextureLoader().load(
	'./textures/2k_earth_clouds.jpg'
);

const earthCloudsGeometry = new THREE.SphereGeometry(10.2, 64, 64);
const earthCloudsMaterial = new THREE.MeshStandardMaterial({
	map: earthCloudsTexture,
	transparent: true,
	opacity: 0.15,
});

const earthClouds = new THREE.Mesh(earthCloudsGeometry, earthCloudsMaterial);

scene.add(earthClouds);

// Moon
const moonTexture = new THREE.TextureLoader().load('./textures/2k_moon.jpg');

const moonGeometry = new THREE.SphereGeometry(2.7, 64, 64);
const moonMaterial = new THREE.MeshStandardMaterial({
	map: moonTexture,
});

const moon = new THREE.Mesh(moonGeometry, moonMaterial);
moon.position.set(45, 0, 0);

scene.add(moon);

// Object to control moon orbit
const moonOrbitCenter = new THREE.Object3D();
scene.add(moonOrbitCenter);

// lighting
const pointLight = new THREE.PointLight(0xffffff, 1.75);
// const ambientLight = new THREE.AmbientLight(0xffffff);
pointLight.position.set(0, 0, 500);

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

// animation
function animate() {
	requestAnimationFrame(animate);

	earth.rotation.y += 0.001;
	earthClouds.rotation.y += 0.0011;
	// not sure of orbit time, need to calculate more accurately
	moonOrbitCenter.rotation.y += 0.000037037037;
	moonOrbitCenter.add(moon);
	moon.rotation.y += 0.0000378;

	// controls.update();

	renderer.render(scene, camera);
}

animate();
