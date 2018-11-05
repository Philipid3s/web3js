const Web3 = require('web3');
const config = require ('config');
const web3 = new Web3(config.mainnet.url);

// returns the latest block number
web3.eth.getBlockNumber().then(console.log);

// retrieve last block info
web3.eth.getBlock('latest').then( (block) => {
    console.log(block.hash);
});

web3.eth.getBlockNumber().then((latest) => {
    for (let i = 0; i < 10; i++) {
        web3.eth.getBlock(latest - i).then((block) => {
            console.log('block', i, ':',block.number);
        });
    };
});