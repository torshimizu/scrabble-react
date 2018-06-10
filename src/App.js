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
    let elementToReplace = currentTiles.filter((tile) => {
      return tile.id === currentTileIndex;
    });

    elementToReplace[0].classList.remove("selected-letter");
    // TODO: instead of replacing with a space, I want to delete this element altogether
    // elementToReplace[0].innerHTML = "&nbsp;";
    elementToReplace[0].outerHTML = "";
  }


  // places the tile on the board
  cellClickHandler = (event) => {
    if (this.state.currentInPlayTile) {
      let currentRow = event.currentTarget.id;
      let currentColumn = event.target.id;
      let row = [...document.getElementById(currentRow).childNodes];
      let cell = row.filter((c) => {
        return c.id === currentColumn;
      });
      // replace the text inside the selected cell on board
      cell[0].innerHTML = this.state.currentInPlayTile;

      // add tile to turnTiles
      let updatedTurnTiles = this.state.turnTiles;
      let turnTile = {
        row: currentRow,
        column: currentColumn,
        letter: this.state.currentInPlayTile
      };
      updatedTurnTiles.push(turnTile);

      this.setState({
        turnTiles: updatedTurnTiles,
        currentInPlayTile: null,
        inPlayTileIndex: null,
      })

      // replace the text of the just played-player's tile to a blank removes the tile from the player's displayed tiles but not from players currentTiles in state
      this.removeLetterFromCurrTiles();

    } else if (this.checkIfLetterInCurrPlayersCurrTurn(event)) {

      let currPlayer = this.getCurrentPlayer();
      let updatedCurrPlayerTiles = this.state[currPlayer].currentTiles;
      let currentLetter = event.target.innerText;
      // add tile back to player's current tiles
      updatedCurrPlayerTiles.push(currentLetter);

      // creating a turnTiles array without the letter
      let updatedTurnTiles = this.state.turnTiles;
      updatedTurnTiles.splice( updatedTurnTiles.indexOf(currentLetter), 1 );

      // remove tiles from state turnTiles
      this.setState({
        turnTiles: updatedTurnTiles,
      });

      // make board cell blank
      event.target.innerHTML = "&nbsp;";
    }
  }

  checkIfLetterInCurrPlayersCurrTurn = (event) => {
    let matchedTurnPlay = this.state.turnTiles.filter((play) => {
      return play.row === event.currentTarget.id &&
       play.column === event.target.id &&
       play.letter === event.target.innerText;
    })
    return matchedTurnPlay.length !== 0;
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


  finishTurnClick = (event) => {
    event.preventDefault;
    // need to add played word to currentPlayer.plays
    console.log(this.state[this.getCurrentPlayer()].player.totalScore());
    this.setState({
      player1Current: !this.state.player1Current,
      turnTiles: []
    });
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
        <div className="player-info">
          { currentPlayer.name }
          <p>Tiles:</p>
          <div id="player-tiles"> {currentPlayer.currentTiles.map((tile, index) => {
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
