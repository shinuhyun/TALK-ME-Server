const { Room, Question } = require("../../models");

module.exports = {
  get: async (req, res) => {
    const sess = req.session;
    const { roomId } = req.params;
    try {
      if (sess.userId) {
        // roomId를 유저가 소유하고 있는지 확인
        const result = await Room.findOne({
          attributes: ["id", "title", "description"],
          where: { id: roomId, userId: sess.userId },
          include: [
            {
              model: Question,
              as: "questions",
              attributes: ["id", "text"],
              where: { roomId },
            },
          ],
        });

        if (result === null) {
          res.status(404).json({ message: "Not Found" });
        } else {
          res.status(200).json(result);
        }
      } else {
        res.status(401).send({ message: "Unauthorized User" });
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Server Error" });
    }
  },
};
