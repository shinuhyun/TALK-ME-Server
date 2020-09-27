const nodemailer = require("nodemailer");
const smtpPool = require("nodemailer-smtp-pool");
// smtpPool는 smtp서버를 사용하기 위한 모듈로
// transporter객체를 만드는 nodemailer의 createTransport메소드의 인자로 사용된다.

const { User } = require("../../models");

function makeTransporter(email, secretKey) {
  const config = {
    mailer: {
      service: "Gmail",
      host: "localhost",
      port: "465",
      user: process.env.NODEMAILER_USER,
      password: process.env.NODEMAILER_PASS,
    },
  };

  const from = process.env.NODEMAILER_USER;
  const to = email;
  const subject = "[TalkMe] Please verify your device";
  const html = `<p>Hey!<br/>A sign in attempt requires further verification because we did not recognize your device.<br/>To complete the sign in, enter the verification code on the unrecognized device.<br/>Verification code: <b>${secretKey}</b><br/>Thanks,The TalkMe Team<p>`;

  const mailOptions = {
    from,
    to,
    subject,
    html,
  };
  // 본문에 html이나 text를 사용할 수 있다.

  const transporter = nodemailer.createTransport(
    smtpPool({
      service: config.mailer.service,
      host: config.mailer.host,
      port: config.mailer.port,
      auth: {
        user: config.mailer.user,
        pass: config.mailer.password,
      },
      tls: {
        rejectUnauthorize: false,
      },
      maxConnections: 5,
      maxMessages: 10,
    })
  );
  return { transporter, mailOptions };
}

module.exports = {
  post: async (req, res) => {
    const { email } = req.body;

    try {
      const user = await User.findOne({
        where: {
          email: email,
        },
      });
      if (user === null) {
        res.status(404).send({ message: "Wrong Email" });
      } else {
        req.session.email = email;
        const secretKey = await User.generateSecretkey(email);
        await User.update(
          { secretKey: secretKey },
          { where: { email: email } }
        );

        const { transporter, mailOptions } = makeTransporter(email, secretKey);

        // 메일을 전송하는 부분
        transporter.sendMail(mailOptions, (err, result) => {
          if (err) {
            console.log("failed... => ", err);
            res.status(404).send({ message: "No recipients defined." });
          } else {
            console.log("succeed... => ", result);
            res.status(200).send({ message: "Please check your email." });
          }
          transporter.close();
        });
      }
    } catch (err) {
      console.log(err);
      res.status(500).send({ message: "Server Error" });
    }
  },
};
