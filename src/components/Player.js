import Scoring from './Scoring';

class Player {
  constructor() {
    this.plays = []
    this.scorer = new Scoring()
  }

  totalScore = () => {
    let total = 0;
    this.plays.forEach((word) => {
      total += this.scorer.score(word);
    });

    return total;
  }

  hasWon = () => {
    let total = this.totalScore();

    return total >= 100;
  }

  play = (word) => {
    let checkedWord = this.scorer.checkForValidWord(word);
    if (this.hasWon()) {
      return false;
    } else {
      this.plays.push(checkedWord);
      return checkedWord; // not sure if this is the functionality wanted
    }
  }

  highestScoringWord = () => {
    return this.scorer.highestScoreFrom(this.plays);
  }

  highestWordScore() {
    let highestWord = this.highestScoringWord();

    return this.scorer.score(highestWord);
  }

}

export default Player;
