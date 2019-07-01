
const User = require('./models/User');

function getUsername(userId, callback) {
  User.findById(userId, (err, user) => {
    if(err || !user) {
      callback("NULL");
    }
    callback(user.name);
  });
};

module.exports = {
  getUsername: getUsername
};
