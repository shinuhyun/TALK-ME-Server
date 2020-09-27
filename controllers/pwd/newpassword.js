const { User } = require("../../models");

module.exports = {
  patch: async (req, res) => {
    const sess = req.session;
    const { password } = req.body;
    try {
      if (!password) {
        res.status(400).send({ message: "Invalid Password" });
      } else {
        const user = await User.findOne({ where: { email: sess.email } });

        if (user === null) {
          res.status(401).send({ message: "Unauthorized User" });
        } else {
          await User.updatePassword(sess.email, password);
          res.status(200).send({ message: "New Password is saved." });
        }
      }
    } catch (err) {
      console.log(err);
      res.status(500).send({ message: "Server Error" });
    }
  },
};
