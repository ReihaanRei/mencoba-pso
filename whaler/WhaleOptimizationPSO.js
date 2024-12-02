import { maxProfit } from './maxProfit.js';

class WhaleParticle {
    constructor(dimensions) {
        this.dimensions = dimensions;
        this.position = Array(dimensions).fill(0).map(() => Math.random() * 10 - 5); 
        this.velocity = Array(dimensions).fill(0);
        this.personalBestPosition = [...this.position];
        this.personalBestFitness = -Infinity; 
        this.fitness = -Infinity;
    }

    evaluateFitness() {
        this.fitness = maxProfit(...this.position); 
        if (this.fitness > this.personalBestFitness) {
            this.personalBestFitness = this.fitness;
            this.personalBestPosition = [...this.position];
        }
    }

    updatePosition(globalBestPosition, a, c, b = 1, l = Math.random()) {
        const p = Math.random();
        for (let i = 0; i < this.dimensions; i++) {
            if (p < 0.5) {
                const distToLeader = Math.abs(c * globalBestPosition[i] - this.position[i]);
                if (Math.abs(a) >= 1) {
                    this.position[i] = globalBestPosition[i] - a * distToLeader;
                } else {
                    this.position[i] = distToLeader * Math.exp(b * l) * Math.cos(l * 2 * Math.PI) + globalBestPosition[i];
                }
            } else {
                const r1 = Math.random();
                const r2 = Math.random();
                this.velocity[i] = 0.7 * this.velocity[i] + r1 * (this.personalBestPosition[i] - this.position[i]) + r2 * (globalBestPosition[i] - this.position[i]);
                this.position[i] += this.velocity[i];
            }

            this.position[i] = Math.abs(Math.round(this.position[i])); 
        }
    }
}

class WhaleOptimizationPSO {
    constructor(particleCount, dimensions, iterations) {
        this.particles = Array.from({ length: particleCount }, () => new WhaleParticle(dimensions));
        this.globalBestPosition = Array(dimensions).fill(0);
        this.globalBestFitness = -Infinity;
        this.iterations = iterations;
        this.currentIteration = 0;
    }

    optimizeStep() {
        const a = 2 * Math.abs(1 - this.currentIteration / this.iterations); 
        const c = 2 * Math.random();

        this.particles.forEach(particle => {
            particle.evaluateFitness();
            if (particle.fitness > this.globalBestFitness) {
                this.globalBestFitness = particle.fitness;
                this.globalBestPosition = [...particle.position];
            }
        });

        this.particles.forEach(particle => {
            particle.updatePosition(this.globalBestPosition, a, c);
        });

        this.currentIteration += 1;
    }
}

export { WhaleOptimizationPSO };
