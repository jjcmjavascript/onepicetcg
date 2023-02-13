const results = [
  { name: 'rock', beats: 'scissors' },
  { name: 'paper', beats: 'rock' },
  { name: 'scissors', beats: 'paper' },
];

const evalRockPaperScissors = (playerA, playerB) => {
  const playerAResult = results.find(
    (result) => result.name === playerA.rockPaperScissorChoise
  );
  const playerBResult = results.find(
    (result) => result.name === playerB.rockPaperScissorChoise
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
  evalRockPaperScissors,
};
