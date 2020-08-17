'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');

const expect = chai.expect;

chai.use(chaiHttp);

const app = require('../../app');

const { User, sequelize } = require('../../models');
const usersFixture = require('../fixtures/users.json');

describe('Room POST API', () => {
  let agent = null;

  beforeEach(async () => {
    // Setup/TearDown : Check Fixtures folder
    await sequelize.sync({ force: true });
    await User.create(usersFixture[0]);

    agent = chai.request.agent(app);
    await agent
      .post('/auth/login')
      .send({ email: 'example@gmail.com', password: '1234' });
  });

  describe('POST /room', () => {
    let data = {
      title: 'this is title',
      description: 'this is description',
      questions: ['question1', 'question2'],
    };

    it('should respond Success with session id', (done) => {
      agent
        .post('/room')
        .send(data)
        .then((res) => {
          expect(res).to.have.status(201);
          expect(res.body).to.deep.equal({ room: { id: 1 } });
          return agent.get('/room/1').then((res2) => {
            data.id = 1;
            data.questions = data.questions.map((text, index) => ({
              id: index + 1,
              text,
            }));
            expect(res2).to.have.status(200);
            expect(res2.body).to.deep.equal(data);
            done();
          });
        })
        .catch((err) => {
          done(err);
        });
    });

    it('should respond Unauthorized if session id does not exists in the session store', (done) => {
      chai
        .request(app)
        .post('/room')
        .end((err, res) => {
          if (err) {
            done(err);
            return;
          }
          expect(res).to.have.status(401);
          expect(res.body.message).to.equal('Unauthorized User');
          done();
        });
    });
  });
});
