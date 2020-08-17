module.exports = {
  patch: async (req, res) => {
    try {
      res.status(200).send({ message: "It Works!" });
    } catch (err) {
      res.status(500).send({ message: "Server Error" });
    }
  },
};
