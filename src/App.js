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
      inPlayTileIndex: null,
      turnTiles: []
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

  // places the tile on the board
  cellClickHandler = (event) => {
    if (this.state.currentInPlayTile) {
      let cellPosition = [];
      let currentRow = event.currentTarget.id;
      let currentColumn = event.target.id;

      cellPosition.push(currentRow);
      cellPosition.push(currentColumn);
      let row = [...document.getElementById(currentRow).childNodes];
      let cell = row.filter((c) => {
        return c.id === currentColumn
      });
      // replace the text inside the selected cell
      cell[0].innerHTML = this.state.currentInPlayTile;

      // once tile is played, should remove the tile from the player's displayed tiles but not from players currentTiles in state
      // if you remove the tile from player's tiles how will you be able to put them back if they want to undo the word? How to distinguish their tiles from previously played tiles?
      this.removePlayedTileFromPlayer();

      // what should happen if the player wants to undo the play on the board?
    }
  }

  removePlayedTileFromPlayer = () => {
    let currentPlayer = null;
    currentPlayer = this.state.player1Current ? "player1" : "player2";
    let updatedTiles = this.state[currentPlayer].currentTiles.splice(this.state.inPlayTileIndex, 1, ' ');

    this.setState({
      currentPlayer: {
        player: this.state[currentPlayer].player,
        currentTiles: updatedTiles,
        name: this.state[currentPlayer].name
      }
    });
  }

  // staging tile for placing on the board
  // will unstage the tile if the same tile is clicked
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

  finishTurnClick = (event) => {
    event.preventDefault;

    this.setState({player1Current: !this.state.player1Current})
  }

  render() {
    let currentPlayer = this.state.player1
    if (!this.state.player1Current) {
      currentPlayer = this.state.player2;
    }

    return (
      <div className="App">
        <h1>Let&#39;s Play Scrabble!</h1>
        <BoardView boardCellClick={this.cellClickHandler} />
        <div className="player-tiles">
          { currentPlayer.name }
          <div> Tiles: {currentPlayer.currentTiles.map((tile, index) => {
              return <span className='cell' key={index} id={index} onClick={this.onPlayerTileClick}>{tile}</span>
            })}
          </div>
          <button onClick={this.finishTurnClick}>Finish Turn</button>

        </div>
      </div>
    );
  }
}

export default App;
