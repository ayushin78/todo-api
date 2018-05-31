const {ObjectId} = require('mongodb');
const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');
const jwt = require('jsonwebtoken');

const todos = [{
  _id : new ObjectId(),
  text : 'cooking'
}, {
  _id : new ObjectId(),
  text : 'Programmming'
}];

const userOneId = new ObjectId();
const userTwoId = new ObjectId();

const users = [{
  _id : userOneId,
  email: 'ayushin78@gmail.com',
  password: 'ayushin78',
  tokens:[{
    access : 'auth',
    token : jwt.sign({_id: userOneId, access : 'auth'}, 'abc123')
  }]
}, {
  _id: userTwoId,
  email: 'kanishk@gmail.com',
  password: 'kanishk'
}];

const populateTodos = (done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos);
  }).then(() => done());
};

const populateUsers = (done) => {
  User.remove({}).then(() => {
    var userOne = new User(users[0]).save();
    var userTwo = new User(users[1]).save();

    return Promise.all([userOne, userTwo]);
  }).then(() => done());

};

module.exports = {todos, populateTodos, users, populateUsers};