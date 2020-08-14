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

  describe('GET /room/:roomId', () => {
    it('should return room and questions data with request of session.userId', (done) => {
      chai
        .request(app)
        .get('/room/1')
        .end((err, res) => {
          if (err) {
            done(err);
            return;
          }
          expect(res).to.have.status(200);
          expect(res.body).to.has.all.keys([
            'id',
            'title',
            'description',
            'questions',
          ]);
          expect(res.body.questions[0]).to.has.all.keys(['id', 'text']);
          expect(res.body.id).to.equal(1);
          done();
        });
    });
    // 세션 아이디 체크과정 필요

    it('should return NOT FOUND with roomId not in DB', (done) => {
      chai
        .request(app)
        .get('/room/100')
        .end((err, res) => {
          if (err) {
            done(err);
            return;
          }
          expect(res).to.have.status(404);
          expect(res.body.message).to.equal('Not Found');
          done();
        });
    });
  });
});
