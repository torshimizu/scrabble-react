import React, { Component } from 'react';

class Tile extends Component {
  constructor() {
    super();
    this.tiles = this.makeArrayOfAvailableLetters();
  }

  static LETTERS = {
    "a": { "points":  1, "tiles":  9 },
    "b": { "points":  3, "tiles":  2 },
    "c": { "points":  3, "tiles":  2 },
    "d": { "points":  2, "tiles":  4 },
    "e": { "points":  1, "tiles": 12 },
    "f": { "points":  4, "tiles":  2 },
    "g": { "points":  2, "tiles":  3 },
    "h": { "points":  4, "tiles":  2 },
    "i": { "points":  1, "tiles":  9 },
    "j": { "points":  8, "tiles":  1 },
    "k": { "points":  5, "tiles":  1 },
    "l": { "points":  1, "tiles":  4 },
    "m": { "points":  3, "tiles":  2 },
    "n": { "points":  1, "tiles":  6 },
    "o": { "points":  1, "tiles":  8 },
    "p": { "points":  3, "tiles":  2 },
    "q": { "points": 10, "tiles":  1 },
    "r": { "points":  1, "tiles":  6 },
    "s": { "points":  1, "tiles":  4 },
    "t": { "points":  1, "tiles":  6 },
    "u": { "points":  1, "tiles":  4 },
    "v": { "points":  4, "tiles":  2 },
    "w": { "points":  4, "tiles":  2 },
    "x": { "points":  8, "tiles":  1 },
    "y": { "points":  4, "tiles":  2 },
    "z": { "points": 10, "tiles":  1 },
    "blank": { "tiles": 2}
  }

  makeArrayOfAvailableLetters() {
    let availableLetters = []

    Object.keys(Tile.LETTERS).forEach((letter) => {
      for (let i = 0; i < Tile.LETTERS[letter]['tiles']; i += 1) {
        availableLetters.push(letter);
      }
    });

    return availableLetters;
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
    // let that = this;

    for (let i = 0; i < num; i += 1) {
      let randIndex = Math.floor(Math.random() * this.tiles.length);

      tiles.push(this.tiles.splice(randIndex, 1));
    }

    return tiles;
  }


  render() {
    return (
      <div className="tile">
        {this.drawTiles(7).map((letter, index) => {
          return <p key={index}>{letter}</p>
        })}
      </div>
    );
  }
}

export default Tile;
