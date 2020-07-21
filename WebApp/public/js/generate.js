// GENETIC ALGORITHM
// Data Structure ––> [ {data: BinaryString[], rating: Number } ]

const populationSize = 5;
const sequenceSize = 16;
const mutationRate = 0.03;

class Beat {
    // this.sequence: Binary array representing beat sequence.
    // this.rating: Rating associated with beat.

    constructor(newBeat) {
        this.sequence = [];
        for (var i = 0; i < newBeat.data.length; i++) {
            this.sequence.push(parseInt(newBeat.data[i]))
        }
        this.rating = newBeat.rating;
    }

    mutate(mutationRate) {
        for (let i = 0; i < sequenceSize; i++) {
            if (Math.random() < mutationRate) {
                this.sequence[i] = (this.sequence[i] == 0) ? 1 : 0;
            }
        }
    }
}

export function generateRandomBeats() {
    const hitProbability = 0.35;
    let beats = [];
    let unit, newSequence;
    for (let i = 0; i < populationSize; i++) {
        newSequence = [];
        for (let j = 0; j < sequenceSize; j++) {
            unit = (Math.random() < hitProbability) ? 1 : 0;
            newSequence.push(unit);
        }
        beats.push({data: newSequence.join(''), rating: 1});
    }
    return beats;
}

export function newGeneration(beats) {
    const population = beats.map(beat => new Beat(beat)); // Array of beat instantiations.
    const matingPool = selection(population); // Scaled version of population proportional to rating.
    const newPopulation = generate(population, matingPool);
    
    // Returns a re-formatted set.
    return newPopulation.map(beat => (
        {data: beat.sequence.join(''), rating: beat.rating}
    ));
}

const selection = (population) => {
    let matingPool = [];
    population.forEach(beat => {
        // for example, if beat 1 scores a 5/5, beat 1 is replicated 5 times in the mating pool
        for (let i = 0; i < beat.rating; i++) {
            matingPool.push(beat)
        }
    });
    return matingPool;
}

const generate = (population, matingPool) => {
    let newPopulation = []; 
    let a, b, parentA, parentB, child;
    for (let i = 0; i < population.length; i++) {
        a = getRandomInt(matingPool.length);
        b = getRandomInt(matingPool.length);
        parentA = matingPool[a];
        parentB = matingPool[b];
        child = crossover(parentA, parentB); // Mandatory cross-over operation.
        child.mutate(mutationRate);
        newPopulation.push(child);
    }
    return newPopulation;
}

const crossover = (parentA, parentB) => {
    let newSequence = [], locus;
    const crossoverPosition = getRandomInt(sequenceSize - 1);

    for (let i = 0; i < sequenceSize; i++) {
        locus = (i <= crossoverPosition) ? parentA.sequence[i] : parentB.sequence[i];
        newSequence.push(locus);
    }

    let child = new Beat({data: newSequence, rating: 1});
    return child;
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}