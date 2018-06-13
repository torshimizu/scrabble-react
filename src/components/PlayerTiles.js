import React from 'react';
import PropTypes from 'prop-types';

class PlayerTiles extends React.Component {
  static propTypes = {
    tiles: PropTypes.array.isRequired,
    // currentPlayer: PropTypes.string,
    tileClick: PropTypes.func,
    finishButtonClick: PropTypes.func,
    selectedIndex: PropTypes.number,
    currentTileIndexes: PropTypes.arrayOf(PropTypes.number)
  }

  static defaultProps = {
    currentTileIndexes: []
  }

  onTileClick = (event) => {
    this.props.tileClick(event);
  }

  onButtonClick = (event) => {
    this.props.finishButtonClick(event);
  }

  isCurrentlyPlayed(index) {
    return this.props.currentTileIndexes.includes(index);
  }

  render () {
    return (
      <div className="in-play-tiles">
        <p>Tiles:</p>
        <div id="player-tiles"> {this.props.tiles.map((tile, index) => {
            if (this.isCurrentlyPlayed(index)) {
              return null;
            }

            let classes = 'cell ';
            if (this.props.selectedIndex === index) {
              classes += 'selected-letter';
            }
            return <span className={classes} key={index} id={index} onClick={this.onTileClick}>{tile}</span>
          })}
        </div>
        <button onClick={this.onButtonClick}>Finish Turn</button>

      </div>
    )
  }
}

export default PlayerTiles;
