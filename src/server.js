const Users = require("./Model/Users");
const Games = require("./Model/Game");
const isOver = require("./Functions/isOver");
const checkitfinal = require("./Functions/isWinner");
const BotMove = require("./Functions/BotMove");
const createUser = require("./Dbfunctions/Createuser");
const deleteGame = require("./Dbfunctions/deleteGame");
const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

dotenv.config();
const port = 7000;
const app = express();
const serverOptions = { cors: { origin: "*" } };
const httpServer = http.createServer(app);
const io = new Server(httpServer, serverOptions);

const location = path.join(__dirname, "../") + "/public/";

app.use(cors());
app.use(express.json());
app.use(express.static(location));

app.get("/", (req, resp) => {
  resp.sendFile(path.join(location, "index.html"));
});
let GameData = {
  Turn: undefined,
  score: undefined,
  gameid: undefined,
  Starter: undefined,
};
let Remaining = ["A1", "A2", "A3", "B1", "B2", "B3", "C1", "C2", "C3"];

io.on("connection", (socket) => {
  socket.on("new-login", async (username) => {
    let isUserAdded = await createUser(username, socket.id);

    if (isUserAdded) {
      let createGame = new Games({
        playerOne: isUserAdded._id,
        playerOneSid: isUserAdded.socketid,
        secondPlayer: "BOT",
      });
      createGame = await createGame.save();

      if (createGame) {
        let Starter = await Users.findById(createGame.playerOne);
        let StarterName;
        if (Starter) {
          StarterName = Starter.username;
        }

        // let NextPlayerName = "BOT";

        GameData = {
          gameid: createGame._id,
          Turn: StarterName,
          Starter: StarterName,
          score: [
            { name: StarterName, Places: [] },
            { name: "BOT", Places: [] },
          ],
        };
        io.to(socket.id).emit("game-create", {
          gamedata: GameData,
          remainigdata: Remaining,
        });
      }
    }
  });

  socket.on("update-turn", async (data) => {
    GameData = data.gamedata;
    Remaining = data.remainigdata;
    const resultisOver = isOver(GameData);
    if (resultisOver) {
      let IsWinner = checkitfinal(GameData);
      if (IsWinner) {
        io.to(socket.id).emit("found-winner", {
          gamedata: GameData,
          remainigdata: Remaining,
          winner: IsWinner,
        });
        GameData = {};
        Remaining = ["A1", "A2", "A3", "B1", "B2", "B3", "C1", "C2", "C3"];
        console.log("Winner name is : ", IsWinner);
        await deleteGame(socket.id);
      } else {
        // console.log(resultisOver);
        console.log("Game over but, still no one is winner");

        io.to(socket.id).emit("game-over", {
          gamedata: GameData,
          remainigdata: Remaining,
        });
        GameData = {};
        Remaining = ["A1", "A2", "A3", "B1", "B2", "B3", "C1", "C2", "C3"];
        await deleteGame(socket.id);
      }
    } else {
      let IsWinner = checkitfinal(GameData);
      if (IsWinner) {
        io.to(socket.id).emit("found-winner", {
          gamedata: GameData,
          remainigdata: Remaining,
          winner: IsWinner,
        });
        GameData = {};
        Remaining = ["A1", "A2", "A3", "B1", "B2", "B3", "C1", "C2", "C3"];
        console.log("Winner name is : ", IsWinner);
        await deleteGame(socket.id);
      } else {
        if (GameData.Turn === "BOT") {
          let Findbotmove = BotMove(GameData, Remaining);
          // if (Findbotmove) {
          //   console.log(Findbotmove);
          // }
          if (!Findbotmove) {
            const RandomMove = (Remaining) => {
              let min = Math.ceil(0);
              let max = Math.floor(Remaining.length);
              let index = Math.floor(Math.random() * (max - min) + min);
              if (index < 0) {
                index + 1;
              }
              return Remaining[index];
            };
            Findbotmove = RandomMove(Remaining);
          }

          let CheckIsThereData = GameData.score.find(
            (item) => item.name === "BOT"
          );
          if (CheckIsThereData) {
            CheckIsThereData.Places.push(Findbotmove);
          } else {
            GameData.score.push({ name: "BOT", Places: [Findbotmove] });
          }
          let index = Remaining.indexOf(Findbotmove);
          Remaining.splice(index, 1);
          //Change Turn
          let Nextname = GameData.score.find((item) => item.name !== "BOT");
          Nextname = Nextname.name;
          GameData.Turn = Nextname;

          const resultisOver = isOver(GameData);
          if (resultisOver) {
            console.log("game is Over", resultisOver);
            io.to(socket.id).emit("game-over", {
              gamedata: GameData,
              remainigdata: Remaining,
            });
            GameData = {};
            Remaining = ["A1", "A2", "A3", "B1", "B2", "B3", "C1", "C2", "C3"];
            await deleteGame(socket.id);
          } else {
            let IsWinner = checkitfinal(GameData);
            if (IsWinner) {
              io.to(socket.id).emit("found-winner", {
                gamedata: GameData,
                remainigdata: Remaining,
                winner: IsWinner,
              });
              GameData = {};
              Remaining = [
                "A1",
                "A2",
                "A3",
                "B1",
                "B2",
                "B3",
                "C1",
                "C2",
                "C3",
              ];
              console.log("Winner name is : ", IsWinner);
              await deleteGame(socket.id);
            } else {
              io.to(socket.id).emit("reading-new-moves", {
                gamedata: GameData,
                remainigdata: Remaining,
              });
            }
          }
        }
      }
    }
  });

  //Closing Game Here
  socket.on("disconnect", async (reason) => {
    GameData = {};
    Remaining = ["A1", "A2", "A3", "B1", "B2", "B3", "C1", "C2", "C3"];
    await deleteGame(socket.id);
  });
});

httpServer.listen(port, () => {
  console.log(`Server is running on 7000`);
});
