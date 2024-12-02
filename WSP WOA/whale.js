export class Whale {
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

export class WhaleOptimizer {
    constructor(numWhales, numCities, fitnessFunction, distances, maxIterations) {
        this.population = Array(numWhales)
            .fill(null)
            .map(() => new Whale(numCities, fitnessFunction, distances));
        this.fitnessFunction = fitnessFunction;
        this.distances = distances;
        this.maxIterations = maxIterations;

        this.bestWhale = null;
        this.updateBestWhale();
    }

    updateBestWhale() {
        this.population.sort((a, b) => b.fitness - a.fitness); // Sort by fitness
        this.bestWhale = this.population[0];
    }

    updatePositions(iteration) {
        const a = 2 - (2 * iteration) / this.maxIterations; // Linearly decreasing factor

        this.population.forEach((whale) => {
            const b = 2 * Math.random() - 1; // Random scalar for spiral movement
            const l = Math.random() - 0.5; // Coefficient for spiral
            const p = Math.random(); // Exploration or exploitation probability

            if (p < 0.5) {
                // Exploitation
                const d = whale.position.map(
                    (v, i) => this.bestWhale.position[i] - v
                );
                whale.position = whale.position.map(
                    (v, i) => v + a * d[i] * Math.exp(b * l)
                );
            } else {
                // Exploration via mutation
                whale.swapMutation();
            }
            whale.updateFitness();
        });

        this.updateBestWhale();
    }
}

export function tspDistance(route, distances) {
    let totalDistance = 0;
    for (let i = 0; i < route.length - 1; i++) {
        totalDistance += distances[route[i]][route[i + 1]];
    }
    totalDistance += distances[route[route.length - 1]][route[0]]; // Return to start
    return totalDistance;
}
