const MongoClient = require('mongodb').MongoClient;

var a = 7;
MongoClient.connect('mongodb://localhost:27017/', (err, client) =>  {
  if (err) {
    return console.log('Unable to connect to mongo db server');
  }
  console.log('Connected to mongoDB server');
  var db = client.db('TodoApp');

  //deleteMany
  db.collection('Todos').deleteMany({name : 'Ayushi'}).then((result) => {
    console.log(result);
  });

  for(var i = 0; i < 3; i++){
    db.collection('Todos').insertOne({
      name : 'Ayushi',
      Age : 21
    }, (err, result) => {
      if(err){
         return console.log('Can not be inserted');
      }
      console.log(result);
    })
  }

  // deleteOne
  db.collection('Todos').deleteOne({name : 'Ayushi'}).then((result) => {
    console.log(result);
  });

  db.collection('Todos').findOneAndDelete({name : 'Ayushi'}).then((result) => {
    console.log(result);
  })


  //findOneAndDelete
client.close();
});
