const { Question, Room } = require('../../models');

module.exports = {
  patch: async (req, res) => {
    // const sess = req.session;

    const { roomId, title, description, questions } = req.body;
    try {
      const room = await Room.findOne({
        where: { userId: 1, id: roomId },
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
        questions.forEach((question) =>
          room.setQuestions(Question.create({ text: question, roomId: roomId }))
        );
        res.status(200).send('Room is edited');
      } else {
        res.status(404).send({ message: 'Room Not Found' });
      }
    } catch (err) {
      res.status(500).send({ message: 'Server Error' });
    }
  },
};
//session-id 검증 결과로 나오게 됩니다.
// res.status(401).send({ message: "Unauthorized User" });
