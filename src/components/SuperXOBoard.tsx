import React from 'react';
import XOBoard from './XOBoard';
import { getBorder, getBorderClasses } from '../constants/borders';

interface SuperXOBoardProps {
  boards: (string | null)[][];
  winners: (string | null)[];
  currentBoard: number | null;
  onCellClick: (boardIndex: number, cellIndex: number) => void;
  superWinner: string | null;
}

const SuperXOBoard: React.FC<SuperXOBoardProps> = ({
  boards,
  winners,
  currentBoard,
  onCellClick,
  superWinner,
}) => {
  const isDraw = (board: (string | null)[]) => {
    return board.every(cell => cell !== null) && !winners[boards.indexOf(board)];
  };

  return (
    <div className="super-board">
      {superWinner && (
        <div className={`super-winner-overlay super-winner-${superWinner.toLowerCase()}`}>
          {superWinner}
        </div>
      )}
      {boards.map((board, boardIndex) => (
        <div
          key={boardIndex}
          className={`board-container ${currentBoard === boardIndex ? 'active' : ''} 
            ${ winners[boardIndex] ? 'won' : ''} 
            ${isDraw(board) ? 'draw' : ''}
            ${getBorderClasses(getBorder(boardIndex))}
          `}
        >
          <XOBoard
            cells={board}
            onCellClick={(cellIndex) => onCellClick(boardIndex, cellIndex)}
            isActive={!superWinner && (currentBoard === null || currentBoard === boardIndex)}
            winner={winners[boardIndex]}
          />
          {(winners[boardIndex] || isDraw(board)) && (
            <div className={`board-overlay ${winners[boardIndex] ? `winner-${winners[boardIndex].toLowerCase()}` : 'draw'}`}>
              {winners[boardIndex] || '-'}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default SuperXOBoard;