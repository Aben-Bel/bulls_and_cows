const correct = (yourSecretNum, theirGuess) => {
  const identified = theirGuess.split('').reduce((acc, curVal) => {
    if (yourSecretNum.includes(curVal)) {
      return acc + 1;
    }
    return acc;
  }, 0);
  const position = theirGuess.split('').reduce((acc, curVal, index) => {
    if (curVal === yourSecretNum[index]) {
      return acc + 1;
    }
    return acc;
  }, 0);
  return { i: identified, p: position };
};
