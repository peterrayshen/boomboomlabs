var poplutaionSize = 5;
var sequenceSize = 16;
var mutationRate = 0.03;

class Beat {

    // sequence property (array of 1s and 0s)
    // score property

    mutate(mutationRate) {
        for (var i = 0; i < this.sequence.length; i++) {
            if (Math.random() < mutationRate) {
                this.sequence[i] = 0 ? this.sequence[1] == 1 : 0;
            }
        }
    }
}

const generateRandomBeat = () => {
    beat = new Beat();
    beat.score = 1;
    beat.sequence = [];
    for (var i = 0; i < sequenceSize; i++) {
        var hitProbability = 0.35;
        if (Math.random() < hitProbability) {
            beat.sequence.push(1);
        }
        else {
            beat.sequence.push(0);
        }
    }
    return beat;
}

// population is an array of Beat
const newGeneration = () => {
    console.log("helloooo");
    var population = [];

    for (var i = 0; i < poplutaionSize; i++) {
        population.push(generateRandomBeat());
    }

    console.log(population);
    var matingPool = selection(population);
    newPoplution = generate(population, matingPool);
    console.log(newPoplution);
    return newPoplution;
}

// population is a list of beats
const selection = (population) => {
    var matingPool = [];
    population.forEach(element => {
        // for example, if beat 1 scores a 5/5, beat 1 is replicated 5 times in the mating pool
        for (var i = 0; i < element.score; i++) {
            matingPool.push(element)
        }
    });
    return matingPool;
}

const generate = (population, matingPool) => {
    var newPopulation = [];
    for (var i = 0; i < population.length; i++) {
        var a = getRandomInt(matingPool.length);
        var b = getRandomInt(matingPool.length);
        var parentA = matingPool[a];
        var parentB = matingPool[b];
        var child = crossover(parentA, parentB);
        child.mutate();
        newPopulation.push(child);
    }
    return newPopulation;
}

const crossover = (parentA, parentB) => {
    let child = new Beat();
    child.sequence = [];
    child.score = 1;
    for (var i = 0; i < parentA.sequence.length; i++) {
        // first half of sequence from parentA, second half from parentB
        if (i < parentA.sequence.length / 2) {
            child.sequence.push(parentA.sequence[i]);
        }
        else {
            child.sequence.push(parentB.sequence[i]);
        }
    }
    return child;
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

newGeneration();