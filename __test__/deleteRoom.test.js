'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');

const expect = chai.expect;

chai.use(chaiHttp);

const app = require('../app');

const { User, Room, Question, sequelize } = require('../models');
const usersFixture = require('./fixtures/users.json');
const roomsFixture = require('./fixtures/rooms.json');
const questionsFixture = require('./fixtures/questions.json');

describe('Implement testcase', () => {
  beforeEach(async () => {
    // Setup/TearDown : Check Fixtures folder
    await sequelize.sync({ force: true });
    await User.create(usersFixture[0]);
    await User.create(usersFixture[1]);
    await Room.create(roomsFixture[0]);
    await Question.create(questionsFixture[0]);
    await Question.create(questionsFixture[1]);
  });

  describe('DELETE /room', () => {
    it('should respond Success with roomId', (done) => {
      chai
        .request(app)
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
      const agent = chai.request.agent(app);
      agent
        .delete('/room')
        .send({ roomId: 1 })
        .then((res) => {
          expect(res).to.have.status(200);
          agent.get('/room/1/questions').then(function (res2) {
            expect(res2).to.have.status(200);
            expect(res2.body.questions).to.have.lengthOf(0);
            done();
          });
        })
        .catch((err) => {
          done(err);
        });
    });

    it('should respond NOT FOUND with roomId not in DB', (done) => {
      chai
        .request(app)
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
  });
});
