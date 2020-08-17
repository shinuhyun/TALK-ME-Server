'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');

const expect = chai.expect;

chai.use(chaiHttp);

const app = require('../../app');
const { User, sequelize } = require('../../models');
const usersFixture = require('../fixtures/users.json');

describe('Auth GET API - LOGOUT', () => {
  beforeEach(async () => {
    // Setup/TearDown : Check Fixtures folder
    await sequelize.sync({ force: true });
    await User.create(usersFixture[0]);
    await User.create(usersFixture[1]);
  });

  describe('GET /auth/logout', () => {
    it('should respond success with session id', (done) => {
      const agent = chai.request.agent(app);
      agent
        .post('/auth/login')
        .send({ email: 'example@gmail.com', password: '1234' })
        .then((res) => {
          expect(res).to.have.cookie('connect.sid');
          return agent.get('/auth/logout').then((res2) => {
            expect(res2).to.have.status(200);
            expect(res2.body.message).to.equal('logout success!');
            done();
          });
        })
        .catch((err) => {
          done(err);
        });
    });

    it('should respond NOT FOUND if session id does not exist in the session store', (done) => {
      chai
        .request(app)
        .get('/auth/logout')
        .end((err, res) => {
          if (err) {
            done(err);
            return;
          }
          expect(res).to.have.status(404);
          expect(res.body.message).to.equal('session id Not Found');
          done();
        });
    });
  });
});
