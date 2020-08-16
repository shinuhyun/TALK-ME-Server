const { User } = require('../../models');

module.exports = {
  post: async (req, res) => {
    const { email, password } = req.body;

    try {
      // 이메일과 패스워드로 user record 찾기
      const result = await User.findOneByEmailAndPassword(email, password);

      // 존재하지 않는 유저
      if (result === null) {
        res.status(404).json({ message: 'login fail; Wrong info' });
      } else {
        // 로그인 성공
        // session id 부여
        req.session.userId = result.id;
        req.session.save((err) => {
          if (err) {
            throw Error(err);
          }
          res.status(200).json({ message: 'login success!' });
        });
      }
    } catch (err) {
      // server error handling
      console.log(err);
      res.status(500).json({ message: 'Server Error' });
    }
  },
};
