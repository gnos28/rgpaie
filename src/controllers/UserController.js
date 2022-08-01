const models = require("../models");
const { hashPassword } = require("../helpers/argonHelper");

class UserController {
  static browse = (req, res) => {
    models.user
      .findAll()
      .then(([rows]) => {
        res.send(rows);
      })
      .catch((err) => {
        console.error(err);
        res.sendStatus(500);
      });
  };

  static read = (req, res) => {
    models.user
      .find(req.params.id)
      .then(([rows]) => {
        res.send(rows);
      })
      .catch((err) => {
        console.error(err);
        res.sendStatus(500);
      });
  };

  static add = (req, res) => {
    const newUser = req.body;

    const validationErrors = models.user.validate(newUser);
    if (validationErrors) {
      console.error(validationErrors);
      return res.status(422).json({ validationErrors });
    }

    hashPassword(newUser.password).then((hash) => {
      delete newUser.password;

      models.user
        .insert({ ...newUser, password_hash: hash })
        .then(([result]) => {
          res.status(201).send({ ...newUser, id: result.insertId });
        })
        .catch((err) => {
          console.error(err);
          res.sendStatus(500);
        });
    });
    return true;
  };

  static modify = async (req, res) => {
    const newUser = req.body;

    if (newUser.password) {
      newUser.password_hash = await hashPassword(newUser.password);
      delete newUser.password;
    }
    const validationErrors = models.user.validate(newUser, false);
    if (validationErrors) res.status(422).json({ validationErrors });
    else {
      models.user
        .update(newUser, req.params.id)
        .then(([result]) => {
          if (result.affectedRows === 0) throw new Error("no change affected");
          delete newUser.password_hash;
          res.status(201).send({ ...newUser });
        })
        .catch((err) => {
          console.error(err);
          res.sendStatus(500);
        });
    }
  };

  static delete = async (req, res) => {
    models.user
      .delete(req.params.id)
      .then(() => {
        res.sendStatus(204);
      })
      .catch((err) => {
        console.error(err);
        res.sendStatus(500);
      });
  };
}

module.exports = UserController;
