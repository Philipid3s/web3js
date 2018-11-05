const Tx = require('ethereumjs-tx');
const Web3 = require('web3');
const config = require ('config');

// https://infura.io
const ropsten = new Web3(config.ropsten.url);
const account = config.ropsten.account;
const secretkey = Buffer.from(config.ropsten.secretkey, 'hex');

// Step 1 : we create the contract
ropsten.eth.getTransactionCount(account, (err, txCount) => {

    // smart contract data
    // Simple Storage contract (https://solidity.readthedocs.io/en/v0.4.24/introduction-to-smart-contracts.html)
    const data = '0x608060405234801561001057600080fd5b5060df8061001f6000396000f3006080604052600436106049576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806360fe47b114604e5780636d4ce63c146078575b600080fd5b348015605957600080fd5b5060766004803603810190808035906020019092919050505060a0565b005b348015608357600080fd5b50608a60aa565b6040518082815260200191505060405180910390f35b8060008190555050565b600080549050905600a165627a7a72305820da297c3b137cbece15d18c1b3de71d7e61c0cf2af269a5aa391f568cab150d610029'; 
    
    // create transaction object
    const txObject = {
        nonce: ropsten.utils.toHex(txCount),
        gasLimit: ropsten.utils.toHex(1000000), // raise this if necessary
        gasPrice: ropsten.utils.toHex(ropsten.utils.toWei('10', 'gwei')),
        data: data
    };

    // sign transaction
    const tx = new Tx(txObject);
    tx.sign(secretkey);

    const serializedTx = tx.serialize();

    const raw = '0x' + serializedTx.toString('hex');

    // create a new smart contract transaction
    // https://ropsten.etherscan.io/address/0x59432936a731269Fa5564C67665740237240AD93
    //ropsten.eth.sendSignedTransaction(raw, (err, txHash) => {
    //    console.log('err:', err, ' txHash:', txHash);
    //});
});

// Step 2 : Get Contract informations
const contractAddress = '0x59432936a731269Fa5564C67665740237240AD93';
const contractABI = [{"constant":false,"inputs":[{"name":"x","type":"uint256"}],"name":"set","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"get","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"}];

const simpleStorageContract = new ropsten.eth.Contract(contractABI, contractAddress);

// Get current data value
simpleStorageContract.methods.get().call((err, output) => {
    if (!err)
    {
        console.log('Data:',output);
    } else {
        console.error(err.message);
    }
});

// Step 3 : call function - Create Transaction
ropsten.eth.getTransactionCount(account, (err, txCount) => {

    const data = simpleStorageContract.methods.set(100).encodeABI();

    // create transaction object
    const txObject = {
        nonce: ropsten.utils.toHex(txCount),
        gasLimit: ropsten.utils.toHex(1000000), // raise this if necessary
        gasPrice: ropsten.utils.toHex(ropsten.utils.toWei('10', 'gwei')),
        to: contractAddress,
        data: data
    };

    // sign transaction
    const tx = new Tx(txObject);
    tx.sign(secretkey);

    const serializedTx = tx.serialize();

    const raw = '0x' + serializedTx.toString('hex');

    // create a new smart contract transaction
    // https://ropsten.etherscan.io/address/0x59432936a731269Fa5564C67665740237240AD93
    //ropsten.eth.sendSignedTransaction(raw, (err, txHash) => {
    //    console.log('err:', err, ' txHash:', txHash);
    //});
});

// Ganache (Dev/Local Blockchain implementation)
// https://truffleframework.com/ganache
const url2 = config.ganache.url;
const account1 = config.ganache.account1;
const account2 = config.ganache.account2;

const ganache = new Web3(url2);

// Get Balance 
ganache.eth.getBalance(account1, (err, balance) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log(ganache.utils.fromWei(balance, 'ether'));
    }
});

// Transfer 1 ETH from account1 to account2
ganache.eth.sendTransaction({ from: account1, to: account2, value: ganache.utils.toWei('1', 'ether')})
    .then(console.log('transaction done !'));

// Smart contract
// ... code of the smart contract: https://etherscan.io/address/0x8dd5fbce2f6a956c3022ba3663759011dd51e73e#code
// ... Contract ABI (json interface)
// const abi = [{...}]
// const contractaddress = [address of the smart contract]
// const contract = new web3.eth.Contract(abi, contractaddress)
// contract.methods (list of functions of this contract)