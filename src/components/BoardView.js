import React from 'react';

class BoardView extends React.Component {

  row = () => {
    let row = []
    for (let c = 0; c < 15; c += 1) {
      row.push(<span className='cell' id={c + 1} key={c}> - </span>);
    }
    return row;
  }

  render () {
    let board = []
    for (let r = 0; r < 15; r += 1) {
      board.push(<div className='row' id={r + 1}  key={r}>{this.row()}</div>);
    }

    return (
      <section className='board-view'>
        {
          board
        }
      </section>
    )
  }

}

export default BoardView;
