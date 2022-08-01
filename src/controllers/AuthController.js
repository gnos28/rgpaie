const models = require("../models");
const { verifyPassword, hashPassword } = require("../helpers/argonHelper");
const { encodeJwt } = require("../helpers/jwtHelper");

exports.login = (req, res) => {
  const { email, password } = req.body;

  models.user.findByUserEmail(email).then((user) => {
    if (!user) {
      res.status(401).send("Invalid credentials");
    }
    if (password.length === 0) {
      res.status(401).send("Password field is empty");
    } else {
      try {
        verifyPassword(password, user[0].password_hash).then((verification) => {
          if (verification) {
            const userAnswer = user[0];
            delete userAnswer.password_hash;
            const token = encodeJwt(userAnswer);
            res.cookie("token", token, { httpOnly: true, secure: false });
            res.status(200).json({
              id: userAnswer.id,
              email: userAnswer.email,
              is_admin: userAnswer.is_admin,
            });
          } else {
            res.status(401).send("Invalid credentials");
          }
        });
      } catch (err) {
        res.status(401).send(err);
      }
    }
  });
};

exports.logout = (req, res) => {
  res.clearCookie("token").sendStatus(200);
};

// utility fonction to be used just for first admin profile creation
// eslint-disable-next-line no-unused-vars
const hash = async (newPassword) => {
  const hashed = await hashPassword(newPassword);
  // eslint-disable-next-line no-restricted-syntax
  console.log(hashed);
};
