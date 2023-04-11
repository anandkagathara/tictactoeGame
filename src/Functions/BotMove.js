const BotMove = (GameData, Remaining) => {
  const Winning = [
    ["A1", "A2", "A3"],
    ["B1", "B2", "B3"],
    ["C1", "C2", "C3"],
    ["A1", "B1", "C1"],
    ["A2", "B2", "C2"],
    ["A3", "B3", "C3"],
    ["A1", "B2", "C3"],
    ["A3", "B2", "C1"]
  ]
  let Move

  const player = GameData.score.find(item => item.name !== "BOT")
  const BOT = GameData.score.find(item => item.name === "BOT")
  const playerMoves = player?.Places || []
  
  if (playerMoves.length === 0) {
    Move = "B2"
  }

  if (playerMoves.length === 1) {
    let Playermove = player?.Places[0]
    if (Playermove !== "B2") {
      Move = "B2"
    }
  }
  if (playerMoves.length === 2) {
    let Playermove = player.Places
    for (let index = 0; index < Winning.length; index++) {
      let element = Winning[index]  
      let result = Playermove.every(item => element.includes(item))
      if (result === true) {
        if (Playermove.includes(element[0]) === false) {
          Move = element[0]
        }
        if (Playermove.includes(element[1]) === false) {
          Move = element[1]
        }
        if (Playermove.includes(element[2]) === false) {
          Move = element[2]
        }
      }
    }
  }

  if (playerMoves.length === 3) {
    let weWin
    let OurPlaces = GameData.score[1].Places
    for (let index = 0; index < Winning.length; index++) {
      let element = Winning[index]
      let result = OurPlaces.every(item => element.includes(item))
      if (result === true) {
        if (OurPlaces.includes(element[0]) === false) {
          weWin = element[0]
        }
        if (OurPlaces.includes(element[1]) === false) {
          weWin = element[1]
        }
        if (OurPlaces.includes(element[2]) === false) {
          weWin = element[2]
        }
      }
    }

    if (Remaining.includes(weWin) === true) {
      Move = weWin
    } else {
      let Test1
      let Playermove1 = [player.Places[0], player.Places[1]]
      for (let index = 0; index < Winning.length; index++) {
        let element = Winning[index]
        let result = Playermove1.every(item => element.includes(item))

        if (result === true) {
          if (Playermove1.includes(element[0]) === false) {
            Test1 = element[0]
          }
          if (Playermove1.includes(element[1]) === false) {
            Test1 = element[1]
          }
          if (Playermove1.includes(element[2]) === false) {
            Test1 = element[2]
          }
          if (Remaining.includes(Test1)) {
            Move = Test1
          }
        }
      }
      let Test2
      let Playermove2 = [player.Places[1], player.Places[2]]
      for (let index = 0; index < Winning.length; index++) {
        let element = Winning[index]
        let result = Playermove2.every(item => element.includes(item))

        if (result === true) {
          if (Playermove2.includes(element[0]) === false) {
            Test2 = element[0]
          }
          if (Playermove2.includes(element[1]) === false) {
            Test2 = element[1]
          }
          if (Playermove2.includes(element[2]) === false) {
            Test2 = element[2]
          }
          if (Remaining.includes(Test2)) {
            Move = Test2
          }
        }
      }

      let Test3
      let Playermove3 = [player.Places[0], player.Places[2]]
      for (let index = 0; index < Winning.length; index++) {
        let element = Winning[index]
        let result = Playermove3.every(item => element.includes(item))

        if (result === true) {
          if (Playermove3.includes(element[0]) === false) {
            Test3 = element[0]
          }
          if (Playermove3.includes(element[1]) === false) {
            Test3 = element[1]
          }
          if (Playermove3.includes(element[2]) === false) {
            Test3 = element[2]
          }
          if (Remaining.includes(Test3)) {
            Move = Test3
          }
        }
      }
    }
  }
  //playerMoves.length === 4;
  if (playerMoves.length === 4) {
    //Remaining Items checking in win
    for (let index = 0; index < Remaining.length; index++) {
      let Remainingele = Remaining[index]
      for (let j = 0; j < Winning.length; j++) {
        let winelel = Winning[j]
        if (winelel.includes(Remainingele) === true) {
          if (winelel.every(v => playerMoves.includes(v)) === true) {
            // console.log((Move = Remainingele))
          }
        }
      }
    }
  }
  if (Move && Remaining.includes(Move)) {
    return Move
  }

  if (!Move) {
    const RandomMove = Remaining => {
      let min = Math.ceil(0)
      let max = Math.floor(Remaining.length)
      let index = Math.floor(Math.random() * (max - min) + min)
      if (index < 0) {
        index + 1
      }
      return Remaining[index]
    }
    Move = RandomMove(Remaining)
  }
}


module.exports= BotMove
