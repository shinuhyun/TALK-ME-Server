'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');

const expect = chai.expect;

chai.use(chaiHttp);

const app = require('../../app');

const { User, Room, Question, sequelize } = require('../../models');
const usersFixture = require('../fixtures/users.json');
const roomsFixture = require('../fixtures/rooms.json');
const questionsFixture = require('../fixtures/questions.json');

describe('Room DELETE API', () => {
  let agent = null;

  beforeEach(async () => {
    // Setup/TearDown : Check Fixtures folder
    await sequelize.sync({ force: true });
    await User.create(usersFixture[0]);
    await User.create(usersFixture[1]);
    await Room.create(roomsFixture[0]);
    await Question.create(questionsFixture[0]);
    await Question.create(questionsFixture[1]);

    agent = chai.request.agent(app);
    await agent
      .post('/auth/login')
      .send({ email: 'example@gmail.com', password: '1234' });
  });

  describe('DELETE /room', () => {
    it('should respond Success to roomId with session id', (done) => {
      agent
        .delete('/room')
        .send({ roomId: 1 })
        .end((err, res) => {
          if (err) {
            done(err);
            return;
          }
          expect(res).to.have.status(200);
          expect(res.body.message).to.equal('Room deleted');
          done();
        });
    });

    it('should delete all questions in the room to be deleted ', (done) => {
      agent
        .delete('/room')
        .send({ roomId: 1 })
        .then((res) => {
          expect(res).to.have.status(200);
          return agent.get('/room/1/questions').then(function (res2) {
            expect(res2).to.have.status(200);
            expect(res2.body.questions).to.have.lengthOf(0);
            done();
          });
        })
        .catch((err) => {
          done(err);
        });
    });

    it('should respond NOT FOUND if roomId does not exists in DB', (done) => {
      agent
        .delete('/room')
        .send({ roomId: 100 })
        .end((err, res) => {
          if (err) {
            done(err);
            return;
          }
          expect(res).to.have.status(404);
          expect(res.body.message).to.equal('Room Not Found');
          done();
        });
    });

    it('should respond NOT FOUND if the room is not owned by the user', (done) => {
      agent
        .delete('/room')
        .send({ roomId: 2 })
        .end((err, res) => {
          if (err) {
            done(err);
            return;
          }
          expect(res).to.have.status(404);
          expect(res.body.message).to.equal('Room Not Found');
          done();
        });
    });

    it('should respond Unauthorized if session id does not exists in the session store', (done) => {
      chai
        .request(app)
        .delete('/room')
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
