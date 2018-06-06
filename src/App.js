import React, { Component } from 'react';
import Game from './components/Game'
import Player from './Player';
import TileBag from './TileBag';
import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      player1: new Player,
      player2: new Player,
      tiles: new TileBag
    }
  }

  render() {
    return (
      <div className="App">
        <h1>Let's Play Scrabble!</h1>
        <Game />
      </div>
    );
  }
}

export default App;
