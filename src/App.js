import React, { Component } from 'react';
import Game from './components/Game'
import './App.css';

class App extends Component {
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
