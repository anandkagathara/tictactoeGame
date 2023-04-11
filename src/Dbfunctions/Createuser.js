const Users = require("../Model/Users");

const createUser = async (username, socket) => {
  let addUser = new Users({
    username: username,
    socketid: socket
  });
  addUser = await addUser.save();
  return addUser;
}

module.exports = createUser;
