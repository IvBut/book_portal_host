class AuthBaseUserDto {
  userId;
  userName;
  roles;

  constructor(user, roles) {
    this.userId = user.id;
    this.userName = user.name;
    this.roles = roles;
  }
}

module.exports = {
  AuthBaseUserDto
};
