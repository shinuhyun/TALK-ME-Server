const path = require("path");
require("dotenv").config(path.join(__dirname, "../../", "env"));
const { OAuth2Client } = require("google-auth-library"); // token 검증 라이브러리
const axios = require("axios");
const { User } = require("../../models");

const client = new OAuth2Client(process.env.CLIENT_ID);

// token 검증 및 user정보 반환
const verifyTokenAndGetUserInfo = async (idToken) => {
  const ticket = await client.verifyIdToken({
    idToken,
    audience: process.env.CLIENT_ID,
  });
  const payload = ticket.getPayload();
  return payload;
};

const getIdTokenFromGoogle = async (code) => {
  const url = `https://oauth2.googleapis.com/token?code=${code}&client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_PASSWORD}&redirect_uri=${process.env.REDIRECT_URI}&grant_type=authorization_code`;
  try {
    const {
      data: { id_token },
    } = await axios.post(url);
    return id_token;
  } catch (err) {
    throw Error(err);
  }
};

module.exports = {
  get: async (req, res) => {
    try {
      //코드를 통해 id_token 획득
      const idToken = await getIdTokenFromGoogle(req.query.code);
      // 토큰 검증 후 email과 sub 값 받아서
      const { email, sub } = await verifyTokenAndGetUserInfo(idToken);
      // 기존 유저가 있는지 여부 확인 및 존재하지 않을 경우 자동 생성
      const [user] = await User.findOrCreate({
        where: { email },
        defaults: { password: sub },
      });

      // 로그인 기록 저장
      req.session.userId = user.id;
      req.session.save((err) => {
        if (err) {
          throw Error(err);
        }
        // 채팅방목록 화면으로 리다이렉트
        res.redirect("http://localhost:3000/roomlist");
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "server error" });
    }
  },
};
