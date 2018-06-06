import LETTERS from './Letters'

class Scoring {
  checkForValidWord(word) {
    let downWord = word.toLowerCase()

    if (!downWord.match(/^[a-z]+$/) || downWord.length > 7 || downWord.length < 1) {
      throw new Error("Invalid Word");
    } else {
      return downWord;
    }
  }

  score(word) {
    let checkedWord = this.checkForValidWord(word);
    let splitWord = checkedWord.split('');
    let total = 0;

    splitWord.forEach(function(letter) {
      total += LETTERS[letter]['points'];
    });

    if (splitWord.length === 7) {
      total += 50;
    }

    return total
  }

  breakTie(word1, word2) {
    switch(true) {
      case (word1.length === 7):
        return word1;
      case (word2.length === 7):
        return word2;
      case (word2.length < word1.length):
        return word2;
      default:
        return word1;
    }
  }


  highestScoreFrom(arrayOfWords) {
    if (arrayOfWords.length < 1) {
      throw new Error ("Not enough words for comparison");
    }

    if (arrayOfWords.length === 1) {
      return arrayOfWords[0];
    }

    let highestWord = arrayOfWords[0];

    arrayOfWords.forEach(function(word){

      if (this.score(word) > this.score(highestWord)) {
        highestWord = word;
      } else if (this.score(word) === this.score(highestWord)) {
        highestWord = this.breakTie(highestWord, word);
      }

    });

    return highestWord;
  }
}

export default Scoring;
