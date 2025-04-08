import React from 'react';
import Cell from './Cell';
import { getBorder } from '../constants/borders';

interface XOBoardProps {
  cells: (string | null)[];
  onCellClick: (index: number) => void;
  isActive: boolean;
  winner: string | null;
}

const XOBoard: React.FC<XOBoardProps> = ({ cells, onCellClick, isActive, winner }) => {
  
  return (
    <div className="xo-board">
      {cells.map((value, index) => (
        <Cell
          key={index}
          value={value}
          onClick={() => onCellClick(index)}
          borders={getBorder(index)}
          isActive={isActive && !winner}
          isWon={winner !== null}
        />
      ))}
    </div>
  );
};

export default XOBoard;