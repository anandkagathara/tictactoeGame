const isOver = (GameData) => {
  let Starter = GameData.Starter;
  let Result;
  let Finding = GameData.score.find((item) => item.name === Starter);
  if (Finding) {
    Finding = Finding.Places.length;
    if (Finding === 5) {
      Result = true;
    } else {
      Result = false;
    }
  } else {
    Result = false;
  }
  return Result;
};

module.exports = isOver
