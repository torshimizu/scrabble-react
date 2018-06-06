import React, { Component } from 'react';
import Tile from './Tile'

class Game extends Component {
  render() {
    return (
      <div className="game">
        <Tile />
      </div>
    );
  }
}

export default Game;
