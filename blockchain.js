const SHA256 = require("crypto-js/sha256");

class Block {
    constructor(index, timestamp, data, previousHash = '') {
        this.index = index;
        this.previousHash = previousHash;
        this.timestamp = timestamp;
        this.data = data;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash() {
        return SHA256(this.index + 
            this.previousHash + 
            this.timestamp + 
            JSON.stringify(this.data) +
            this.nonce
        ).toString();
    }

    mineBlock(difficulty) {
        while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log("BLOCK MINED: " + this.hash);
    }
}

class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 5;
    }

    createGenesisBlock() {
        return new Block(0, "01/01/2018", "Genesis Block", "0");
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    addBlock(newBlock) {
        newBlock.previousHash = this.getLatestBlock().hash;
        // newBlock.hash = newBlock.calculateHash();
        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);
    }

    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            // console.log("currentBlock.hash " + currentBlock.hash);
            // console.log("currentBlock.calculateHash " + currentBlock.calculateHash());
            if(currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }

            // console.log("currentBlock.previousHash " + currentBlock.hash);
            // console.log("previousBlock.hash " + currentBlock.calculateHash());
            if(currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }
        return true;
    }
}

let atrChain = new Blockchain();

console.log('Mining block 1');
atrChain.addBlock(new Block(1, "27/01/2018", { amount: 4}));

console.log('Mining block 2');
atrChain.addBlock(new Block(2, "27/01/2018", { amount: 8}));

// Check if chain is valid (will return true)
console.log('Blockchain valid? ' + atrChain.isChainValid());

// Let's now manipulate the data
console.log('Changing a block...');
atrChain.chain[1].data = { amount: 100 };

// Check our chain again (will now return false)
console.log('Blockchain valid? ' + atrChain.isChainValid());

console.log(JSON.stringify(atrChain, null, 4));