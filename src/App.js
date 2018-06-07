import React, { Component } from 'react';
import BoardView from './components/BoardView';
import Player from './components/Player';
import TileBag from './components/TileBag';
import './App.css';



class App extends Component {
  constructor() {
    super();
    this.state = {
      allTiles: new TileBag(),
      player1: {
        plays: new Player(),
        currentTiles: null
      },
      player2: {
        plays: new Player(),
        currentTiles: null
      },
    }
  }

  getTiles = (num) => {
    let playerTiles = this.state.allTiles.drawTiles(num);
    this.setState({player1: {currentTiles: playerTiles}});
  }

  render() {
    console.log(this.state.allTiles);
    return (
      <div className="App">
        <h1>Let's Play Scrabble!</h1>
        <BoardView />
      </div>
    );
  }
}

export default App;
