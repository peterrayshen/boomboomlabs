// GENETIC ALGORITHM
// Data Structure ––> [ {data: BinaryString[], rating: Number } ]

const populationSize = 5;
const sequenceSize = 16;
const mutationRate = 0.02;

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

export function newGeneration(beats, style, soundName) {
    const population = beats.map(beat => new Beat(beat)); // Array of beat instantiations.
    let matingPool = [];

    if (arguments.length > 1) {
        let target = styleMap[style][soundName].split('').map(Number);
        matingPool = selectionViaStyle(population, target);
    } else {
        matingPool = selectionViaRating(population);
    }

    const newPopulation = generate(population, matingPool);
    
    // Returns a re-formatted set.
    return newPopulation.map(beat => (
        {data: beat.sequence.join(''), rating: beat.rating}
    ));
}

const selectionViaRating = (population) => {
    let matingPool = [];
    population.forEach(beat => {
        // for example, if beat 1 scores a 5/5, beat 1 is replicated 5 times in the mating pool
        for (let i = 0; i < beat.rating; i++) {
            matingPool.push(beat);
        }
    });
    return matingPool;
}

const selectionViaStyle = (population, target) => {
    let matingPool = [];

    population.forEach(beat => {
        if (target) {
            let count = 0;
            for (let j = 0; j < target.length; j++) {
                if (beat.sequence[j] === target[j]) count++;
            }
            let percentage = count/target.length;
            let score = 0;
            
            if (0 <= percentage && percentage  < 0.2) {
                score = 1;
            } else if (0.2 <= percentage && percentage < 0.4) {
                score = 2;
            } else if (0.4 <= percentage && percentage < 0.6) {
                score = 3;
            } else if (0.6 <= percentage && percentage < 0.8) {
                score = 4;
            } else if (0.8 <= percentage && percentage <= 1) {
                score = 5;
            }

            for (let k = 0; k < score; k++) {
                matingPool.push(beat);
            }
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

const styleMap = {
    'hiphop': {
        'hh': '1010101110001010',
        'hho': '0000000000100000',
        'kick': '1000000110000010',
        'snare': '0000100000001000'
    },
    'edm': {
        'hh': '0000000001000000',
        'hho': '0010001000100010',
        'kick': '1000100010001000',
        'snare': '0000100000001000'
    },
    'rock': {
        'hh': '1010101010101010',
        'hho': '0000000000000000',
        'kick': '1010001010100010',
        'snare': '0000100000001000'
    }
}