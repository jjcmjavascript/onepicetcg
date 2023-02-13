const results = [
  { name: 'rock', beats: 'scissors' },
  { name: 'paper', beats: 'rock' },
  { name: 'scissors', beats: 'paper' },
];

const evaluateRockPaperScissors = (playerA, playerB) => {
  const playerAResult = results.find(
    (result) => result.name === playerA.rockPaperScissorChoice
  );
  const playerBResult = results.find(
    (result) => result.name === playerB.rockPaperScissorChoice
  );

  if (playerAResult.beats === playerBResult.name) {
    return playerA;
  }
  if (playerBResult.beats === playerAResult.name) {
    return playerB;
  }

  return null;
};

module.exports = {
  evaluateRockPaperScissors,
};
