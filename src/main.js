import { cm1, cm2 } from './common';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Pillar } from './Pillar';
import { Floor } from './Floor';
import { Bar } from './Bar';
import { SideLight } from './SideLight';
import { Glass } from './Glass';
import { Player } from './Player';

// ----- 주제: The Bridge 게임 만들기

// Renderer
// const canvas = document.querySelector('#three-canvas');
const renderer = new THREE.WebGLRenderer({
	canvas: cm1.canvas,
	antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// Scene
// const scene =  cm1.scene;
cm1.scene.background = new THREE.Color(cm2.backgroundColor);

// Camera
const camera = new THREE.PerspectiveCamera(
	75,
	window.innerWidth / window.innerHeight,
	0.1,
	1000
);
camera.position.x = -4;
camera.position.y = 19;
camera.position.z = 14;
cm1.scene.add(camera);

// Light
const ambientLight = new THREE.AmbientLight(cm2.lightColor, 0.8);
cm1.scene.add(ambientLight);

const spotLightDistance = 50;
const spotLight1 = new THREE.SpotLight(cm2.lightColor, 1);
spotLight1.castShadow = true;
spotLight1.shadow.mapSize.width = 2048;
spotLight1.shadow.mapSize.height = 2048;
const spotLight2 = spotLight1.clone();
const spotLight3 = spotLight1.clone();
const spotLight4 = spotLight1.clone();
spotLight1.position.set(-spotLightDistance, spotLightDistance, spotLightDistance);
spotLight2.position.set(spotLightDistance, spotLightDistance, spotLightDistance);
spotLight3.position.set(-spotLightDistance, spotLightDistance, -spotLightDistance);
spotLight4.position.set(spotLightDistance, spotLightDistance, -spotLightDistance);
cm1.scene.add(spotLight1, spotLight2, spotLight3, spotLight4);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const glassUnitSize = 1.2;
const numberOfGlass = 10; 

// floor
const floor = new Floor({
	name: 'floor',

})

// Pillar
const pillar1 = new Pillar({
	name: 'pillar',
	x: 0,
	y: 5.5,
	z: -glassUnitSize * 12 - glassUnitSize / 2,
});
const pillar2 = new Pillar({
	name: 'pillar',
	x: 0,
	y: 5.5,
	z: glassUnitSize * 12 + glassUnitSize / 2,
});

// Bar
const bar1 = new Bar({ name: 'bar', x: -1.6, y: 10.3, z: 0 });
const bar2 = new Bar({ name: 'bar', x: -0.4, y: 10.3, z: 0 });
const bar3 = new Bar({ name: 'bar', x: 0.4, y: 10.3, z: 0 });
const bar4 = new Bar({ name: 'bar', x: 1.6, y: 10.3, z: 0 });

const sideLights = [];
for (let i = 0; i < 49; i++) {
	sideLights.push(new SideLight({
		name: 'sideLight',
		container: bar1.mesh,
		z: i * 0.5 - glassUnitSize * 10
	}));
}
for (let i = 0; i < 49; i++) {
	sideLights.push(new SideLight({
		name: 'sideLight',
		container: bar4.mesh,
		z: i * 0.5 - glassUnitSize * 10
	}));
}

// Glasses
let glassTypeNumber = 0;
let glassTypes =[];
for (let i = 0;i < numberOfGlass; i++) {
	glassTypeNumber = Math.round(Math.random());

	switch (glassTypeNumber) {
		case 0:
			glassTypes = ['normal', 'strong'];
			break;
		case 1:
			glassTypes = ['strong', 'normal'];
			break;
	}

	const glass1 = new Glass({
		name: `glass-${glassTypes[0]}`,
		x: -1,
		y: 10.5,
		z: i * glassUnitSize * 2 - glassUnitSize * 9,
		type: glassTypes[0],
	});
	const glass2 = new Glass({
		name: `glass-${glassTypes[1]}`,
		x: 1,
		y: 10.5,
		z: i * glassUnitSize * 2 - glassUnitSize * 9,
		type: glassTypes[1],
	});
}

// Player
new Player({
	name: 'player',
	x: 0,
	y: 10.95,
	z: 13,
	rotationX: 0,
	rotationY: Math.PI,
	rotationZ: 0
});

// Draw
const clock = new THREE.Clock();

function draw() {
	const delta = clock.getDelta();

	if (cm1.mixer) cm1.mixer.update(delta);

	controls.update();

	renderer.render(cm1.scene, camera);
	renderer.setAnimationLoop(draw);
}

function setSize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.render(cm1.scene, camera);
}

// 이벤트
window.addEventListener('resize', setSize);

draw();