const models = require("../models");

class RealManager {
  static browse = (req, res) => {
    models.real
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
    models.real
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
    const newReal = req.body;

    const validationErrors = models.real.validate(newReal);
    if (validationErrors) {
      console.error(validationErrors);
      return res.status(422).json({ validationErrors });
    }

    models.real
      .insert(newReal)
      .then(([result]) => {
        res.status(201).send({ ...newReal, id: result.insertId });
      })
      .catch((err) => {
        console.error(err);
        res.sendStatus(500);
      });
    return true;
  };

  static modify = async (req, res) => {
    const newReal = req.body;

    const validationErrors = models.real.validate(newReal, false);
    if (validationErrors) res.status(422).json({ validationErrors });
    else {
      models.real
        .update(newReal, req.params.id)
        .then(([result]) => {
          if (result.affectedRows === 0) throw new Error("no change affected");
          res.status(201).send({ ...newReal });
        })
        .catch((err) => {
          console.error(err);
          res.sendStatus(500);
        });
    }
  };

  static delete = async (req, res) => {
    models.real
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

module.exports = RealManager;
