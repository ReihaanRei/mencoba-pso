export class Gazelle {
    constructor(dimensions, fitnessFunction) {
        this.position = Array(dimensions).fill(0).map(() => Math.random() * 20);  // Random initial position
        this.fitnessFunction = fitnessFunction;
        this.updateFitness();
    }

    // Mengupdate nilai fitness berdasarkan posisi
    updateFitness() {
        this.fitness = this.fitnessFunction(...this.position);
    }

    // Pergerakan berdasarkan prinsip MGO: eksplorasi dan eksploitasinya
    move(bestGazelle, bounds, iteration, maxIterations) {
        const distanceToBest = bestGazelle.position.map((pos, i) => pos - this.position[i]);
        const r1 = Math.random();
        const r2 = Math.random();

        // Eksplorasi: Lompatan besar ke posisi baru
        const jumpFactor = 2 * r1 * (1 - iteration / maxIterations);
        this.position = this.position.map((pos, i) => pos + jumpFactor * distanceToBest[i]);

        // Eksploitasi: Pergerakan kecil menuju posisi terbaik
        const exploitationFactor = 0.5 * r2 * (Math.random() - 0.5);
        this.position = this.position.map((pos, i) => pos + exploitationFactor);

        // Pembatasan posisi agar tetap dalam batas
        this.position = this.position.map((pos, i) => Math.max(0, Math.min(bounds[i], pos)));
        
        this.updateFitness();
    }
}

export class MountainGazelleOptimizer {
    constructor(numGazelles, dimensions, fitnessFunction, lowerBounds, upperBounds, maxIterations) {
        this.population = Array(numGazelles).fill(null).map(() => new Gazelle(dimensions, fitnessFunction));
        this.gazelles = Array(numGazelles).fill(null).map(() => new Gazelle(dimensions, fitnessFunction));
        this.dimensions = dimensions;
        this.fitnessFunction = fitnessFunction;
        this.lowerBounds = lowerBounds;
        this.upperBounds = upperBounds;
        this.maxIterations = maxIterations;
        this.bestGazelle = this.gazelles[0];
        this.updateBestGazelle();
    }

    // Update gazelle terbaik
    updateBestGazelle() {
        this.bestGazelle = this.gazelles.reduce((best, gazelle) => 
            (gazelle.fitness > best.fitness) ? gazelle : best, this.gazelles[0]
        );
    }

    // Perbarui semua gazelle setiap iterasi
    updateGazelles(iteration) {
        this.population.forEach(gazelle => {
            gazelle.move(this.bestGazelle, this.upperBounds, iteration, this.maxIterations);
        });
        this.updateBestGazelle();
    }

    // Optimasi
    optimize() {
        for (let i = 0; i < this.maxIterations; i++) {
            this.updateGazelles(i);
        }
        return this.bestGazelle;
    }
}

