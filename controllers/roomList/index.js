const { Question, Room } = require("../../models");
const Sequelize = require("sequelize");

module.exports = {
  get: async (req, res) => {
    const sess = req.session;

    //1.roomList는 req로 session-id를 받아와서, 유저임을 확인합니다.
    //2.room의 FK인 userId가 session-id인 room을 찾아서
    //3.room의 id, title를 가져옵니다.
    //4.Question에서 roomId가 가져온 id와 같은 것이 몇개인지를 가져옵니다.

    try {
      if (sess.userId) {
        const rooms = await Room.findAll({
          where: { userId: sess.userId },
          attributes: [
            "id",
            "title",
            [
              Sequelize.fn("COUNT", Sequelize.col("questions.id")),
              "questionCount",
            ],
          ],
          include: [
            {
              model: Question,
              as: "questions",
              attributes: [],
            },
          ],
          group: ["Room.id"],
        });

        res.status(200).json({ rooms });
      } else {
        res.status(401).send({ message: "Unauthorized User" });
      }
    } catch (err) {
      console.log(err);
      res.status(500).send({ message: "Server Error" });
    }
  },
};
