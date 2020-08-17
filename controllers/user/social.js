const path = require('path');
require('dotenv').config(path.join(__dirname, '../../', 'env'));
const { OAuth2Client } = require('google-auth-library'); // token 검증 라이브러리
const { User } = require('../../models');

const CLIENT_ID = process.env.CLIENT_ID; // 구글 API 등록할 때 부여받은 Client ID
const client = new OAuth2Client(CLIENT_ID);

// token 검증 및 user정보 반환
const verifyTokenAndGetUserInfo = async (idToken) => {
  const ticket = await client.verifyIdToken({
    idToken,
    audience: CLIENT_ID,
  });
  const payload = ticket.getPayload();
  return payload;
};

module.exports = {
  post: async (req, res) => {
    const { id_token } = req.body;
    const { userId } = req.session;

    // 로그인 정보가 있는 경우
    if (userId !== undefined) {
      res.status(304).json({ message: 'already login' });
      return;
    }

    // id_token이 없는 경우
    if (id_token === undefined) {
      res.status(404).json({ message: 'id_token should not be empty' });
      return;
    }

    try {
      // 토큰 검증 후 email과 sub 값 받아서
      const { email, sub } = await verifyTokenAndGetUserInfo(id_token);
      // 기존 유저가 있는지 여부 확인 및 존재하지 않을 경우 자동 생성
      const [user, created] = await User.findOrCreate({
        where: { email },
        defaults: { password: sub },
      });

      // 로그인 기록 저장
      req.session.userId = user.id;

      if (created) {
        // 기존 유저가 없는 경우
        res.status(201).json({ message: 'created and login success' });
      } else {
        // 기존 유저가 있는 경우
        res.status(200).json({ message: 'login success' });
      }
    } catch (err) {
      // server error handling
      console.log(err);
      res.status(500).json({ message: 'server error' });
    }
  },
};
