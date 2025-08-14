import React, { useState } from 'react';
import SuperXOBoard from '../components/SuperXOBoard';
import { ArrowLeft, ArrowRight } from 'lucide-react';


interface GameState {
  boards: (string | null)[][];
  currentBoard: number | null;
  moves: [number, number][];
  currentMove: number;
  winners: (string | null)[];
  superWinner: string | null;
}

const SuperXOGame: React.FC = () => {
  const initialState: GameState = {
    boards: Array(9).fill(Array(9).fill(null)),
    currentBoard: null,
    moves: [],
    currentMove: 0,
    winners: Array(9).fill(null),
    superWinner: null,
  };

  const [gameState, setGameState] = useState<GameState>(initialState);

  const calculateWinner = (cells: (string | null)[]): string | null => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (const [a, b, c] of lines) {
      if (cells[a] && cells[a] === cells[b] && cells[a] === cells[c]) {
        return cells[a];
      }
    }
    return null;
  };

  
  const handleCellClick = (boardIndex: number, cellIndex: number) => {
    if (
      gameState.superWinner ||
      (gameState.currentBoard !== null && gameState.currentBoard !== boardIndex) ||
      gameState.boards[boardIndex][cellIndex] !== null ||
      gameState.winners[boardIndex]
    ) {
      return;
    }

    const newBoards = gameState.boards.map((board) => board);
    newBoards[boardIndex] = [...newBoards[boardIndex]];
    newBoards[boardIndex][cellIndex] = (gameState.currentMove & 1) ? 'O' : 'X';

    const newMoves: [number, number][] = [...gameState.moves.slice(0, gameState.currentMove), [boardIndex, cellIndex]];

    // Check if the current board has a winner after the move
    const currBoardWinner = calculateWinner(newBoards[boardIndex]);
    
    // If a Board has a Winner, Update the winners state
    const newWinners = [...gameState.winners];
    if (currBoardWinner) {
      newWinners[boardIndex] = currBoardWinner;
      // If the current board has a winner, check if it leads to a super winner
      if (calculateWinner(newWinners)) {
        setGameState({
          boards: newBoards,
          currentBoard: null,
          moves: newMoves,
          currentMove: gameState.currentMove + 1,
          winners: newWinners,
          superWinner: currBoardWinner,
        });
        return;
      }
    }


    // If the target board is won or full, allow playing in any available board
    const targetBoardWon = gameState.winners[cellIndex] !== null;
    const targetBoardFull = newBoards[cellIndex].every(cell => cell !== null);
    const nextBoard = (targetBoardWon || targetBoardFull) ? null : cellIndex;

    setGameState({
      boards: newBoards,
      currentBoard: nextBoard,
      moves: newMoves,
      currentMove: gameState.currentMove + 1,
      winners: newWinners,
      superWinner: gameState.superWinner,
    });
  };

  const handleUndo = () => {
    if (gameState.currentMove === 0) return;

    // Get the Details of the GameState at Previous Move
    const newCurrentMove = gameState.currentMove - 1;
    const newBoards = gameState.boards.map((board) => board);

    // Check if the BoardIndex was of a Winner board
    const [boardIndex, cellIndex] = gameState.moves[newCurrentMove];
    // Undo the Win
    const oldWinners = [...gameState.winners];
    if (oldWinners[boardIndex] !== null) {
      oldWinners[boardIndex] = null;
    }
    // Create a new Board and set the Cell to null
    // Done to avoid mutating the state directly
    newBoards[boardIndex] = [...newBoards[boardIndex]];
    newBoards[boardIndex][cellIndex] = null;
    
    setGameState({
      ...gameState,
      boards: newBoards,
      currentMove: newCurrentMove,
      currentBoard: boardIndex,
      winners: oldWinners,
      superWinner: null, // Reset super winner on undo
    });
  };

  const handleRedo = () => {
    if (gameState.currentMove >= gameState.moves.length) return;

    const [boardIndex, cellIndex] = gameState.moves[gameState.currentMove];
    const newBoards = gameState.boards.map((board, index) =>
      index === boardIndex ? [...board] : board
    );
    newBoards[boardIndex][cellIndex] = gameState.currentMove % 2 === 0 ? 'X' : 'O';

    const targetBoardWon = gameState.winners[cellIndex] !== null;
    const targetBoardFull = newBoards[cellIndex].every(cell => cell !== null);
    const nextBoard = targetBoardWon || targetBoardFull ? null : cellIndex;

    setGameState({
      ...gameState,
      boards: newBoards,
      currentMove: gameState.currentMove + 1,
      currentBoard: nextBoard,
    });
  };

  const nextPlayer = gameState.currentMove % 2 === 0 ? 'X' : 'O';

  return (
    <div className="game-container">
      <h1 className="game-title">Super Tic Tac Toe</h1>
      <div className="button-container">
        <button
          onClick={handleUndo}
          disabled={gameState.currentMove === 0}
          className="button"
        >
          <ArrowLeft size={20} /> Undo
        </button>

        { (gameState.superWinner)? (
          <div className={`super-winner super-winner-${gameState.superWinner.toLowerCase()}`}>
            Super Winner: {gameState.superWinner}
          </div>
          ) : (
          <div className={`next-player next-player-${nextPlayer.toLowerCase()}`}>
            Next Player: {nextPlayer}
          </div>
        )}

        <button
          onClick={handleRedo}
          disabled={gameState.currentMove >= gameState.moves.length}
          className="button"
        >
          Redo <ArrowRight size={20} />
        </button>
      </div>
      

      <SuperXOBoard
        boards={gameState.boards}
        winners={gameState.winners}
        currentBoard={gameState.currentBoard}
        onCellClick={handleCellClick}
        superWinner={gameState.superWinner}
      />
    </div>
  );
};

export default SuperXOGame;