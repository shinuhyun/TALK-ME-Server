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

describe('Room PATCH API', () => {
  let agent = null;
  beforeEach(async () => {
    // Setup/TearDown : Check Fixtures folder
    await sequelize.sync({ force: true });
    await User.create(usersFixture[0]);
    await User.create(usersFixture[1]);
    await Room.create(roomsFixture[0]);
    await Room.create(roomsFixture[1]);
    await Question.create(questionsFixture[0]);
    await Question.create(questionsFixture[1]);
    await Question.create(questionsFixture[2]);

    agent = chai.request.agent(app);
    await agent
      .post('/auth/login')
      .send({ email: 'example@gmail.com', password: '1234' });
  });

  describe('PATCH /room', () => {
    let data = null;
    beforeEach(() => {
      data = {
        roomId: 1,
        title: 'modify title',
        description: 'modify description',
        questions: ['modify question1', 'modify question2'],
      };
    });

    it('should respond Success with session id', (done) => {
      agent
        .patch('/room')
        .send(data)
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res.body.message).to.equal('Room is edited');
          return agent.get('/room/1').then((res2) => {
            delete data.roomId;
            data.id = 1;
            data.questions = data.questions.map((text, index) => ({
              id: index + 4,
              text,
            }));
            expect(res2.body).to.deep.includes(data);
            done();
          });
        })
        .catch((err) => {
          done(err);
        });
    });

    it('should respond NOT FOUND with roomId not in DB', (done) => {
      data.roomId = 100;
      agent
        .patch('/room')
        .send(data)
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
      data.roomId = 2;
      agent
        .patch('/room')
        .send(data)
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
        .patch('/room')
        .send(data)
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
