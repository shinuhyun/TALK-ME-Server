module.exports = {
  get: async (req, res) => {
    const { userId } = req.session;
    // 로그인한 적이 없는 경우
    if (userId === undefined) {
      res.status(404).json({ message: 'session id Not Found' });
      return;
    }
    // 로그인한 유저인 경우
    req.session.destroy((err) => {
      // server error handling
      if (err) {
        console.log(err);
        res.status(500).json({ message: 'Server Error' });
        return;
      }
      // 세션 객체 삭제 성공
      res.status(200).json({ message: 'logout success!' });
    });
  },
};
