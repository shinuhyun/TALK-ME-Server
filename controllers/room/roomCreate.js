const { Question, Room } = require("../../models");

module.exports = {
  post: async (req, res) => {
    // const sess = req.session;

    const { title, description, questions } = req.body;
    try {
      // if (sess.userid) {
      await Room.create(
        {
          //더미유저로 연결해서 검사.
          userId: 1,
          title: title,
          description: description,
          Questions: questions.map((text) => ({
            text,
          })),
        },
        {
          include: [Question],
        }
      ).then((room) => {
        res.status(201).send({ room: { id: room.id } });
      });
      // }
    } catch (err) {
      res.status(500).send({ message: "Server Error" });
    }
  },
};
