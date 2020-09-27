'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');

const expect = chai.expect;

chai.use(chaiHttp);

const app = require('../../app');
const { User, sequelize } = require('../../models');
const usersFixture = require('../fixtures/users.json');

describe('Auth POST API - LOGIN', () => {
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
        .send({ email: 'example@gmail.com', password: '1234' })
        .end((err, res) => {
          if (err) {
            done(err);
            return;
          }
          expect(res).to.have.status(200);
          expect(res.body.message).to.equal('login success!');
          done();
        });

      it('should respond NOT FOUND with wrong login data', (done) => {
        const requester = chai.request(app).keepOpen();
        Promise.all([
          requester
            .post('/auth/login')
            .send({ email: 'notfound@gmail.com', password: 'notfoundpwd' }),
          requester
            .post('/auth/login')
            .send({ email: 'wrong email format', password: 'wrongpassword' }),
        ])
          .then((responses) => {
            expect(responses[0]).to.have.status(404);
            expect(responses[0].body.message).to.equal(
              'login fail; Wrong info'
            );
            expect(responses[1]).to.have.status(404);
            expect(responses[1].body.message).to.equal(
              'login fail; Wrong info'
            );
            done();
          })
          .then(() => {
            requester.close();
          })
          .catch((err) => {
            done(err);
          });
      });
    });
  });
});
