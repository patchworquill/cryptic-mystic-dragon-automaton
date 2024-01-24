// import { GLTFLoader } from '@three/addons/loaders/GLTFLoader.js';
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Stats from 'three/examples/jsm/libs/stats.module'

const scene = new THREE.Scene();
// scene.add(new THREE.AxesHelper(5))
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const renderer = new THREE.WebGLRenderer();

const light1 = new THREE.PointLight(0xffffff, 100)
light1.position.set(2.5, 2.5, 2.5)
scene.add(light1)

const light2 = new THREE.PointLight(0xffffff, 100)
light2.position.set(-2.5, 2.5, 2.5)
scene.add(light2)

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.target.set(0, 0.3, -0.5);

let mixer: THREE.AnimationMixer
let modelReady = false
const animationActions: THREE.AnimationAction[] = []
let activeAction: THREE.AnimationAction
let lastAction: THREE.AnimationAction
const gltfLoader = new GLTFLoader()

gltfLoader.load( 
    'assets/3D/CMDA_animation.glb', 
    ( gltf ) => {
    
        mixer = new THREE.AnimationMixer(gltf.scene);
        let crankin = mixer.clipAction(getAnimation(gltf, "shaftAction"));
        crankin.loop = THREE.LoopRepeat;
        crankin.reset().play();
        const animationAction = mixer.clipAction((gltf).animations[0]);
        animationActions.push(animationAction);
        // animationsFolder.add(animations, 'default');
        activeAction = animationActions[0];
        console.log(activeAction);

        scene.add( gltf.scene );
    
        // gltf.animations; // Array<THREE.AnimationClip>
        // console.log((gltf).animations[0].name);
        // gltf.scene; // THREE.Group
        // gltf.scenes; // Array<THREE.Group>
        // gltf.cameras; // Array<THREE.Camera>
        // gltf.asset; //Object
        modelReady = true;
    },
    // called while loading is progressing
    (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
    },

    // called when loading has errors
    function ( error ) {
    
        console.log( 'An error happened' );
    
}); 

function getAnimation(gltf, name){
    var result;
    gltf.animations.forEach((animation) => {
        if (animation.name===name) {
            result = animation
            return
        }
    })
    if (result == null) {
        console.error("animation: "+name+" cannot be found!")
    }
    return result
}

window.addEventListener('resize', onWindowResize, false)
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    render()
}

// const stats = new Stats()
// document.body.appendChild(stats.dom)

renderer.setSize( window.innerWidth, window.innerHeight )
document.body.appendChild( renderer.domElement )

camera.position.z = 0;
camera.position.y = 0.7;

const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    if (modelReady) mixer.update(clock.getDelta());
	render();
    // stats.update();
}

function render() {
    renderer.render(scene, camera);
}

animate();