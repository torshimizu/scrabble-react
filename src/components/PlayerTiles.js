import React from 'react';
import PropTypes from 'prop-types';

class PlayerTiles extends React.Component {
  static propTypes = {
    tiles: PropTypes.array.isRequired,
    // currentPlayer: PropTypes.string,
    tileClick: PropTypes.func,
    finishTurnCallback: PropTypes.func,
    selectedIndex: PropTypes.number,
    currentTileIndices: PropTypes.arrayOf(PropTypes.number),
    shuffleTilesCallback: PropTypes.func
  }

  static defaultProps = {
    currentTileIndices: []
  }

  onTileClick = (event) => {
    this.props.tileClick(event);
  }

  finishTurnClick = (event) => {
    this.props.finishTurnCallback(event);
  }

  shuffleTilesClick = () => {
    this.props.shuffleTilesCallback();
  }

  isCurrentlyPlayed(index) {
    return this.props.currentTileIndices.includes(index);
  }

  render () {
    return (
      <section className="in-play-tiles">
        <div className ="tray">
          <p>Tiles:</p>
          <div className="player-tiles">
            {this.props.tiles.map((tile, index) => {
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
          <button onClick={this.finishTurnClick}>Finish Turn</button>
        </div>
        <div className="shuffle-tiles">
          <button onClick={this.shuffleTilesClick}>Shuffle Tiles</button>
        </div>

      </section>
    )
  }
}

export default PlayerTiles;
