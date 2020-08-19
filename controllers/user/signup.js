const { User } = require("../../models");

module.exports = {
  post: async (req, res) => {
    const { email, password } = req.body;
    try {
      if (!password) {
        res.status(400).send({ message: "Invalid Password" });
      } else {
        await User.findOrCreate({
          where: { email: email },
          defaults: { password: password },
        }).then(async ([user, created]) => {
          if (!created) {
            return res.status(409).send({ message: "email already exists" });
          }
          res.status(201).send({ message: "SignUp success" });
        });
      }
    } catch (err) {
      console.log(err);
      if (err.name === "SequelizeValidationError") {
        res.status(404).send({ message: "wrong email format" });
      } else {
        res.status(500).send({ message: "Server Error" });
      }
    }
  },
};
