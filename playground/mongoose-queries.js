const {ObjectId} = require('mongodb');
const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');

var _id = '5af86fba765f8b4f9f53c3a5';

if(!ObjectId.isValid(_id)){
  return console.log('invalid object id');
}


Todo.find().then((todos) => {
  console.log('todos', todos);
}); // return array


Todo.findById({_id}).then((todo) => {
  if(!todo){
    return console.log('id not found', todo);
  }
  console.log('Todo by id', todo);
}); // finds by id

Todo.findOne({_id}).then((todo) => {
  if(!todo){
    return console.log('id not found');
  }
  console.log('Todo by findOne', todo);
}); // find at most one matching


// Todo.where({
//   text : 'cooking'
// }).findOne((err, todo) => {
//   if(err){
//     return console.log('erroroosg');
//   }
//   console.log('todo', todo);
// })
