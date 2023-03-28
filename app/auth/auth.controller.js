const AuthService = require('./auth.service');
const { dataWrapper } = require('../../utils/responseWrapper');
const { REFRESH_COOKIE_NAME } = require('../../config/credentials');
const { setCookie } = require('./helpers');

const signUp = async (req, res, next) => {
  try {
    const user = await AuthService.registerUser(req.body);
    res.status(201).json(dataWrapper(user));
  } catch (error) {
    next(error);
  }
};

const signIn = async (req, res, next) => {
  try {
    const { user, tokenData } = await AuthService.login(req.body);
    const response = setCookie(res, 'addNew', tokenData.refreshToken);
    response.status(200).json(
      dataWrapper({
        user,
        accessToken: tokenData.accessToken
      })
    );
  } catch (error) {
    next(error);
  }
};

const refresh = async (req, res, next) => {
  try {
    const cookie = req.cookies[REFRESH_COOKIE_NAME];
    const { user, tokenData } = await AuthService.refresh(cookie);
    const response = setCookie(res, 'addNew', tokenData.refreshToken);
    response.status(200).json(
      dataWrapper({
        user,
        accessToken: tokenData.accessToken
      })
    );
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    const cookie = req.cookies[REFRESH_COOKIE_NAME];
    await AuthService.logout(cookie, req.body);
    res.clearCookie(REFRESH_COOKIE_NAME);
    res.status(200).json(dataWrapper(null));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  signUp,
  signIn,
  refresh,
  logout
};
