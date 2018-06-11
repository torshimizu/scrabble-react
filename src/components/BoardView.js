import React from 'react';
import PropTypes from 'prop-types';

class BoardView extends React.Component {
  static propTypes = {
    board: PropTypes.array.isRequired,
    boardCellClick: PropTypes.func
  }

  makeBoard = () => {
    let boardMatrix = this.props.board;

    let boardView = boardMatrix.map((row, index) => {
      return (<div key={index} id={`row${index}`} className='row' onClick={this.cellClickHandler}>
        {
          row.map((cell, index) => {
            return (<span key={index} id={`cell${index}`} className='cell'>{cell.letter}&nbsp;</span>)
          })
        }

      </div>)

    })
    return boardView;
  }

  cellClickHandler = (event) => {
    this.props.boardCellClick(event);
  }

  render () {

    return (
      <section className='board-view'>
        {this.makeBoard()}
      </section>
    )
  }

}

export default BoardView;
