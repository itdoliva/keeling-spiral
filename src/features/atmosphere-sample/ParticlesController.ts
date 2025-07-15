import Particle from "@/features/atmosphere-sample/Particle";
import { Binary } from "@/types/general";


export default class ParticlesController {
  public particles: Particle[]
  private visibleCount: number

  constructor(visibleCount: number, maxParticles: number) {
    this.particles = []
    this.visibleCount = 0

    for (let i = 0; i < maxParticles; i++) {
      const visible = +(i >= visibleCount) as Binary
      this.particles.push(new Particle(i, visible))
    }

    this.setVisibleCount(visibleCount)
  }

  public setVisibleCount(newVisibleCount: number) {
    // Enter nodes
    if (newVisibleCount > this.visibleCount) {
      for (let i = this.visibleCount; i < newVisibleCount; i++) {
        this.particles[i].visibility = 1
        this.visibleCount++
      }
    }

    // Exit nodes
    if (newVisibleCount < this.visibleCount) {
      for (let i = this.visibleCount - 1; i > newVisibleCount; i--) {
        this.particles[i].visibility = 0
        this.visibleCount--
      }
    }

    return this
  }
  
}