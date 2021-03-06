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
    .set('x-auth', users[0].tokens[0].token)
    .send({text})  // sending data
    .expect(200)
    .expect((res) => {   // custom expect calls
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
    .set('x-auth', users[0].tokens[0].token)
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
    .set('x-auth', users[0].tokens[0].token)
    .expect(200)
    .expect((res) => {   // custum expect calls
      expect(res.body[0].text).toBe(todos[0].text);
    })
    .end(done);
  });
});


describe('GET /todos/id', () => {
  it('should get the specific todo', (done) => {
    request(app)
    .get(`/todos/${todos[0]._id.toHexString()}`)
    .set('x-auth', users[0].tokens[0].token)
    .expect(200)
    .expect((res) => {
      expect(res.body.todo.text).toBe(todos[0].text);
    })
    .end(done);

  });

  it('should get the 404 on accessing someone specific todo', (done) => {
    request(app)
    .get(`/todos/${todos[1]._id.toHexString()}`)
    .set('x-auth', users[0].tokens[0].token)
    .expect(404)
    .end(done);

  });

  it('should get the 404 on having inavlid id', (done) => {
    request(app)
    .get('/todos/123')
    .set('x-auth', users[0].tokens[0].token)
    .expect(404)
    .end(done);
  });

  it('should return 404 on having id not present in collections', (done) => {
    var hexId = new ObjectId().toHexString();

    request(app)
    .get(`/todos/${hexId}`)
    .set('x-auth', users[0].tokens[0].token)
    .expect(404)
    .end(done);
  });
});


describe('DELETE /todos/id', () => {
  it('should delete a specific todo', (done) => {
    request(app)
    .delete(`/todos/${todos[0]._id.toHexString()}`)
    .set('x-auth', users[0].tokens[0].token)
    .expect(200)
    .expect((res) => {
      expect(res.body.todo.text).toBe(todos[0].text);
    })
    .end(done);
  });

  it('should get the 404 on deleting someone specific todo', (done) => {
    request(app)
    .delete(`/todos/${todos[1]._id.toHexString()}`)
    .set('x-auth', users[0].tokens[0].token)
    .expect(404)
    .end(done);

  });

  it('should get the 404 on having inavlid id', (done) => {
    request(app)
    .delete('/todos/123')
    .set('x-auth', users[0].tokens[0].token)
    .expect(404)
    .end(done);
  });

  it('should return 404 on having id not present in collections', (done) => {
    var hexId = new ObjectId().toHexString();

    request(app)
    .delete(`/todos/${hexId}`)
    .set('x-auth', users[0].tokens[0].token)
    .expect(404)
    .end(done);
  });
});


describe('UPDATE /todos/id', () => {

  it('should UPDATE a specific todo', (done) => {

    var text = "helllooooo";
    request(app)
    .patch(`/todos/${todos[0]._id.toHexString()}`)
    .set('x-auth', users[0].tokens[0].token)
    .send({text})
    .expect(200)
    .expect((res) => {
      expect(res.body.todo.text).toBe(text);
      expect(res.body.todo.completed).toBe(false);
      expect(res.body.todo.completedAt).toBe(null);
    })
    .end(done);
  });

  it('should get the 404 on updating someone specific todo', (done) => {
    var text = "helllooooo";
    request(app)
    .delete(`/todos/${todos[1]._id.toHexString()}`)
    .set('x-auth', users[0].tokens[0].token)
    .send({text})
    .expect(404)
    .end(done);

  });

  it('should UPDATE that a specific todo is completed', (done) => {
    request(app)
    .patch(`/todos/${todos[0]._id.toHexString()}`)
    .set('x-auth', users[0].tokens[0].token)
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
    .patch('/todos/123')
    .set('x-auth', users[0].tokens[0].token)
    .expect(404)
    .end(done);
  });

  it('should return 404 on having id not present in collections', (done) => {
    var hexId = new ObjectId().toHexString();

    request(app)
    .patch(`/todos/${hexId}`)
    .set('x-auth', users[0].tokens[0].token)
    .expect(404)
    .end(done);
  });
});

describe('GET /users/me ', () => {

    it('should return the user if authenticated', (done) => {
      request(app)
      .get('/users/me')
      .set('x-auth', users[0].tokens[0].token)
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
        }).catch((e) => done(e));
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

describe('POST /users/login', () => {

  it('should display the user if password matched', (done) => {

    request(app)
    .post('/users/login')
    .send({email : users[1].email, password : users[1].password})
    .expect(200)
    .expect((res) => {
      expect(res.headers['x-auth']).toBeTruthy();
      expect(res.body._id).toBeTruthy();
      expect(res.body.email).toBe(users[1].email);
    })
    .end((err, res) => {
      if(err){
        return done(err);
      }

      User.findById(users[1]._id).then((user) => {
        expect(user.tokens[1]).toMatchObject({
          access : 'auth',
          token : res.headers['x-auth']
        });
        done();
      }).catch((e) => done(e));

    });
  });

  it('should display error when password not matched', (done) => {
    request(app)
    .post('/users/login')
    .send({email : users[1].email, password : users[1].password + 'abc'})
    .expect(400)
    .expect((res) => {
      expect(res.headers['x-auth']).not.toBeTruthy();
    })
    .end((err, res) => {
      if(err){
        return done(err);
      }

      User.findById(users[1]._id).then((user) => {
        expect(user.tokens.length).toBe(1);
        done();
      }).catch((e) => done(e));

    });
  });

  it('should display error when email not matched', (done) => {
    request(app)
    .post('/users/login')
    .send({email : users[1].email + 'abc', password : users[1].password})
    .expect(400)
    .end(done);
  });

});

describe('DELETE /users/me/token', () => {

  it('should delete the token of the specified user', (done) => {
    request(app)
    .delete('/users/me/token')
    .set('x-auth', users[0].tokens[0].token)
    .expect(200)
    .end((err, res) => {
          if(err){
            return done(err);
          }
          User.findById(users[0]._id).then((user) => {
            expect(user.tokens.length).toBe(0);
            done();
          }).catch((e) => done(e));
        }
      );
  });

});
