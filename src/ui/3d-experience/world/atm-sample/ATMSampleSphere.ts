import * as THREE from 'three'
import { ATMSampleConfig } from '@/lib/config/atmSample';
import ATMParticlesController from './ATMParticlesController';
import clock from '@/lib/clock';
import atmosphereSampleVertexShader from '@/lib/shaders/atmSample/vertex.glsl'
import atmosphereSampleFragmentShader from '@/lib/shaders/atmSample/fragment.glsl'


const SPHERE_GEOMETRY = new THREE.SphereGeometry(ATMSampleConfig.radius + .05, 32, 32)
const SPHERE_MATERIAL = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  metalness: 1,
  roughness: .05,
  transparent: true,
  opacity: .3
})

export default class ATMSampleSphere {
  public object: THREE.Group
  public points: THREE.Points<THREE.BufferGeometry, THREE.ShaderMaterial>
  public bubble: THREE.Mesh<THREE.SphereGeometry, THREE.MeshStandardMaterial> | THREE.Mesh<THREE.CapsuleGeometry, THREE.MeshStandardMaterial>
  private geometry: THREE.BufferGeometry
  private material: THREE.ShaderMaterial

  private _ppmExtent: number[]
  private _ppmCurrent: number

  private particles: ATMParticlesController

  constructor(ppmExtent: number[], ppmCurrent: number) {
    this._ppmExtent = ppmExtent.map(d => Math.ceil(d))
    this._ppmCurrent = Math.ceil(ppmCurrent)

    this.object = new THREE.Group()
    // this.bubble = new THREE.Mesh(SPHERE_GEOMETRY, SPHERE_MATERIAL)
    this.bubble = new THREE.Mesh(
      new THREE.CapsuleGeometry(ATMSampleConfig.radius + .05, ATMSampleConfig.height, 12, 32, 32),
      SPHERE_MATERIAL
    )
    
    this.particles = new ATMParticlesController(this._ppmExtent[1], this._ppmCurrent)

    this.geometry = new THREE.BufferGeometry()
    this.material = new THREE.ShaderMaterial({
      depthWrite: false,
      blending: THREE.NormalBlending, 
      vertexShader: atmosphereSampleVertexShader,
      fragmentShader: atmosphereSampleFragmentShader,
      uniforms: {
        uBaseCount: { value: 0 },
        uSize: { value: 0 },
        uTime: { value: 0 },
        uAnimation: { value: 0 }
      }
    })

    this.points = new THREE.Points(this.geometry, this.material)

    this.setGeometryAttributes()
    this.updateGeometryAttributes()

    this.points.material.uniforms.uBaseCount.value = this._ppmExtent[0]

    this.object.add(this.bubble, this.points)
  }

  get ppmExtent() { 
    return this._ppmExtent 
  }

  get ppmCurrent() { 
    return this._ppmCurrent 
  }

  set ppmExtent(extent: number[]) {
    this._ppmExtent = extent.map(d => Math.ceil(d))
    this.particles = new ATMParticlesController(extent[1], this.ppmCurrent)
    this.setGeometryAttributes()
    this.updateGeometryAttributes()
    this.points.material.uniforms.uBaseCount.value = this._ppmExtent[0]
  }

  set ppmCurrent(current: number) {
    current = Math.ceil(current)
    this._ppmCurrent = current
    this.particles.setVisibleCount(current)
    this.updateGeometryAttributes()
  }

  private setGeometryAttributes() {
    const [ _, MAX_NODES ] = this._ppmExtent

    if (this.geometry.hasAttribute('position')) {
      this.geometry.deleteAttribute('position')
      this.geometry.deleteAttribute('aIndex')
      this.geometry.deleteAttribute('aRandomness')
      this.geometry.deleteAttribute('aVisibility')
      this.geometry.deleteAttribute('aLifetimeStart')
    }

    const positions = new Float32Array(MAX_NODES * 3)
    const index = new Float32Array(MAX_NODES)
    const randomness = new Float32Array(MAX_NODES)
    const visibility = new Float32Array(MAX_NODES)
    const lifetimeStart = new Float32Array(MAX_NODES)

    for (let i = 0; i < this.particles.data.length; i++) {
      const idx = i * 3
      const particle = this.particles.data[i]

      index[i] = particle.idx
      randomness[i] = particle.randomness
      
      positions[idx    ] = particle.position.x
      positions[idx + 1] = particle.position.y
      positions[idx + 2] = particle.position.z
    }

    this.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    this.geometry.setAttribute('aIndex', new THREE.BufferAttribute(index, 1))
    this.geometry.setAttribute('aRandomness', new THREE.BufferAttribute(randomness, 1))
    this.geometry.setAttribute('aVisibility', new THREE.BufferAttribute(visibility, 1))
    this.geometry.setAttribute('aLifetimeStart', new THREE.BufferAttribute(lifetimeStart, 1))
  }

  private updateGeometryAttributes() {
    const attrVisibility = this.geometry.getAttribute('aVisibility') as THREE.BufferAttribute
    const attrLifetimeStart = this.geometry.getAttribute('aLifetimeStart') as THREE.BufferAttribute
    
    for (let i = 0; i < this.particles.data.length; i++) {
      const point = this.particles.data[i]
      attrVisibility.setX(i, point.visibility)
      attrLifetimeStart.setX(i, point.lifetimeStart)
    }

    // Mark attributes as needing update
    attrVisibility.needsUpdate = true;
    attrLifetimeStart.needsUpdate = true;
  }

  public update() {
    const elapsedTime = clock.getElapsedTime()

    // this.object.rotation.x = Math.sin(elapsedTime * .1)
    this.object.rotation.y = elapsedTime * .05 * Math.PI
    // this.object.rotation.z = Math.cos(elapsedTime * .1)

    if (this.points instanceof THREE.Points) {
      this.points.material.uniforms.uTime.value = elapsedTime
    }
  }


}