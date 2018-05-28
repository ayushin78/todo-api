const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

var userSchema = new mongoose.Schema({
  email : {
    type : String,
    required : true,
    trim : true,
    minlength : 1,
    unique : true,
    validate : {
      validator : (email) => {
          return validator.isEmail(email);
      },
      message : '{VALUE} is not a valid emaid id'
    }
  },
  password : {
    type : String,
    required : true,
    minlength : 6
  },
  tokens : [{
    access : {
      type : String,
      required : true
    },
    token : {
      type : String,
      required : true
    }
  }]
});

userSchema.methods.toJSON = function(){
    var user = this;
    var userObject = user.toObject();

    return _.pick(userObject, ['_id', 'email']);
}

userSchema.methods.generateAuthToken = function () {
  var user = this;
  //Used normal function instead of arrow coz
  //this keyword is not allowed in arrow function

  var access = 'auth';

  var token = jwt.sign({ _id : user._id, access}, 'abc123');
  user.tokens.push({access, token});

  return user.save().then(() => {
    return token;
  });
}

userSchema.statics.findByToken = function(token) {
  var user = this;
  var decoded;

  try{
    decoded = jwt.verify(token, 'abc123');
  } catch(err){
    return Promise.reject();
  }

  return User.findOne({
    _id : decoded._id
  });
};

userSchema.pre('save', function (next) { // pre is used as middleware and will
  // be executed everytime a save is used

  var user = this;

  if(user.isModified('password')){
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(user.password, salt, (err, hash) => {
          user.password = hash;
          next();
        });
      });
  } else{
    next();
  }
});

var User = mongoose.model('User', userSchema);

module.exports = {User};
