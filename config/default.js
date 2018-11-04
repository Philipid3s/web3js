const pkg = require('../package');

module.exports = {
    app: {
        name: pkg.name,
        version: pkg.version,
        env: process.env.NODE_ENV || 'development'
    },
    ganache: {
        url: 'HTTP://127.0.0.1:7545',
        account1:  '',
        account2: '',
    },
    infura: {
        url: '',
        account: '',
        secretkey: process.env.PRIVATE_KEY,
    }
};