const {ObjectId} = require('mongodb');
const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user')

const {todos, populateTodos, users, populateUsers} = require('./seed/seed');

beforeEach(populateTodos)
beforeEach(populateUsers);

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

describe('GET /users/me ', () => {
    it('should return the user if authenticated', (done) => {
      request(app)
      .get('/users/me')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
          expect(res.body._id).toBe(users[0]._id.toHexString());
          expect(res.body.email).toBe(users[0].email);
      })
      .end(done);
    });

    it('should not the user if not authenticated', (done) => {
      request(app)
      .get('/users/me')
      .expect(401)
      .expect((res) => {
          expect(res.body).toEqual({});
      })
      .end(done);
    });
});

describe('POST /users ', () => {
    it('should create a user', (done) => {
      var email = 'truth@gmail.com';
      var password = 'truth123';

      request(app)
      .post('/users')
      .send({email, password})
      .expect(200)
      .expect((res) => {
          expect(res.headers['x-auth']).toBeTruthy();
          expect(res.body._id).toBeTruthy();
          expect(res.body.email).toBe(email);
      })
      .end((err) => {
        if(err){
          return done(err);
        }

        User.findOne({email}).then((user) => {
          expect(user).toBeTruthy();
          expect(user.password).not.toBe(password);
           done();
        });
      });
    });

    it('should not create the user if email is already registered', (done) => {
      request(app)
      .post('/users')
      .send({email : users[0].email, password : users[0].password})
      .expect(400)
      .end(done);
    });

    it('should not create the user if email valiadtion fails', (done) => {
      request(app)
      .post('/users')
      .send({email : 'abc', password : 'absjgyrdtrdf'})
      .expect(400)
      .end(done);
    });

    it('should not create the user if email valiadtion fails', (done) => {
      request(app)
      .post('/users')
      .send({email : 'testing@gmail.com', password : 'absj'})
      .expect(400)
      .end(done);
    });


});
