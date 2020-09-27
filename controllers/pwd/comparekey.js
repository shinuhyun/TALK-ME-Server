const { User } = require("../../models");

module.exports = {
  post: async (req, res) => {
    const sess = req.session;
    const { secretKey } = req.body;
    try {
      const user = await User.findOne({
        where: {
          email: sess.email,
          secretKey: secretKey,
        },
      });
      if (user === null) {
        res.status(404).send({ message: "Wrong Secret Key" });
      } else {
        res.status(200).send({ message: "Correct Secret Key" });
      }
    } catch (err) {
      console.log(err);
      res.status(500).send({ message: "Server Error" });
    }
  },
};
