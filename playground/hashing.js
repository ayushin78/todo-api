const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YjEzYTQ4N2JlY2ZkNDI0NDE5ZGM0YWIiLCJhY2Nlc3MiOiJhdXRoIiwiaWF0IjoxNTI4MDEzOTYwfQ.5kKwaxmECg_0amI5XU38hUvgV16V7vv8u5OTP-ULdwE'
var decoded = jwt.verify(token, 'abc123');
console.log(decoded);

// var password = 'abc123';
// var i = 1;
//
// bcrypt.genSalt(10, (err, salt) => {
//   console.log('sal generated ', i);
//   bcrypt.hash(password, salt, (err, hash) => {
//     console.log(hash);
//   });
// })
//
// var hashedPassword = '$2a$10$1RXJfDejdddrEdhsmz.YieM39FrlauX9RBXUcpQFJ6pwP6.zJTgSS';
// bcrypt.compare(password, hashedPassword, (err, res) => {
//   console.log(res);
// });
//
// function function1(id, callback) {
//   var text = `calling function1 ${id}`;
//   console.log(text);
//   callback(text);
// }
// function1(10, (text) => {
//   console.log('calling callback', text);
// } );

// var message = 'I am user number 3';
// var hash = SHA256(message).toString();
//
// console.log(`Message : ${message}`);
// console.log(`Hash : ${hash}`);
// var data = {
//   id : 10
// };
//
// var token = jwt.sign(data, 'abc123');
// console.log(token);
//
// var decoded = jwt.verify(token, 'abc123');
// console.log(decoded);
