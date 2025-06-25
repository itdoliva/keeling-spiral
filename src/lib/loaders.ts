import * as THREE from 'three';
import { RGBELoader } from 'three/examples/jsm/Addons.js';

const manager = new THREE.LoadingManager(); // Optional: externalize for global tracking

export const rgbeLoader = new RGBELoader(manager);