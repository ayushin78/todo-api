const MongoClient = require('mongodb').MongoClient;

var a = 7;
MongoClient.connect('mongodb://localhost:27017/', (err, client) =>  {
  if (err) {
    return console.log('Unable to connect to mongo db server');
  }
  console.log('Connected to mongoDB server');
  var db = client.db('TodoApp');

  var data = [];
var a= 5;
  db.collection('Todos').find().toArray().then((docs) => {
    console.log(a);
    // console.log(JSON.stringify(docs, undefined, 2));
    data = docs;
    a = 6;
  }, (err) => {
    console.log('unable to fetch todos');
  });
console.log(a);
client.close();
});
