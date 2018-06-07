import React, { Component } from 'react';
import BoardView from './components/BoardView';
import Player from './components/Player';
import LETTERS from './components/Letters';
import './App.css';

Array.prototype.shuffle = function arrayShuffle() {
  for (let i = this.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [this[i], this[j]] = [this[j], this[i]];
  }
  return this;
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      allTiles: this.makeArrayOfAllLetters(),
      player1: new Player(),
      player1Tiles: null,
      player2: new Player(),
      player2Tiles: null
    }
  }

  makeArrayOfAllLetters() {
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

    if (num > this.state.allTiles.length) {
      throw new Error('Not enough tiles');
    }

    let tiles = [];
    for (let i = 0; i < num; i += 1) {
      tiles.push(this.state.allTiles.pop());
    }

    return tiles;
  }

  componentDidMount = () => {
    this.setState({player1Tiles: this.drawTiles(7)});
    this.setState({player2Tiles: this.drawTiles(7)});
  }

  render() {
    console.log(this.state);
    return (
      <div className="App">
        <h1>Let's Play Scrabble!</h1>
        <BoardView />
      </div>
    );
  }
}

export default App;
