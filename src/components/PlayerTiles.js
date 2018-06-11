import React from 'react';
import PropTypes from 'prop-types';

class PlayerTiles extends React.Component {
  static propTypes = {
    tiles: PropTypes.array.isRequired,
    currentPlayer: PropTypes.string,
    tileClick: PropTypes.func,
    finishButtonClick: PropTypes.func
  }

  onTileClick = (event) => {
    this.props.tileClick(event);
  }

  onButtonClick = (event) => {
    this.props.finishButtonClick(event);
  }

  render () {
    return (
      <div className="player-info">
        { this.props.currentPlayer }
        <p>Tiles:</p>
        <div id="player-tiles"> {this.props.tiles.map((tile, index) => {
            return <span className='cell' key={index} id={index} onClick={this.onTileClick}>{tile}</span>
          })}
        </div>
        <button onClick={this.onButtonClick}>Finish Turn</button>

      </div>
    )
  }
}

export default PlayerTiles;
