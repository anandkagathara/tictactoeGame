
const Users = require("../Model/Users");
const Games = require("../Model/Game")

const deleteGame = async (socket) => {
    await Games.findOneAndDelete({ playerOneSid: socket });
    await Users.findOneAndDelete({ socketid: socket });
  };
  
  module.exports = deleteGame;
  