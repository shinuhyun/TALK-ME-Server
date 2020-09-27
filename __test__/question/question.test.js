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

describe('Questions GET API', () => {
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

  describe('Get /room/:roomId/questions', () => {
    it('should respond questions list to roomId with session id', (done) => {
      agent.get('/room/1/questions').end((err, res) => {
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

  it('should respond empty array if room id does not exists in the DB', (done) => {
    agent.get('/room/100/questions').end((err, res) => {
      if (err) {
        done(err);
        return;
      }
      expect(res).to.have.status(200);
      expect(res.body.questions).to.have.lengthOf(0);
      done();
    });
  });

  it('should respond empty array if the room is not owned by the user', (done) => {
    agent.get('/room/2/questions').end((err, res) => {
      if (err) {
        done(err);
        return;
      }
      expect(res).to.have.status(200);
      expect(res.body.questions).to.have.lengthOf(0);
      done();
    });
  });

  it('should respond Unauthorized if session id does not exists in the session store', (done) => {
    chai
      .request(app)
      .get('/room/1/questions')
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
