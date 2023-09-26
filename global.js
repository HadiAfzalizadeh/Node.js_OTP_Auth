const NodeCache = require('node-cache');

const verificationCache = new NodeCache();

module.exports = { verificationCache };
