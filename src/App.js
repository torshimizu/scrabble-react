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

const makeArrayOfAllLetters = () => {
  let availableLetters = []

  Object.keys(LETTERS).forEach((letter) => {
    for (let i = 0; i < LETTERS[letter]['tiles']; i += 1) {
      availableLetters.push(letter);
    }
  });

  return availableLetters.shuffle();
}

class App extends Component {

  constructor() {
    super();

    const allTiles = makeArrayOfAllLetters();
    allTiles.shuffle();
    const p1Tiles = this.drawTiles(allTiles, 7);
    const p2Tiles = this.drawTiles(allTiles, 7);

    this.state = {
      allTiles: allTiles,
      player1: {
        player: new Player(),
        currentTiles: p1Tiles,
        name: "Player One"
      },
      player2: {
        player: new Player(),
        currentTiles: p2Tiles,
        name: "Player Two"
      },
      player1Current: true,
      currentInPlayTile: null,
      inPlayTileIndex: null
    }
  }


  drawTiles = (allTiles, num) => {
    const maxTiles = 7;

    if (num > maxTiles) {
      throw new Error('Too many tiles requested');
    }

    if (num > allTiles.length) {
      throw new Error('Not enough tiles');
    }

    let tiles = [];
    for (let i = 0; i < num; i += 1) {
      tiles.push(allTiles.pop());
    }

    return tiles;
  }

  cellClickHandler = (event) => {
    if (this.state.currentInPlayTile) {
      let cellPosition = [];
      let currentRow = event.currentTarget.id;
      let currentColumn = event.target.id;

      cellPosition.push(currentRow.replace('row', ''));
      cellPosition.push(currentColumn.replace('cell', ''));

      console.log(cellPosition);

      console.log(`need to update the board with ${this.state.currentInPlayTile}`);
    }
  }

  onPlayerTileClick = (event) => {
    if (event.target.id === this.state.inPlayTileIndex) {
      this.setState({
        currentInPlayTile: null,
        inPlayTileIndex: null
      });
    } else {
      this.setState({
        currentInPlayTile: event.target.innerText,
        inPlayTileIndex: event.target.id
      });
    }

  }

  render() {
    let currentPlayer = this.state.player1
    if (!this.state.player1Current) {
      currentPlayer = this.state.player2;
    }

    return (
      <div className="App">
        <h1>Let&#39;s Play Scrabble!</h1>
        <BoardView boardCellClick={this.cellClickHandler}/>
        <div>
          { currentPlayer.name }
          <div> Tiles: {currentPlayer.currentTiles.map((tile, index) => {
              return <span className='cell' key={index} id={index} onClick={this.onPlayerTileClick}>{tile}</span>
            })}
          </div>

        </div>
      </div>
    );
  }
}

export default App;
