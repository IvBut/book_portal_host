const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');
const generate = require('../utils/createRsaKeys');
const parsedConfig = dotenv.config()?.parsed ?? null;

const CONFIG_MAP = {
  DB_NAME: {},
  DB_USER: {},
  DB_PASSWORD: {},
  DB_HOST: {
    default: () => 'localhost'
  },
  DB_PORT: {
    default: () => 5432,
    convert: val => Number.parseFloat(val)
  },
  API_PORT: {
    default: () => 8080,
    convert: val => Number.parseFloat(val)
  },
  CLIENT_HOST: {
    default: () => 'http://localhost:3000',
  },
  REFRESH_COOKIE_NAME: {
    default: () => 'refreshToken',
  }
};

const getSanitizedConfig = config => {
  if (!config) throw new Error('Create .env file in root and fill credentials!');
  const result = {};
  for (const [key, value] of Object.entries(CONFIG_MAP)) {
    const parsedItemValue = parsedConfig[key];
    if (!parsedItemValue && !value?.default) {
      throw new Error(`Fill ${key} in .env`);
    }
    let val = parsedItemValue || value.default();
    result[key] = value?.convert ? value.convert(val) : val;
  }
  return result;
};

const saveKeys = () => {
  const dirPath = path.join(__dirname, '../keys');
  const config = [
    {
      name: 'accessToken',
      filePaths: [
        {
          isPrivate: true,
          path: path.join(dirPath, '/access_private_key.pem')
        },
        { isPrivate: false, path: path.join(dirPath, '/access_public_key.pem') }
      ]
    },
    {
      name: 'refreshToken',
      filePaths: [
        {
          isPrivate: true,
          path: path.join(dirPath, '/refresh_private_key.pem')
        },
        {
          isPrivate: false,
          path: path.join(dirPath, '/refresh_public_key.pem')
        }
      ]
    }
  ];
  const result = {};
  try {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath);
    }
    for (const conf of config) {
      if (conf.filePaths.some(el => !fs.existsSync(el.path))) {
        result[conf.name] = generate();
        conf.filePaths.forEach(path => {
          fs.writeFileSync(
            path.path,
            path.isPrivate ? result[conf.name].privateKey : result[conf.name].publicKey
          );
        });
      } else {
        result[conf.name] = {};
        conf.filePaths.forEach(path => {
          result[conf.name][path.isPrivate ? 'privateKey' : 'publicKey'] = fs.readFileSync(
            path.path,
            'utf-8'
          );
        });
      }
    }

    return result;
  } catch (error) {
    console.log(error);
  }
};

const sanitizedConfig = getSanitizedConfig(parsedConfig);
const keys = saveKeys();
sanitizedConfig.ACCESS_PRIVATE_KEY = keys.accessToken.privateKey;
sanitizedConfig.ACCESS_PUBLIC_KEY = keys.accessToken.publicKey;
sanitizedConfig.REFRESH_PRIVATE_KEY = keys.refreshToken.privateKey;
sanitizedConfig.REFRESH_PUBLIC_KEY = keys.refreshToken.publicKey;

module.exports = sanitizedConfig;
