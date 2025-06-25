import ATMParticle from "./ATMParticle";

export default class ATMParticlesController {
  public data: ATMParticle[] = []
  private visibleCount = 0

  constructor(maxParticles: number, visibleCount: number) {
    // Populate
    for (let i=0; i < maxParticles; i++) {
      const visibility = i < visibleCount
      const particle = new ATMParticle(i, +visibility)
      this.data.push(particle)

      this.visibleCount += +visibility
    }

    return this
  }

  public setVisibleCount(newVisibleCount: number) {
    if (newVisibleCount > this.visibleCount) {
      console.log('Greater than before')
      for (let i = this.visibleCount; i < newVisibleCount; i++) {
        this.data[i].visibility = 1
        this.visibleCount++
      }
    }
    else if (newVisibleCount < this.visibleCount) {
      console.log('Smaller than before')
      for (let i = this.visibleCount - 1; i > newVisibleCount; i--) {
        this.data[i].visibility = 0
        this.visibleCount--
      }
    }

    console.log(newVisibleCount, this.visibleCount)

    return this
  }
  
}