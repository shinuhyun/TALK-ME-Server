const { Room, Question, User } = require('../../models');

module.exports = {
  get: async (req, res) => {
    const { roomId } = req.params;
    try {
      // roomId를 유저가 소유하고 있는지 확인
      const result = await Room.findOne({
        attributes: ['id', 'title', 'description'],
        where: { id: roomId, userId: 1 },
        include: [
          {
            model: Question,
            as: 'questions',
            attributes: ['id', 'text'],
            where: { roomId },
          },
        ],
      });
      console.log(result);

      if (result === null) {
        res.status(404).json({ message: 'Not Found' });
      } else {
        res.status(200).json(result);
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: 'Server Error' });
    }
  },
};
