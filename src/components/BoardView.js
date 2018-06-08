import React from 'react';

class BoardView extends React.Component {
  constructor(props) {
    super();
    this.state = {
      board: this.createAllRows(props)
    }
  }
  createOneRow = (inputMethod) => {
    let row = []
    for (let c = 0; c < 15; c += 1) {
      row.push(<span className='cell' id={`cell${c + 1}`} key={c} onClick={inputMethod}> </span>);
    }
    return row;
  }

  createAllRows = (props) => {
    console.log(this);
    let board = []
    for (let r = 0; r < 15; r += 1) {
      board.push(<div className='row' id={`row${r + 1}`}  key={r}>{this.createOneRow(props.doSomething)}</div>);
    }
    return board;
  }


  render () {

    return (
      <section className='board-view'>
        {
          this.state.board
        }
      </section>
    )
  }

}

export default BoardView;
