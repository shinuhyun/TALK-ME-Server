'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');

const expect = chai.expect;

chai.use(chaiHttp);

const app = require('../../app');
const { User, sequelize } = require('../../models');
const usersFixture = require('../fixtures/users.json');

describe('Auth GET API - LOGIN', () => {
  beforeEach(async () => {
    // Setup/TearDown : Check Fixtures folder
    await sequelize.sync({ force: true });
    await User.create(usersFixture[0]);
  });

  describe('GET /auth/isLogin', () => {
    it('should respond success with session id', (done) => {
      const agent = chai.request.agent(app);
      agent
        .post('/auth/login')
        .send({ email: 'example@gmail.com', password: '1234' })
        .then(() => {
          return agent.get('/auth/isLogin').then((res) => {
            expect(res).to.have.status(200);
            expect(res.body.message).to.equal('authorized');
            done();
          });
        })
        .catch((err) => {
          done(err);
        });
    });

    it('should respond Unauthorized if session id does not exists in session store', (done) => {
      chai
        .request(app)
        .get('/auth/isLogin')
        .end((err, res) => {
          if (err) {
            done(err);
            return;
          }
          expect(res).to.have.status(200);
          expect(res.body.message).to.equal('unauthorized');
          done();
        });
    });
  });
});
