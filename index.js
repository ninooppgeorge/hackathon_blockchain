const express = require('express');
const SHA256 = require('sha256');
const bodyParser = require('body-parser');

const app = express()
const port = 8000

app.use(bodyParser());

class Block {
    constructor(timestamp, data) {
        this.index = 0;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = "0";
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash() {
        return SHA256(this.index + this.previousHash + this.timestamp + this.data + this.nonce).toString();
    }

    mineBlock(difficulty) {

    }
}

class Blockchain{
    constructor() {
        this.chain = [this.createGenesis()];
    }

    createGenesis() {
        return new Block(0, "01/01/2017", "Genesis block", "0")
    }

    latestBlock() {
        return this.chain[this.chain.length - 1]
    }

    addBlock(newBlock){
        newBlock.previousHash = this.latestBlock().hash;
        newBlock.hash = newBlock.calculateHash();
        this.chain.push(newBlock);
    }

    checkValid() {
        for(let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];
            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }
            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }
        return true;
    }
}

let userChain = new Blockchain();
let transChain = new Blockchain();

app.post('/user/add', (req, res) =>{
    let data = req.body;
    userChain.addBlock(new Block(new Date(), data));
    res.send(userChain);
});

app.get('/user/list', (req, res) =>{
    res.send(userChain);
});


app.post('/trans/add', (req, res) =>{
    let data = req.body;
    transChain.addBlock(new Block(new Date(), data));
    res.send(transChain);
});

app.get('/trans/list', (req, res) =>{
    res.send(transChain);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))