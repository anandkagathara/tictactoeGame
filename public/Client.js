document.getElementById("titleGame").innerHTML = "Tic Tac Toe Game";
const bordV = [1, 2, 3];
const bordH = ["A", "B", "C"];
const socket = io();
let USERNAME;
let GAMEID;
let OngoingGameData;
let Remaining;
let Opponent;

let findOpponent = () => {
  Opponent = OngoingGameData.score.find((item) => item.name !== USERNAME);
  Opponent = Opponent.name;
  document.getElementById("Opponent").innerHTML = `Opponent : ${Opponent}`;
};

const arrangePlaces = async () => {
  OngoingGameData.score.forEach((item) => {
    for (let index = 0; index < item.Places.length; index++) {
      const Ongoing = item.Places[index];
      let HTML;
      if (item.name === USERNAME) {
        HTML = "O";
      } else {
        HTML = "X";
      }
      document.getElementById(Ongoing).innerHTML = HTML;
    }
  });
};

const checkIsvalidMove = (id) => {
  let result;
  let Array1 = OngoingGameData.score[0].Places.includes(id);
  let Array2 = OngoingGameData.score[1].Places.includes(id);

  if (Array1 === true || Array2 === true) {
    result = "invalid";
  } else {
    result = "valid";
  }
  return result;
};

let gamebord = ``;

for (let index = 0; index < bordV.length; index++) {
  const element = bordV[index];
  let verticle = ``;
  for (let j = 0; j < bordH.length; j++) {
    let Background = "light";

    if (index % 2 !== 0 && j % 2 === 0) {
      Background = "dark";
    }
    if (j % 2 !== 0 && index % 2 === 0) {
      Background = "dark";
    }
    const element2 = bordH[j];
    verticle =
      verticle +
      `<div class="items ${Background}" id=${
        element2 + element
      } onclick="check('${element2 + element}')"  ></div>`;
  }
  gamebord = gamebord + `<div class="hlines">${verticle}</div>`;
}

document.getElementById("gameBoard").innerHTML = gamebord;

const check = (id) => {
  if (OngoingGameData && OngoingGameData.Turn === USERNAME) {
    let check = checkIsvalidMove(id);

    if (check === "valid") {
      let CheckIsThereData = OngoingGameData.score.find(
        (item) => item.name === USERNAME
      );
      if (CheckIsThereData) {
        CheckIsThereData.Places.push(id);
      } else {
        OngoingGameData.score.push({ name: USERNAME, Places: [id] });
      }

      let index = Remaining.indexOf(id);
      Remaining.splice(index, 1);
      //Change Turn
      let Nextname = OngoingGameData.score.find(
        (item) => item.name !== USERNAME
      );
      Nextname = Nextname.name;
      OngoingGameData.Turn = Nextname;
      arrangePlaces();
      socket.emit("update-turn", {
        gamedata: OngoingGameData,
        remainigdata: Remaining,
      });
    } else {
      window.alert("that is already checked");
    }
  } else {
    document.getElementById("notification").innerHTML =
      "Wait, it's Opponent's Turn";
  }
};

const loginSubmit = () => {
  USERNAME = document.getElementById("username").value;
  if (USERNAME.length > 2) {
    socket.emit("new-login", USERNAME);
    document.getElementById("loginpage").style.display = "none";
    document.getElementById("gameBoardpage").style.display = "flex";
  } else {
    window.alert("Name Shoudbe Morethan 5 Latters");
  }
};
const loadpage = () => {
  window.location = "http://localhost:7000/";
};

//Socket Events
socket.on("game-create", (item) => {
  OngoingGameData = item.gamedata;
  Remaining = item.remainigdata;
  document.getElementById("Owner").innerHTML = USERNAME;
  findOpponent();
  document.getElementById("notification").innerHTML =
    OngoingGameData.Turn + "'s Move";
});

socket.on("reading-new-moves", (item) => {
  OngoingGameData = item.gamedata;
  Remaining = item.remainigdata;
  document.getElementById("notification").innerHTML =
    OngoingGameData.Turn + "'s Move";
  arrangePlaces();
});

socket.on("game-over", async (item) => {
  console.log("Game Over");
  OngoingGameData = item.gamedata;
  Remaining = item.remainigdata;
  document.getElementById("notification").innerHTML =
    OngoingGameData.Turn + "'s Move";
  await arrangePlaces();
  window.alert(`game over but, still no one is winner`);
  setTimeout(loadpage, 1000);
});

socket.on("found-winner", async (item) => {
  console.log(`${item.winner} is winner`);
  OngoingGameData = item.gamedata;
  Remaining = item.remainigdata;
  document.getElementById("notification").innerHTML =
    OngoingGameData.Turn + "'s Move";
  await arrangePlaces();
  window.alert(`${item.winner} is winner`);
  setTimeout(loadpage, 1000);
});
