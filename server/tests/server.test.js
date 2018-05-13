const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

beforeEach((done) => {
  Todo.remove({}).then(() => done());
});

describe('POST /todos', () => {
  it('should create a new todo', (done) => {
    var text = 'Test todo text';

    request(app)
    .post('/todos')
    .send({text})  // sending data
    .expect(200)
    .expect((res) => {   // custum expect calls
      expect(res.body.text).toBe(text)
    })
    .end((err, res) => {
      if(err){
        return done(err);
      }

      Todo.find().then((todos) =>{
        expect(todos.length).toBe(1);
        expect(todos[0].text).toBe(text);
        done();
      }).catch((e) => done(e));
    });
  });


  it('Should not create data when bad request is made', (done) => {

    request(app)
    .post('/todos')
    .send({})  // sending empty data
    .expect(400)
    .end((err, res) => {
      if(err){
        return done(err);
      }

      Todo.find().then((todos) =>{
        expect(todos.length).toBe(1);
        done();
      }).catch((e) => done(e));
    });
  });
});
