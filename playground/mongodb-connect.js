const MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/', (err, client) =>  {
  if (err) {
    return console.log('Unable to connect to mongo db server');
  }
  console.log('Connected to mongoDB server');
  var db = client.db('TodoApp');

//   db.collection('Todos').insertOne({
//     text : 'something to do',
//     completed : 'false'
//   }, (err, result) => {
//     if(err){
//       return console.log('Unable to insert todo', err);
//     }
//     console.log(JSON.stringify(result.ops, undefined, 2));
//   });
//   client.close();
// });


  db.collection('Users').insertOne({
    _id : 123,
    name : 'Ayushi',
    age : 21,
    location : 'Delhi'
  }, (err, result) => {
    if(err){
      return console.log('Unable to insert User', err);
    }
    console.log(JSON.stringify(result.ops, undefined, 2));

  });

client.close();
});
