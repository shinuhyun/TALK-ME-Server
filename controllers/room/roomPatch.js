const { Question, Room } = require("../../models");

module.exports = {
  patch: async (req, res) => {
    const sess = req.session;

    const { roomId, title, description, questions } = req.body;
    try {
      if (sess.userId) {
        const room = await Room.findOne({
          where: { userId: sess.userId, id: roomId },
        });
        //patch 하려는 room이 있으면 실행
        if (room) {
          await Room.update(
            { title: title, description: description },
            { where: { id: roomId } }
          );
          await Question.destroy({
            where: { roomId: roomId },
          });

          // 비동기 배열 처리
          for (let i = 0; i < questions.length; i += 1) {
            const newQuestion = await Question.create({
              text: questions[i],
              roomId: roomId,
            });
            await room.addQuestion(newQuestion);
          }

          res.status(200).send({ message: "Room is edited" });
        } else {
          res.status(404).send({ message: "Room Not Found" });
        }
      } else {
        res.status(401).send({ message: "Unauthorized User" });
      }
    } catch (err) {
      console.log(err);
      res.status(500).send({ message: "Server Error" });
    }
  },
};
