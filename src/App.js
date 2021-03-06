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

const MAXTILES = 7;

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
      selectedPlayerTileIndex: null,
      turnTiles: [] // object of letter, row, column of board placement, index from player-tiles
    }
  }


  drawTiles = (allTiles, num) => {

    if (num > MAXTILES) {
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
    let parentRow = event.target.parentElement.id;
    return parentRow.replace('row', '');
  }

  getCellId = (event) => {
    return event.target.id.replace('cell', '');
  }

  shuffleTiles = () => {
    let updatedTiles = Array.from(this.state[this.getCurrentPlayer()].currentTiles);
    updatedTiles.shuffle();

    let playerState = {...this.state[this.getCurrentPlayer()]};
    playerState.currentTiles = updatedTiles;

    let newState = {}
    newState[this.getCurrentPlayer()] = playerState;

    this.setState(newState);
  }

  // staging tile for placing on the board
  // will unstage the tile if the same tile is clicked
  onPlayerTileClick = (event) => {
    const tileIndex = parseInt(event.target.id, 10);
    if (tileIndex === this.state.inPlayTileIndex) {
      this.setState({
        currentInPlayTile: null,
        inPlayTileIndex: null
      });
    } else {
      this.setState({
        currentInPlayTile: event.target.innerText,
        inPlayTileIndex: tileIndex
      });
    }
  }

  // places the tile on the board
  cellClickHandler = (event) => {
    // ensure that the click was on the SPAN
    if (event.target.nodeName !== 'SPAN') {
      return

    } else if (this.state.currentInPlayTile && event.target.innerHTML.length === 0) {
      // placing the tile on the board
      let currentRow = this.getCellRow(event);
      let currentColumn = this.getCellId(event);
      let updatedBoard = this.state.board;
      updatedBoard[currentRow][currentColumn]['letter'] = this.state.currentInPlayTile;
      updatedBoard[currentRow][currentColumn]['active'] = true;

      let updatedTurnTiles = Array.from(this.state.turnTiles);
      let turnTile = {
        row: currentRow,
        column: currentColumn,
        letter: this.state.currentInPlayTile,
        index: this.state.inPlayTileIndex,
      };
      updatedTurnTiles.push(turnTile);

      this.setState({
        board: updatedBoard,
        turnTiles: updatedTurnTiles,
        currentInPlayTile: null,
        inPlayTileIndex: null,
      });

    } else if (this.checkIfLetterInCurrPlayersCurrTurn(event)) {
      // recalling the tile
      let currentLetter = event.target.innerText;
      let updatedTurnTiles = Array.from(this.state.turnTiles);
      updatedTurnTiles = updatedTurnTiles.filter((tile) => {
        return tile.letter !== currentLetter;
      });

      let updatedBoard = this.state.board;
      updatedBoard[this.getCellRow(event)][this.getCellId(event)].letter = null;
      updatedBoard[this.getCellRow(event)][this.getCellId(event)].active = false;

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

  // what if the word is only two letters (one letter added to one existing)?
  isVerticalOrHorizonal = () => {
    return this.state.turnTiles.every((v) => { return v.row === this.state.turnTiles[0].row });
  }

  orderLetters = (unorderedArr) => {
    let isRow = this.isVerticalOrHorizonal();

    if (isRow) {
      return unorderedArr.sort((a, b) => {
        return a.column - b.column;
      })
    } else {
      return unorderedArr.sort((a, b) => {
        return a.row - b.row;
      })
    }
  }

  // only works for one letter
  findInBetweenLetter = (sortedArr, direction) => {
    let last = sortedArr.length - 1;

    for (let i = 0; i < last; i += 1) {

      let current = parseInt(sortedArr[i][direction], 10);
      let onePlus = parseInt(sortedArr[i + 1][direction], 10);

      if ((current + 1) !== onePlus) {
        return current + 1
      } else {
        return null
      }
    }
  }

  // this does not check for multiple surrounding tiles (building off of more than one letter)
  checkForSurroundingTiles = (sampleTiles) => {
    let isRow = this.isVerticalOrHorizonal();
    let beforeIndex = null;
    let afterIndex = null;

    if (isRow) {
      beforeIndex = parseInt(sampleTiles[0].column, 10) - 1;
      afterIndex = parseInt(sampleTiles[sampleTiles.length - 1].column, 10) + 1;
      if (this.state.board[sampleTiles[0].row][beforeIndex].letter) {
        // before
        return {
          row: sampleTiles[0].row,
          column: beforeIndex,
          letter: this.state.board[sampleTiles[0].row][beforeIndex].letter
        };

      } else if (this.state.board[sampleTiles[0].row][afterIndex].letter) {
        // after
        return {
          row: sampleTiles[0].row,
          column: afterIndex,
          letter: this.state.board[sampleTiles[0].row][beforeIndex].letter
        };

      } else if (this.findInBetweenLetter(sampleTiles, "column")) {
        // in between
        let inBetweenLetterIndex = this.findInBetweenLetter(sampleTiles, "column");
        return {
          row: sampleTiles[0].row,
          column: inBetweenLetterIndex,
          letter: this.state.board[parseInt(sampleTiles[0].row, 10)][inBetweenLetterIndex].letter
        };

      } else {
        // return nothing
        return null
      }

    } else { // is a vertical play
      beforeIndex = parseInt(sampleTiles[0].row, 10) - 1;
      afterIndex = parseInt(sampleTiles[sampleTiles.length - 1].row, 10) + 1;

      if (this.state.board[beforeIndex][sampleTiles[0].column].letter) {
        // before
        return {
          row: beforeIndex,
          column: sampleTiles[0].column,
          letter: this.state.board[beforeIndex][sampleTiles[0].column].letter
        };

      } else if (this.state.board[afterIndex][sampleTiles[0].column].letter) {
        // after
        return {
          row: afterIndex,
          column: sampleTiles[0].column,
          letter: this.state.board[afterIndex][sampleTiles[0].column].letter
        }
      } else if (this.findInBetweenLetter(sampleTiles, "row")) {
        let inBetweenLetterIndex = this.findInBetweenLetter(sampleTiles, "row");
        return {
          row: inBetweenLetterIndex,
          column: sampleTiles[0].column,
          letter: this.state.board[inBetweenLetterIndex][sampleTiles[0].column].letter
        };
      } else {
        return null
      }
    }
  }

  makeWordFromTiles = () => {
    let turnTiles = this.state.turnTiles.slice();
    let wordArray = this.orderLetters(turnTiles);
    let additionalLetter = this.checkForSurroundingTiles(wordArray);

    if (additionalLetter) {
      wordArray.push(additionalLetter);
      wordArray = this.orderLetters(wordArray);
    }

    return wordArray.map((wordObj) => {
      return wordObj.letter;
    }).join('');
  }

  finishTurnClick = (event) => {
    event.preventDefault();
    // add played word to currentPlayer.plays
    let word = this.makeWordFromTiles();
    console.log(word);
    let currentPlayer = this.state[this.getCurrentPlayer()];
    currentPlayer.player.play(word);

    // need to remove all played tiles from player's current tiles
    let playerTiles = Array.from(this.state[this.getCurrentPlayer()].currentTiles);
    let turnLetters = this.state.turnTiles.map((tile) => {
      return tile.letter;
    })

    turnLetters.forEach((letter) => {
      playerTiles.splice(playerTiles.indexOf(letter), 1);
    })
    // draw more letters
    let tilesToDraw = MAXTILES - playerTiles.length;
    let newTiles = this.drawTiles(this.state.allTiles, tilesToDraw);
    let updatedPlayerTiles = playerTiles.concat(newTiles);

    // make all active tiles on board inactive
    let updatedBoard = this.state.board;
    this.state.turnTiles.forEach((tile) => {
      updatedBoard[tile.row][tile.column].active = false;
    })

    // update the classList of played playerTiles to not have placed-letter
    let hiddenTiles = Array.from(document.getElementsByClassName("placed-letter"));
    hiddenTiles.forEach((tile) => {
      tile.classList.remove("placed-letter");
    });

    // update state
    let newState = {
      board: updatedBoard,
      player1Current: !this.state.player1Current,
      turnTiles: [],
    }

    let playerObj = {...this.state[this.getCurrentPlayer()]};
    playerObj.currentTiles = updatedPlayerTiles;
    newState[this.getCurrentPlayer()] = playerObj;

    this.setState(newState);
  }

  getCurrentTileIndices() {
    return this.state.turnTiles.map((tile) => { return tile.index });
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

        <div className='player-info'>
          <h3>Player 1 Score: </h3>
          <p>
            {this.state.player1.player.totalScore()}
          </p>
          <h3>Player 2 Score: </h3>
          <p>
            {this.state.player2.player.totalScore()}
          </p>
        </div>

        <PlayerTiles
          currentTileIndices={this.getCurrentTileIndices()}
          selectedIndex={this.state.inPlayTileIndex}
          tiles={this.state[currentPlayer]['currentTiles']}
          finishTurnCallback={this.finishTurnClick}
          shuffleTilesCallback={this.shuffleTiles}
          tileClick={this.onPlayerTileClick}
          currentPlayer={this.state[currentPlayer]['name']}
        />
      </div>
    );
  }
}

export default App;
