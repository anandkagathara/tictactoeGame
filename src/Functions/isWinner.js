const Winning = [
  ["A1", "A2", "A3"],
  ["B1", "B2", "B3"],
  ["C1", "C2", "C3"],
  ["A1", "B1", "C1"],
  ["A2", "B2", "C2"],
  ["A3", "B3", "C3"],
  ["A1", "B2", "C3"],
  ["A3", "B2", "C1"],
];

let checker = (arr, target) => target.every((v) => arr.includes(v));

const checkitfinal = (GameData) => {
  let winner;
  for (let i = 0; i < Winning.length; i++) {
    const element = Winning[i];
    const player1 = GameData.score[0].Places;
    const player2 = GameData.score[1].Places;

    if (player2.length >= 3) {
      const Player2Check = checker(player2, element);
      if (Player2Check === true) {
        winner = GameData.score[1].name;
      }
    }

    if (player1.length >= 3) {
      const player1Check = checker(player1, element);
      if (player1Check === true) {
        winner = GameData.score[0].name;
      }
    }
  }

  return winner;
};

module.exports = checkitfinal;
