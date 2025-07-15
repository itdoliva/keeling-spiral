import ParticlesController from '@/features/atmosphere-sample/ParticlesController';
import ParticlesVisualizer from '@/features/atmosphere-sample/ParticlesVisualizer';

export default class AtmosphereSample {
  private particlesController: ParticlesController
  private particlesVisualizer: ParticlesVisualizer

  constructor(ppmExtent: number[], ppmCurrent: number) {
    this.particlesController = new ParticlesController(ppmCurrent, ppmExtent[1])
    this.particlesVisualizer = new ParticlesVisualizer(ppmExtent[0], ppmExtent[1])
    this.particlesVisualizer.updateParticles(this.particlesController.particles)
  }

  public changeVisibleCount(value: number) {
    this.particlesController.setVisibleCount(value)
    this.particlesVisualizer.updateParticles(this.particlesController.particles)
  }

  public tick(elapsedTime: number) {
    this.particlesVisualizer.tick(elapsedTime)
  }

  public getObject() {
    return this.particlesVisualizer.getObject()
  }
}