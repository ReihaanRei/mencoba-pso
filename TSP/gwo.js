export class GrayWolf {
    constructor(numCities, fitnessFunction, distances) {
        this.distances = distances;
        this.fitnessFunction = fitnessFunction;

        // Generate a random route
        const route = [...Array(numCities).keys()].slice(1); // Exclude the first city
        this.position = [0, ...this.shuffle(route), 0]; // Start and end at city 0
        this.updateFitness();
    }

    updateFitness() {
        this.fitness = -this.fitnessFunction(this.position, this.distances); // Negative for minimization
    }

    shuffle(arr) {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

    swapMutation() {
        const i = Math.floor(Math.random() * (this.position.length - 2)) + 1;
        const j = Math.floor(Math.random() * (this.position.length - 2)) + 1;
        [this.position[i], this.position[j]] = [this.position[j], this.position[i]];
        this.updateFitness();
    }
}

export class GrayWolfOptimizer {
    constructor(numWolves, numCities, fitnessFunction, distances, maxIterations) {
        this.population = Array(numWolves)
            .fill(null)
            .map(() => new GrayWolf(numCities, fitnessFunction, distances));
        this.fitnessFunction = fitnessFunction;
        this.distances = distances;
        this.maxIterations = maxIterations;

        this.alpha = null;
        this.beta = null;
        this.delta = null;
        this.updateHierarchy();
    }

    updateHierarchy() {
        this.population.sort((a, b) => b.fitness - a.fitness); // Sort by fitness
        this.alpha = this.population[0];
        this.beta = this.population[1];
        this.delta = this.population[2];
    }

    updatePositions(iteration) {
        const a = 2 - (2 * iteration) / this.maxIterations; // Linearly decreasing factor

        this.population.forEach((wolf) => {
            if (wolf === this.alpha || wolf === this.beta || wolf === this.delta) return;

            // Introduce random mutation for better exploration
            wolf.swapMutation();
        });

        this.updateHierarchy();
    }
}

export function tspDistance(route, distances) {
    let totalDistance = 0;
    for (let i = 0; i < route.length - 1; i++) {
        totalDistance += distances[route[i]][route[i + 1]];
    }
    return totalDistance;
}
