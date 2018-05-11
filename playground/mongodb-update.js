const {MongoClient, ObjectId} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/', (err, client) =>  {
  if (err) {
    return console.log('Unable to connect to mongo db server');
  }
  console.log('Connected to mongoDB server');
  var db = client.db('TodoApp');

  // db.collection('Todos').findOneAndUpdate({
  //   _id : new ObjectId('5af54fbb464007180e66e997')
  // }, {
  //   $set: {
  //     Age : 16
  //   }
  // }, {
  //   returnOriginal : false
  // }).then((result) => {
  //   console.log(result);
  // });

  db.collection('Todos').findOneAndUpdate({
    _id : new ObjectId('5af54f93464007180e66e971')
  }, {
    $set : {
      name : 'Himanshi'
    },
    $inc : {
      Age : 1
    }
  }, {
    returnOriginal : false
  }).then((result) => {
     console.log(result);
  });


client.close();
});
