const { tokens, sequelize } = require('../index');
const { SECRET_KEY_TYPE } = require('../../constants/enums');
const { TOKENS_MAX_AGE, SESSION_MAX_COUNT } = require('../../constants/constants');
const { signJwt } = require('../../utils/jwt');
const { REFRESH_COOKIE_NAME } = require('../../config/credentials');

const generateTokensPair = userData => {
  const accessToken = signJwt({ data: JSON.stringify(userData) }, SECRET_KEY_TYPE.ACCESS, {
    expiresIn: TOKENS_MAX_AGE.ACCESS
  });
  const refreshToken = signJwt(
    { data: JSON.stringify({ userId: userData.userId }) },
    SECRET_KEY_TYPE.REFRESH,
    {
      expiresIn: TOKENS_MAX_AGE.REFRESH
    }
  );

  return {
    accessToken,
    refreshToken
  };
};

const saveToken = async (refreshToken, userId, outerTransaction = undefined) => {
  let transaction = outerTransaction;
  try {
    if (!transaction) {
      transaction = await sequelize.transaction();
    }
    const count = await tokens.count({
      where: { userId }
    });
    if (count < SESSION_MAX_COUNT) {
      await tokens.create({ userId, token: refreshToken }, { transaction });
    } else {
      await tokens.destroy({ where: { userId } }, { transaction });
      await tokens.create({ userId, token: refreshToken }, { transaction });
    }
    await transaction.commit();
  } catch (e) {
    if (transaction) {
      await transaction.rollback();
    }
    return Promise.reject();
  }
};

const setCookie = (response, type, data) => {
  switch (type) {
    case 'addNew':
      response.cookie(REFRESH_COOKIE_NAME, data, {
        httpOnly: true,
        sameSite: 'none',
        expires: new Date(Date.now() + TOKENS_MAX_AGE.REFRESH * 1000),
        maxAge: TOKENS_MAX_AGE.REFRESH * 1000
      });
      break;
  }

  return response;
};

module.exports = {
  generateTokensPair,
  saveToken,
  setCookie
};
