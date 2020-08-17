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

describe('RoomList GET API', () => {
  beforeEach(async () => {
    // Setup/TearDown : Check Fixtures folder
    await sequelize.sync({ force: true });
    await User.create(usersFixture[0]);
    await User.create(usersFixture[2]);
    await Room.create(roomsFixture[0]);
    await Question.create(questionsFixture[0]);
    await Question.create(questionsFixture[1]);
  });

  describe('GET /roomList', () => {
    const data = {
      rooms: [{ id: 1, title: 'room1', questionCount: 2 }],
    };

    it('should respond Success with session id', (done) => {
      const agent = chai.request.agent(app);
      agent
        .post('/auth/login')
        .send({ email: 'example@gmail.com', password: '1234' })
        .then(() => {
          return agent.get('/roomList').then((res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.deep.equal(data);
            done();
          });
        })
        .catch((err) => {
          done(err);
        });
    });

    it('should respond empty array if does not found roomList', (done) => {
      const agent = chai.request.agent(app);
      agent
        .post('/auth/login')
        .send({ email: 'lav@gmail.com', password: '3333' })
        .then(() => {
          return agent.get('/roomList').then((res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.deep.equal({ rooms: [] });
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
        .get('/roomList')
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
