const { Question, Room } = require("../../models");

module.exports = {
  post: async (req, res) => {
    const sess = req.session;

    const { title, description, questions } = req.body;
    try {
      if (sess.userId) {
        await Room.create(
          {
            //더미유저로 연결해서 검사.
            userId: sess.userId,
            title: title,
            description: description,
            questions: questions.map((text) => ({
              text,
            })),
          },
          {
            include: [{ model: Question, as: "questions" }],
          }
        ).then((room) => {
          res.status(201).send({ room: { id: room.id } });
        });
      } else {
        res.status(401).send({ message: "Unauthorized User" });
      }
    } catch (err) {
      console.log(err);
      res.status(500).send({ message: "Server Error" });
    }
  },
};
