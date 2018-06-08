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
      player1: {
        player: new Player(),
        currentTiles: null,
        name: "Player One"
      },
      player2: {
        player: new Player(),
        currentTiles: null,
        name: "Player Two"
      },
      player1Current: true
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

  // I thought this just runs once??
  componentDidMount = () => {
    this.setState({
      player1: {
        // how do I just change the currentTiles?
        player: this.state.player1.player,
        currentTiles: this.drawTiles(7),
        name: this.state.player1.name
      },
      player2: {
        player: this.state.player2.player,
        currentTiles: this.drawTiles(7),
        name: this.state.player2.name
      }
    });
  }

  testMethod = (event) => {
    console.log(event.target);
  }

  render() {
    console.log(this.state);
    let currentPlayer = this.state.player1
    if (!this.state.player1Current) {
      currentPlayer = this.state.player2;
    }

    return (
      <div className="App">
        <h1>Let's Play Scrabble!</h1>
        <BoardView doSomething={this.testMethod}/>
        <div>
          Current Player: { currentPlayer.name }
          <div> Tiles: {currentPlayer.currentTiles}
          </div>

        </div>
      </div>
    );
  }
}

export default App;
