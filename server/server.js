var {ObjectId} = require('mongodb');
var express = require('express');
var bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo.js');
var {User} = require('./models/user.js');

var app = express();

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
  var todo = new Todo({
    text : req.body.text
  });  // create new todo

  todo.save().then((doc) => {
    res.send(doc);  // save the doc and then send in response
  }, (err) => {
    res.status(400).send(err);
  });
});


app.get('/todos', (req, res) => {
  Todo.find().then((todos) => {
    res.send(todos);
  },(err) => {
    res.status(400).send(err);
  } );
});


app.get('/todos/:id', (req, res) => {
  var id = req.params.id;
  if(!ObjectId.isValid(id)){
     return res.status(404).send('404 NOT FOUND');
  }

  Todo.findById(id).then((todo) => {
    if(!todo){
      return res.status(404).send('404 NOT FOUND');
    }
    res.status(200).send({todo});
  }).catch((e) => {
    res.status(400).send('Error');
  });


});

app.listen(3000, () => {
  console.log('app started on server ')
});

module.exports ={app};
