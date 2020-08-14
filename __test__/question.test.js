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

  describe('Get /room/:roomId/questions', () => {
    it('should respond questions list to roomId', (done) => {
      chai
        .request(app)
        .get('/room/1/questions')
        .end((err, res) => {
          if (err) {
            done(err);
            return;
          }
          const { questions } = res.body;
          expect(res).to.have.status(200);
          expect(questions).to.have.lengthOf(2);
          expect(questions[0]).has.all.keys([
            'id',
            'text',
            'roomId',
            'createdAt',
            'updatedAt',
            'Room',
          ]);
          expect(questions[0]['Room']).has.all.keys(['id', 'title']);
          expect(questions[0].text).to.equal('this is simple question');
          expect(questions[0].roomId).to.equal(1);
          expect(questions[1].text).to.equal('Hello World!');
          expect(questions[1].roomId).to.equal(1);
          done();
        });
    });
  });
});
