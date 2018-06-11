import React from 'react';
import PropTypes from 'prop-types';

class BoardView extends React.Component {
  static propTypes = {
    board: PropTypes.array.isRequired,
    boardCellClick: PropTypes.func
  }

  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     board: this.createAllRows(props)
  //   }
  // }

  // createOneRow = () => {
  //   let row = []
  //   for (let c = 0; c < 15; c += 1) {
  //     row.push(<span className='cell' id={`cell${c + 1}`} key={c}>&nbsp;</span>);
  //   }
  //   return row;
  // }
  //
  // createAllRows = (props) => {
  //   let board = []
  //   for (let r = 0; r < 15; r += 1) {
  //     board.push(
  //       <div
  //         key={r}
  //         className='row'
  //         id={`row${r + 1}`}
  //         onClick={props.boardCellClick}
  //         >
  //         {this.createOneRow()}
  //       </div>
  //     );
  //   }
  //   return board;
  // }

  makeBoard = () => {
    let boardMatrix = this.props.board;

    let boardView = boardMatrix.map((row, index) => {
      return (<div key={index} id={`row${index}`} className='row' onClick={this.props.boardCellClick}>
        {
          row.map((cell, index) => {
            return (<span key={index} id={`cell${index}`} className='cell'>{cell.letter}</span>)
          })
        }

      </div>)

    })
    return boardView;
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
