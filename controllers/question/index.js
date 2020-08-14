const { Question, Room } = require('../../models');

module.exports = {
  get: async (req, res) => {
    // router로 분기할 때 params로 가져올 수 없기 때문에 전체 url에서 파싱
    const roomId = req.originalUrl.split(/\//)[2];

    try {
      // roomId에 해당하는 모든 questions 가져오기, room의 id, title과 같이 보내기
      const questions = await Question.findAll({
        include: {
          model: Room,
          where: { id: roomId, userId: 1 },
          attributes: ['id', 'title'],
        },
      });
      res.json({ questions });
    } catch (err) {
      // server error handling
      console.log(err);
      res.sendStatus(500);
    }
  },
};

/* 나중에 추가 구현해야 할 사항 : session id 검증과정 */
