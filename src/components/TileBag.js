import LETTERS from './Letters'



class TileBag {
  constructor() {
    this.tiles = this.makeArrayOfAvailableLetters();
  }

  makeArrayOfAvailableLetters() {
    let availableLetters = []

    Object.keys(LETTERS).forEach((letter) => {
      for (let i = 0; i < LETTERS[letter]['tiles']; i += 1) {
        availableLetters.push(letter);
      }
    });

    return availableLetters.shuffle();
  }

  drawTiles = (num) => {
    const maxTiles = 7;

    if (num > maxTiles) {
      throw new Error('Too many tiles requested');
    }

    if (num > this.tiles.length) {
      throw new Error('Not enough tiles');
    }


    let tiles = [];
    for (let i = 0; i < num; i += 1) {
      // let randIndex = Math.floor(Math.random() * this.tiles.length);

      tiles.push(this.tiles.pop());
    }

    return tiles;
  }
}

export default TileBag;
