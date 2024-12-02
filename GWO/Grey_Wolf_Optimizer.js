export class GreyWolf {
    constructor(dimensions, fitnessFunction) {
        this.position = Array(dimensions).fill(0).map(() => Math.random() * 20);
        this.fitnessFunction = fitnessFunction;
        this.updateFitness();
    }

    updateFitness() {
        this.fitness = this.fitnessFunction(...this.position);
    }

    moveTowards(targetPosition, a, c) {
        this.position = this.position.map((pos, i) => {
            return pos + a * (targetPosition[i] - pos) + c * (Math.random() - 0.5);
        });
        this.updateFitness();
    }
}

export class GreyWolfOptimizer {
    constructor(numWolves, dimensions, fitnessFunction, lowerBounds, upperBounds, maxIterations) {
        this.population = Array(numWolves).fill(null).map(() => new GreyWolf(dimensions, fitnessFunction));
        this.dimensions = dimensions;
        this.fitnessFunction = fitnessFunction;
        this.lowerBounds = lowerBounds;
        this.upperBounds = upperBounds;
        this.maxIterations = maxIterations;
        this.alpha = this.population[0];
        this.beta = this.population[1];
        this.delta = this.population[2];
        this.updateRoles();
    }

    updateRoles() {
        const sortedWolves = this.population.sort((a, b) => b.fitness - a.fitness);
        this.alpha = sortedWolves[0];
        this.beta = sortedWolves[1];
        this.delta = sortedWolves[2];
    }

    updateWolves(iteration) {
        const a = 2 - 2 * iteration / this.maxIterations; // Decreases over iterations
        this.population.forEach(wolf => {
            const r1 = Math.random(); // Random vector
            const r2 = Math.random();
            const c = 2 * r2; // Scaling factor for position update

            wolf.moveTowards(this.alpha.position, a, c);
            if (wolf.fitness > this.beta.fitness) {
                this.beta = wolf;
            }
            if (wolf.fitness > this.delta.fitness) {
                this.delta = wolf;
            }
        });
        this.updateRoles();
    }

    optimize() {
        for (let i = 0; i < this.maxIterations; i++) {
            this.updateWolves(i);
        }
        return this.alpha; // Return the best solution
    }
}