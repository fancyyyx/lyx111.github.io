import { useState } from "react";

function Square({ value, onSquareClick, squareIndex }) {
  return (
    <button className="square" onClick={() => onSquareClick(squareIndex)}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  const boardSize = 15; // 五子棋棋盘大小
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? "X" : "O";
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  const renderSquare = (i) => (
    <Square
      value={squares[i]}
      onSquareClick={handleClick}
      squareIndex={i}
    />
  );

  const boardRows = [];
  for (let i = 0; i < boardSize; i++) {
    const squaresRow = [];
    for (let j = 0; j < boardSize; j++) {
      squaresRow.push(renderSquare(i * boardSize + j));
    }
    boardRows.push(
      <div key={i} className="board-row">
        {squaresRow}
      </div>
    );
  }

  return (
    <>
      <div className="status">{status}</div>
      {boardRows}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(15 * 15).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description = move > 0 ? "Go to move #" + move : "Go to game start";
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const boardSize = 15;
  const lineLength = 5; // 五子棋需要连续五个棋子
  const lines = [];

  // 横向和纵向的胜利条件
  for (let i = 0; i < boardSize; i++) {
    for (let j = 0; j <= boardSize - lineLength; j++) {
      lines.push([...Array(lineLength).keys()].map(k => i * boardSize + j + k));
      lines.push([...Array(lineLength).keys()].map(k => (j + k) * boardSize + i));
    }
  }

  // 斜向的胜利条件
  for (let i = 0; i <= boardSize - lineLength; i++) {
    for (let j = 0; j <= boardSize - lineLength; j++) {
      lines.push([...Array(lineLength).keys()].map(k => (i + k) * boardSize + j + k));
      lines.push([...Array(lineLength).keys()].map(k => (i + k) * boardSize + boardSize - 1 - (j + k)));
    }
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const [a, b, c, d, e] = line;
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c] && squares[a] === squares[d] && squares[a] === squares[e]) {
      return squares[a];
    }
  }
  return null;
}
