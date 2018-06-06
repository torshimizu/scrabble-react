import Scoring from './Scoring';

class Player {
  constructor() {
    this.plays = [];
  }

  totalScore() {
    let total = 0;
    this.plays.forEach(function(word) {
      total += Scoring.score(word);
    });

    return total;
  }

  hasWon() {
    let total = this.totalScore();

    return total >= 100;
  }

  play(word) {
    let checkedWord = Scoring.checkForValidWord(word);
    if (this.hasWon()) {
      return false;
    } else {
      this.plays.push(checkedWord);
      return checkedWord; // not sure if this is the functionality wanted
    }
  }

  highestScoringWord() {
    return Scoring.highestScoreFrom(this.plays);
  }

  highestWordScore() {
    let highestWord = this.highestScoringWord();

    return Scoring.score(highestWord);
  }

}

export default Player;
