const Joi = require("joi");
const AbstractManager = require("./AbstractManager");

class RealManager extends AbstractManager {
  static table = "real";

  validate(data, forCreation = true) {
    this.presence = forCreation ? "required" : "optional";

    const joiObject = {
      titre: Joi.string().max(255).presence(this.presence),
      link: Joi.string().min(0).max(255).presence("optional"),
      description: Joi.string().max(255).presence(this.presence),
    };

    return Joi.object(joiObject).validate(data, { abortEarly: false }).error;
  }

  insert(real) {
    return this.connection.query(
      `insert into \`${RealManager.table}\` (titre, link, description) values (?, ?, ?)`,
      [real.titre, real.link, real.description]
    );
  }

  update(real, id) {
    return this.connection.query(
      `update \`${RealManager.table}\` set ? where id = ?`,
      [real, id]
    );
  }
}

module.exports = RealManager;
