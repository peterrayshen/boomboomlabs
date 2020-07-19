var poplutaionSize = 5;
var sequenceSize = 16;
var mutationRate = 0.03;

class Beat {

    // sequence property (array of 1s and 0s)
    // score property

    constructor(newBeat) {
        this.sequence = [];
        for (var i = 0; i < newBeat.data.length; i++) {
            this.sequence.push(parseInt(newBeat.data[i]))
        }
        this.rating = newBeat.rating;
    }

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
const newGeneration = (beats) => {
    var population = [];

    for (var i = 0; i < beats.length; i++) {
        population.push(new Beat(beats[i]));
    }

    var matingPool = selection(population);
    newPoplution = generate(population, matingPool);
    formatted = [];
    newPoplution.forEach(element => {
        formatted.push({data: element.sequence.join(""), rating: element.rating});
    })
    return formatted;
}

// population is a list of beats
const selection = (population) => {
    var matingPool = [];
    population.forEach(element => {
        // for example, if beat 1 scores a 5/5, beat 1 is replicated 5 times in the mating pool
        for (var i = 0; i < element.rating; i++) {
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
    newSequence = [];
    for (var i = 0; i < parentA.sequence.length; i++) {
        // first half of sequence from parentA, second half from parentB
        if (i < parentA.sequence.length / 2) {
            newSequence.push(parentA.sequence[i]);
        }
        else {
            newSequence.push(parentB.sequence[i]);
        }
    }
    let child = new Beat({data: newSequence, rating: 1});
    return child;
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

newPopulation = newGeneration([{
    data: '101010',
    rating: 4
    }, {
    data: '111010',
    rating: 1
    }]);

console.log(newPopulation); // eg. [{data: "101010", rating: 1}, {data: "101010", rating: 1}]