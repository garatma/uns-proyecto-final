import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button  onClick={props.onClick}>
    {props.value}
    </button>
  );
}

class Board extends React.Component {

  constructor(props) {
      super(props);
      this.state = {
      items: "clickear para obtener el clima",
      };
    }

    handleClick() {

      fetch("https://wttr.in/?format=3").then(response=>response.text()).then(result=>this.state.items=result).catch(error=>console.log("error: " +error));

      this.setState({ });
    }

  renderSquare() {
    return (<Square
      onClick={() => this.handleClick()} //actualiza para el proximo render
      value={this.state.items}  //le asigna el string al boton
      />
    );
  }

  render() {
    const status = 'prueba react';

    return (
      <div>
        <div className="status">{status}</div>
        <div >
          {this.renderSquare()}
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Board />,
  document.getElementById('root')
);

