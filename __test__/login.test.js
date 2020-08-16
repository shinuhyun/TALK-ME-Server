'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');

const expect = chai.expect;

chai.use(chaiHttp);

const app = require('../app');
const { User, sequelize } = require('../models');
const usersFixture = require('./fixtures/users.json');

describe('Implement testcase', () => {
  beforeEach(async () => {
    // Setup/TearDown : Check Fixtures folder
    await sequelize.sync({ force: true });
    await User.create(usersFixture[0]);
    await User.create(usersFixture[1]);
  });

  describe('POST /auth/login', () => {
    it('should respond success with login data', (done) => {
      chai
        .request(app)
        .post('/auth/login')
        .send({ email: 'dodose@naver.com', password: 'cutedodose11' })
        .end((err, res) => {
          if (err) {
            done(err);
            return;
          }
          expect(res).to.have.status(201);
          expect(res.body.message).to.equal('login success!');
          done();
        });

      it('should respond NOT FOUND with wrong login data');
    });
  });
});
