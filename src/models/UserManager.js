const Joi = require("joi");
const AbstractManager = require("./AbstractManager");

class UserManager extends AbstractManager {
  static table = "user";

  validate(data, forCreation = true) {
    this.presence = forCreation ? "required" : "optional";

    const joiObject = {
      firstname: Joi.string().max(128).presence(this.presence),
      lastname: Joi.string().max(128).presence(this.presence),
      is_admin: Joi.bool().presence(this.presence),
      email: Joi.string().email().min(5).max(255).presence(this.presence),
    };

    if (forCreation)
      joiObject.password = Joi.string().max(255).presence(this.presence);
    else
      joiObject.password_hash = Joi.string().max(255).presence(this.presence);

    return Joi.object(joiObject).validate(data, { abortEarly: false }).error;
  }

  insert(user) {
    return this.connection.query(
      `insert into ${UserManager.table} (firstname, lastname, email, password_hash, is_admin) values (?, ?, ?, ?, ?)`,
      [
        user.firstname,
        user.lastname,
        user.email,
        user.password_hash,
        user.is_admin,
      ]
    );
  }

  update(user, id) {
    return this.connection.query(
      `update ${UserManager.table} set ? where id = ?`,
      [user, id]
    );
  }

  findByUserEmail(email) {
    return this.connection
      .query(`select * from  ${this.table} where email = ?`, [email])
      .then((result) => result[0]);
  }

  findByUserId(user, id) {
    return this.connection.query(`select * from  ${this.table} where id = ?`, [
      user,
      id,
    ]);
  }
}

module.exports = UserManager;
