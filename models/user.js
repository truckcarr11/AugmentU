const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  targets: []
});

const User = (module.exports = mongoose.model('User', userSchema));

module.exports.getUser = function(username, callback) {
  User.findOne(
    {
      username: username
    },
    callback
  );
};
