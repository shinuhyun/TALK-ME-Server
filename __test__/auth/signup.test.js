'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');

const expect = chai.expect;

chai.use(chaiHttp);

const app = require('../../app');
const { User, sequelize } = require('../../models');
const usersFixture = require('../fixtures/users.json');

describe('Auth POST API - SIGNUP', () => {
  beforeEach(async () => {
    // Setup/TearDown : Check Fixtures folder
    await sequelize.sync({ force: true });
    await User.create(usersFixture[0]);
    await User.create(usersFixture[1]);
  });

  describe('POST /auth/signup', () => {
    it('should respond success with email, password', (done) => {
      const agent = chai.request.agent(app);
      agent
        .post('/auth/signup')
        .send({ email: 'HelloWorld@gmail.com', password: 'Hello' })
        .then((res) => {
          expect(res).to.have.status(201);
          expect(res.body.message).to.equal('SignUp success');
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    it('should respond email already exists if email already exists', (done) => {
      chai
        .request(app)
        .post('/auth/signup')
        .send(usersFixture[0])
        .end((err, res) => {
          if (err) {
            done(err);
            return;
          }
          expect(res).to.have.status(409);
          expect(res.body.message).to.equal('email already exists');
          done();
        });
    });
  });
});
