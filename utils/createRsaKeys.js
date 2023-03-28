const crypto = require('crypto');

const generateKeyPair = () => {
  return crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: {
      type: 'pkcs1',
      format: 'pem'
    },
    privateKeyEncoding: {
      type: 'pkcs1',
      format: 'pem',
    }
  })
}

module.exports = generateKeyPair;
