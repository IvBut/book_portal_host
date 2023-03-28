const { Op } = require('sequelize');
const { users, usersRoles, roles, tokens, sequelize } = require('../index');
const APiError = require('../../utils/apiErrors');
const { createHash, isPasswordsEqual } = require('../../utils/password');
const { ROLES, SECRET_KEY_TYPE } = require('../../constants/enums');
const { generateTokensPair, saveToken } = require('./helpers');
const { verifyJwt } = require('../../utils/jwt');
const { AuthBaseUserDto } = require('./auth.dto');

class AuthService {
  static async registerUser({ email, password, name }) {
    let transaction;
    try {
      const candidate = await users.findOne({
        where: {
          [Op.or]: [{ email }, { name }]
        }
      });
      if (candidate) {
        return Promise.reject(new APiError(400, 'такой пользователь уже существует'));
      }
      const hashedPassword = await createHash(password);

      if (!hashedPassword) {
        return Promise.reject(APiError.InternalServerError());
      }
      transaction = await sequelize.transaction();

      const role = await roles.findOne({ where: { roleName: ROLES.COMMON_USER }, transaction });
      const createdUser = await users.create(
        { email, password: hashedPassword, name },
        { transaction }
      );
      await usersRoles.create({ userId: createdUser.id, roleId: role.id }, { transaction });
      const userDto = new AuthBaseUserDto(createdUser, [role.roleName]);
      await transaction.commit();
      return userDto;
    } catch (e) {
      if (transaction) {
        await transaction.rollback();
      }
      return Promise.reject(APiError.InternalServerError());
    }
  }

  static async login(body) {
    const expectedParams = ['email', 'name'];
    const params = Object.keys(body).reduce((acc, curr) => {
      if (expectedParams.some(el => el === curr) && body[curr]) {
        acc.push({ [curr]: body[curr] });
      }
      return acc;
    }, []);
    try {
      const candidateWithRoles = await users.findOne({
        where: {
          [Op.and]: params
        },
        include: {
          model: roles,
          as: 'roles'
        }
      });
      if (!candidateWithRoles) {
        return Promise.reject(new APiError(400, 'такого пользователя не существует'));
      }

      const isPasswordValid = await isPasswordsEqual(candidateWithRoles.password, body.password);
      if (!isPasswordValid) {
        return Promise.reject(
          isPasswordValid === null
            ? APiError.InternalServerError()
            : new APiError(400, 'неправильный пароль')
        );
      }
      const userDto = new AuthBaseUserDto(
        candidateWithRoles,
        candidateWithRoles.roles.map(el => el.roleName)
      );
      const tokenData = generateTokensPair(userDto);
      await saveToken(tokenData.refreshToken, userDto.userId);
      return { user: userDto, tokenData };
    } catch (e) {
      return Promise.reject(APiError.InternalServerError());
    }
  }

  static async refresh(cookie) {
    const tokenNotFound = APiError.UnauthorizedError('Refresh Token не найден');
    const tokenNotValid = APiError.UnauthorizedError('Refresh Token не валиден');
    try {
      if (!cookie) {
        return Promise.reject(tokenNotFound);
      }
      const tokenFromDb = await tokens.findOne({
        where: {
          token: cookie
        }
      });
      if (!tokenFromDb) {
        return Promise.reject(tokenNotFound);
      }
      await tokens.destroy({ where: { id: tokenFromDb.id } });
      const verifiedData = verifyJwt(tokenFromDb.token, SECRET_KEY_TYPE.REFRESH);
      if (!verifiedData) {
        return Promise.reject(tokenNotValid);
      }

      const userWithRoles = await users.findOne({
        where: { id: tokenFromDb.userId },
        include: {
          model: roles,
          as: 'roles'
        }
      });
      if (!userWithRoles) {
        return Promise.reject(tokenNotValid);
      }

      const userDto = new AuthBaseUserDto(
        userWithRoles,
        userWithRoles.roles.map(el => el.roleName)
      );
      const tokenData = generateTokensPair(userDto);
      await saveToken(tokenData.refreshToken, userDto.userId);

      return { user: userDto, tokenData };
    } catch (e) {
      return Promise.reject(APiError.InternalServerError());
    }
  }

  static async logout(cookie, body) {
    let transaction;
    const tokenNotFound = new APiError(400, 'Refresh Token не найден');
    try {
      const resetAll = !!body?.resetAll;
      if (!cookie) {
        return Promise.reject(tokenNotFound);
      }
      const tokenFromDb = await tokens.findOne({
        where: {
          token: cookie
        }
      });
      if (!tokenFromDb) {
        return Promise.reject(tokenNotFound);
      }
      const params = resetAll ? { userId: tokenFromDb.userId } : { id: tokenFromDb.id };
      transaction = await sequelize.transaction();
      await tokens.destroy({ where: params }, { transaction });
      await transaction.commit();
    } catch (e) {
      if (transaction) {
        await transaction.rollback();
      }
      return Promise.reject(APiError.InternalServerError());
    }
  }
}

module.exports = AuthService;
