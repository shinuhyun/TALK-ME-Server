module.exports = {
  get: async (req, res) => {
    const { userId } = req.session;
    // 유저가 로그인하지 않은 경우
    if (userId === undefined) {
      res.status(200).json({ message: 'unauthorized' });
    } else {
      // 유저가 로그인 한 경우
      res.status(200).json({ message: 'authorized' });
    }
  },
};
