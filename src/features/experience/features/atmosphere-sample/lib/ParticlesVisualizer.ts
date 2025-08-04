import * as THREE from 'three';
import { AtmSampleConfig } from "@/config/three";
import Particle from '@/features/experience/features/atmosphere-sample/lib/Particle';
import atmosphereSampleFragmentShader from '@/experience/features/atmosphere-sample/shaders/fragment.glsl';
import atmosphereSampleVertexShader from '@/experience/features/atmosphere-sample/shaders/vertex.glsl';

const SPHERE_MATERIAL = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  metalness: 1,
  roughness: .05,
  transparent: true,
  opacity: .3
})

export default class ParticlesVisualizer {
  private object: THREE.Group
  private wrapper: THREE.Mesh<THREE.SphereGeometry, THREE.MeshStandardMaterial> | THREE.Mesh<THREE.CapsuleGeometry, THREE.MeshStandardMaterial>
  private points: THREE.Points<THREE.BufferGeometry, THREE.ShaderMaterial>;
  private pointsGeometry: THREE.BufferGeometry;
  private pointsMaterial: THREE.ShaderMaterial;

  constructor(baseCount: number, maxParticles: number) {
    this.object = new THREE.Group()
    this.wrapper = new THREE.Mesh(
      new THREE.CapsuleGeometry(AtmSampleConfig.radius + .05, AtmSampleConfig.height, 12, 32, 32),
      SPHERE_MATERIAL
    )

    this.pointsGeometry = new THREE.BufferGeometry();
    this.pointsMaterial = new THREE.ShaderMaterial({
      depthWrite: false,
      blending: THREE.NormalBlending,
      vertexShader: atmosphereSampleVertexShader,
      fragmentShader: atmosphereSampleFragmentShader,
      uniforms: {
        uBaseCount: { value: baseCount },
        uSize: { value: 0 },
        uTime: { value: 0 },
        uAnimation: { value: 0 }
      }
    });

    this.points = new THREE.Points(this.pointsGeometry, this.pointsMaterial)
    this.initAttributes(maxParticles)

    this.object.add(this.wrapper, this.object)
  }

  private initAttributes(maxParticles: number) {
    // Only set these once if maxParticles is truly static for this instance
    const positions = new Float32Array(maxParticles * 3);
    const index = new Float32Array(maxParticles);
    const randomness = new Float32Array(maxParticles);
    const visibility = new Float32Array(maxParticles);
    const lifetimeStart = new Float32Array(maxParticles);

    this.pointsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this.pointsGeometry.setAttribute('aIndex', new THREE.BufferAttribute(index, 1));
    this.pointsGeometry.setAttribute('aRandomness', new THREE.BufferAttribute(randomness, 1));
    this.pointsGeometry.setAttribute('aVisibility', new THREE.BufferAttribute(visibility, 1));
    this.pointsGeometry.setAttribute('aLifetimeStart', new THREE.BufferAttribute(lifetimeStart, 1));
  }

  public updateParticles(particles: Particle[]): void {
    const attrPosition = this.pointsGeometry.getAttribute('position') as THREE.BufferAttribute;
    const attrIndex = this.pointsGeometry.getAttribute('aIndex') as THREE.BufferAttribute;
    const attrRandomness = this.pointsGeometry.getAttribute('aRandomness') as THREE.BufferAttribute;
    const attrVisibility = this.pointsGeometry.getAttribute('aVisibility') as THREE.BufferAttribute;
    const attrLifetimeStart = this.pointsGeometry.getAttribute('aLifetimeStart') as THREE.BufferAttribute;

    for (let i = 0; i < particles.length; i++) {
      const particle = particles[i];

      attrPosition.setXYZ(i, particle.position.x, particle.position.y, particle.position.z);
      attrIndex.setX(i, particle.idx);
      attrRandomness.setX(i, particle.randomness);
      attrVisibility.setX(i, particle.visibility);
      attrLifetimeStart.setX(i, particle.lifetimeStart);
    }

    attrPosition.needsUpdate = true;
    attrIndex.needsUpdate = true;
    attrRandomness.needsUpdate = true;
    attrVisibility.needsUpdate = true;
    attrLifetimeStart.needsUpdate = true;
  }

  public updateBaseCount(value: number) {
    if (this.pointsMaterial) {
      this.pointsMaterial.uniforms.uBaseCount.value = value;
    }
  }

  public tick(elapsedTime: number) {
    this.object.rotation.y = elapsedTime * .05 * Math.PI
    this.pointsMaterial.uniforms.uTime.value = elapsedTime
  }

  public getObject() {
    return this.object;
  }

  public dispose() {
    this.pointsGeometry.dispose();
    this.pointsMaterial.dispose();
    (this.pointsGeometry as any) = null;
    (this.pointsMaterial as any) = null;
    (this.points as any) = null;
  }
}
