const bcrypt = require('bcrypt');

const createHash = async password => {
  try {
    const salt = await bcrypt.genSalt(8);
    const hash = await bcrypt.hash(password, salt);
    return Promise.resolve(hash);
  } catch (e) {
    return Promise.resolve(null);
  }
};

const isPasswordsEqual = async (hash, passwordToCheck) => {
  try {
    return await bcrypt.compare(passwordToCheck, hash);
  } catch (e) {
    return Promise.resolve(null);
  }
};

module.exports = {
  createHash,
  isPasswordsEqual
};
