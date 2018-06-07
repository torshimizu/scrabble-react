import React, { Component } from 'react';
import BoardView from './components/BoardView';
import Player from './components/Player';
import TileBag from './components/TileBag';
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
      player1: new Player(),
      player2: new Player(),
      tiles: new TileBag()
    }
  }

  render() {
    return (
      <div className="App">
        <h1>Let's Play Scrabble!</h1>
        <BoardView />
      </div>
    );
  }
}

export default App;
