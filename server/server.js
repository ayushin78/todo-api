const {ObjectId} = require('mongodb');
const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo.js');
var {User} = require('./models/user.js');

var app = express();

app.use(bodyParser.json());
const port = process.env.PORT || 3000;



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

app.delete('/todos/:id', (req, res) => {
  var id = req.params.id;

  if(!ObjectId.isValid(id)){
     return res.status(404).send('404 NOT FOUND');
  }

  Todo.findByIdAndRemove(id).then((todo) => {
    if(!todo){
      return res.status(404).send('404 NOT FOUND');
    }
    res.status(200).send({todo});
  }).catch((e) => {
    res.status(400).send('Error');
  });
});

app.patch('/todos/:id', (req, res) => {
  var id = req.params.id;
  var body = _.pick(req.body, ['text', 'completed']);

  if(!ObjectId.isValid(id)){
     return res.status(404).send('404 NOT FOUND');
  }

  if(_.isBoolean(body.completed) && body.completed){
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findByIdAndUpdate(id, {$set : body}, {new : true}, ).then((todo) => {
    if(!todo){
      return res.status(404).send('404 NOT FOUND');
    }
    res.status(200).send({todo});
  }).catch((e) => {
    res.status(400).send('Error');
  });
});


app.listen(port, () => {
  console.log(`app started on server ${port}`);
});

module.exports ={app};
