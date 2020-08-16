const { Room, User } = require("../../models");
module.exports = {
  delete: async (req, res) => {
    const sess = req.session;
    const { roomId } = req.body;
    try {
      if (sess.userId) {
        // roomId를 유저가 소유하고 있는지 확인
        const isOwn = !!(await Room.findOne({
          attributes: ["id"],
          where: { id: roomId },
          include: {
            model: User,
            where: { id: sess.userId },
          },
        }));
        // roomId를 소유한 유저면 destroy 실행
        if (isOwn) {
          await Room.destroy({
            where: { id: roomId },
          });
          // 삭제가 성공되었으면 200 응답
          res.status(200).json({ message: "Room deleted" });
        } else {
          // roomId를 소유하지 않았거나 삭제가 실패했을 경우
          res.status(404).json({ message: "Room Not Found" });
        }
      } else {
        res.status(401).send({ message: "Unauthorized User" });
      }
    } catch (err) {
      // server error handling
      console.log(err);
      res.status(500).json({ message: "Server Error" });
    }
  },
};
