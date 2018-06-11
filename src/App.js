import React, { Component } from 'react';
import BoardView from './components/BoardView';
import PlayerTiles from './components/PlayerTiles';
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

const createOneRow = () => {
  let row = []
  for (let c = 0; c < 15; c += 1) {
    row.push({
      active: false,
      letter: null
    });
  }
  return row;
}

const createAllRows = () => {
  let board = []
  for (let r = 0; r < 15; r += 1) {
    board.push(createOneRow());
  }
  return board;
}


class App extends Component {

  constructor() {
    super();

    const allTiles = makeArrayOfAllLetters();
    allTiles.shuffle();
    const p1Tiles = this.drawTiles(allTiles, 7);
    const p2Tiles = this.drawTiles(allTiles, 7);

    this.state = {
      board: createAllRows(),
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
      turnTiles: [] // object of letter, row, column of board placement
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

  getCurrentPlayer = () => {
    return this.state.player1Current ? "player1" : "player2";
  }

  getCellRow = (event) => {
    return event.currentTarget.id.replace('row', '');
  }

  getCellId = (event) => {
    return event.target.id.replace('cell', '');
  }

  // staging tile for placing on the board
  // will unstage the tile if the same tile is clicked
  onPlayerTileClick = (event) => {
    if (event.target.id === this.state.inPlayTileIndex) {
      event.target.classList.remove("selected-letter");
      this.setState({
        currentInPlayTile: null,
        inPlayTileIndex: null
      });
    } else {
      event.target.classList.add("selected-letter");
      this.setState({
        currentInPlayTile: event.target.innerText,
        inPlayTileIndex: event.target.id
      });
    }

  }

  removeLetterFromCurrTiles = () => {
    const currentTileIndex = this.state.inPlayTileIndex;
    const currentTiles = [...document.getElementById("player-tiles").childNodes];
    let elementToReplace = currentTiles.find((tile) => {
      return tile.id === currentTileIndex;
    });

    elementToReplace.classList.remove("selected-letter");
    elementToReplace.classList.add("placed-letter");
  }


  // places the tile on the board
  cellClickHandler = (event) => {
    if (this.state.currentInPlayTile && event.target.innerHTML.length === 0) {
      let currentRow = this.getCellRow(event);
      let currentColumn = this.getCellId(event);
      let updatedBoard = this.state.board
      updatedBoard[currentRow][currentColumn]['letter'] = this.state.currentInPlayTile;
      updatedBoard[currentRow][currentColumn]['active'] = true;

      let updatedTurnTiles = this.state.turnTiles;
      let turnTile = {
        row: currentRow,
        column: currentColumn,
        letter: this.state.currentInPlayTile
      };
      updatedTurnTiles.push(turnTile);
      //
      this.setState({
        board: updatedBoard,
        turnTiles: updatedTurnTiles,
        currentInPlayTile: null,
        inPlayTileIndex: null,
      })

      // // replace the text of the just played-player's tile to a blank removes the tile from the player's displayed tiles but not from players currentTiles in state
      this.removeLetterFromCurrTiles();

    } else if (this.checkIfLetterInCurrPlayersCurrTurn(event)) {
      let currentLetter = event.target.innerText;

      // add tile back to player's current tiles
      let hiddenTiles = Array.from(document.getElementsByClassName("placed-letter"));
      let targetTile = hiddenTiles.find((tile) => {
        return tile.innerText === event.target.innerText;
      });
      targetTile.classList.remove("placed-letter");

      // creating a turnTiles array without the letter
      let updatedTurnTiles = this.state.turnTiles;
      updatedTurnTiles.splice( updatedTurnTiles.indexOf(currentLetter), 1 );

      // create a board without the selected letter
      let updatedBoard = this.state.board;
      updatedBoard[this.getCellRow(event)][this.getCellId(event)].letter = null;
      updatedBoard[this.getCellRow(event)][this.getCellId(event)].active = false;

      // remove tiles from state turnTiles
      // make board cell blank
      this.setState({
        board: updatedBoard,
        turnTiles: updatedTurnTiles,
      });

    }
  }

  checkIfLetterInCurrPlayersCurrTurn = (event) => {
    // checking that the cell is active and matching info
    if (this.state.board[this.getCellRow(event)][this.getCellId(event)].active && !this.state.currentInPlayTile) {
      let matchedTurnPlay = this.state.turnTiles.find((play) => {
        return play.row === this.getCellRow(event) &&
         play.column === this.getCellId(event) &&
         play.letter === event.target.innerText;
      })

      return matchedTurnPlay
    }
  }


  // need to update this function to remove all played tiles once turn is finished
  removePlayedTilesFromPlayer = () => {
    let currentPlayer = this.getCurrentPlayer();
    let updatedTiles = this.state[currentPlayer].currentTiles.splice(this.state.inPlayTileIndex, 1, ' ');

    this.setState({
      currentPlayer: {
        player: this.state[currentPlayer].player,
        currentTiles: updatedTiles,
        name: this.state[currentPlayer].name
      }
    });
  }

  orderLetters = () => {
    let isRow = this.state.turnTiles.every((v) => { return v.row === this.state.turnTiles[0].row });

    let sampleTiles = this.state.turnTiles.slice(0);
    if (isRow) {
      return sampleTiles.sort((a, b) => {
        return a.column - b.column;
      })
    } else {
      return sampleTiles.sort((a, b) => {
        return a.row - b.row;
      })
    }
  }

  finishTurnClick = (event) => {
    event.preventDefault();
    // need to add played word to currentPlayer.plays
    let wordArray = this.orderLetters();
    let word = wordArray.map((wordObj) => {
      return wordObj.letter;
    }).join('');
    let currentPlayer = this.state[this.getCurrentPlayer()];
    currentPlayer.player.play(word);
    console.log(currentPlayer.player.plays);


    // need to remove all played tiles from player's current tiles
    // make all active tiles inactive
    let updatedBoard = this.state.board;
    this.state.turnTiles.forEach((tile) => {
      updatedBoard[tile.row][tile.column].active = false;
    })

    this.setState({
      board: updatedBoard,
      player1Current: !this.state.player1Current,
      turnTiles: []
    });
  }

  render() {
    let currentPlayer = this.getCurrentPlayer();

    return (
      <div className="App">
        <h1>Let&#39;s Play Scrabble!</h1>
        <BoardView
          boardCellClick={this.cellClickHandler}
          board={this.state.board}
        />
        <PlayerTiles
          tiles={this.state[currentPlayer]['currentTiles']}
          finishButtonClick={this.finishTurnClick}
          tileClick={this.onPlayerTileClick}
          currentPlayer={this.state[currentPlayer]['name']}
        />
      </div>
    );
  }
}

export default App;
