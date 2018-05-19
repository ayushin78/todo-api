const {ObjectId} = require('mongodb');
const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

var todos = [{
  _id : new ObjectId(),
  text : 'cooking'
}, {
  _id : new ObjectId(),
  text : 'Programmming'
}];

beforeEach((done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos);
  }).then(() => done());
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

      Todo.find({text}).then((todos) =>{
        expect(todos.length).toBe(1);
        expect(todos[0].text).toBe(text);
        done();
      }).catch((e) => done(e));
    });
  });


  it('should not create a new todo when bad request', (done) => {

    request(app)
    .post('/todos')
    .expect(400)
    .end((err, res) => {
      if(err){
        return done(err);
      }
      Todo.find().then((todos) =>{
        expect(todos.length).toBe(2);
        done();
      }).catch((e) => done(e));
    });
  });
});

describe('GET /todos', () => {
  it('should get the todos', (done) => {
    request(app)
    .get('/todos')
    .expect(200)
    .expect((res) => {   // custum expect calls
      expect(res.body[0].text).toBe(todos[0].text);
      expect(res.body[1].text).toBe(todos[1].text);
    })
    .end(done);
  });
});


describe('GET /todos/id', () => {
  it('should get the specific todo', (done) => {
    request(app)
    .get(`/todos/${todos[0]._id.toHexString()}`)
    .expect(200)
    .expect((res) => {
      expect(res.body.todo.text).toBe(todos[0].text);
    })
    .end(done);

  });

  it('should get the 404 on having inavlid id', (done) => {
    request(app)
    .get('/todos/123')
    .expect(404)
    .end(done);
  });

  it('should return 404 on having id not present in collections', (done) => {
    var hexId = new ObjectId().toHexString();

    request(app)
    .get(`/todos/${hexId}`)
    .expect(404)
    .end(done);
  });
});


describe('DELETE /todos/id', () => {
  it('should delete a specific todo', (done) => {
    request(app)
    .delete(`/todos/${todos[0]._id.toHexString()}`)
    .expect(200)
    .expect((res) => {
      expect(res.body.todo.text).toBe(todos[0].text);
    })
    .end(done);
  });


  it('should get the 404 on having inavlid id', (done) => {
    request(app)
    .delete('/todos/123')
    .expect(404)
    .end(done);
  });

  it('should return 404 on having id not present in collections', (done) => {
    var hexId = new ObjectId().toHexString();

    request(app)
    .delete(`/todos/${hexId}`)
    .expect(404)
    .end(done);
  });
});


describe('UPDATE /todos/id', () => {

  it('should UPDATE a specific todo', (done) => {

    var text = "helllooooo";

    request(app)
    .patch(`/todos/${todos[0]._id.toHexString()}`)
    .send({text})
    .expect(200)
    .expect((res) => {
      expect(res.body.todo.text).toBe(text);
      expect(res.body.todo.completed).toBe(false);
      expect(res.body.todo.completedAt).toBe(null);
    })
    .end(done);
  });

  it('should UPDATE that a specific todo is completed', (done) => {
    request(app)
    .patch(`/todos/${todos[0]._id.toHexString()}`)
    .send({"completed" : true})
    .expect(200)
    .expect((res) => {
      expect(res.body.todo.completed).toBe(true);
      expect(res.body.todo.completedAt).not.toBe(null);
    })
    .end(done);
  });


  it('should get the 404 on having inavlid id', (done) => {
    request(app)
    .delete('/todos/123')
    .expect(404)
    .end(done);
  });

  it('should return 404 on having id not present in collections', (done) => {
    var hexId = new ObjectId().toHexString();

    request(app)
    .delete(`/todos/${hexId}`)
    .expect(404)
    .end(done);
  });
});
