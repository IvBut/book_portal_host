const { SECRET_KEY_TYPE } = require('../constants/enums');
const credentials = require('../config/credentials');
const jsonwebtoken = require('jsonwebtoken');

const { ACCESS_PRIVATE_KEY, ACCESS_PUBLIC_KEY, REFRESH_PRIVATE_KEY, REFRESH_PUBLIC_KEY } =
  credentials;

const signJwt = (payload, secretKeyType, options = {}) => {
  const secretKey =
    secretKeyType === SECRET_KEY_TYPE.REFRESH ? REFRESH_PRIVATE_KEY : ACCESS_PRIVATE_KEY;
  return jsonwebtoken.sign(payload, secretKey, {
    ...options,
    algorithm: 'RS256'
  });
};

const verifyJwt = (token, publicKeyType) => {
  const publicKey =
    publicKeyType === SECRET_KEY_TYPE.REFRESH ? REFRESH_PUBLIC_KEY : ACCESS_PUBLIC_KEY;
  try {
    return jsonwebtoken.verify(token, publicKey);
  } catch (e) {
    return null;
  }
};

module.exports = {
  signJwt,
  verifyJwt
};
