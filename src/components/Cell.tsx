import React from 'react';
import { getBorderClasses } from '../constants/borders';

interface CellProps {
  value: string | null;
  onClick: () => void;
  borders: number;
  isActive?: boolean;
  isWon?: boolean;
}

const Cell: React.FC<CellProps> = ({ value, onClick, borders, isActive = true, isWon = false }) => {
  return (
    <button
      className={`cell ${getBorderClasses(borders)} ${isWon ? 'won' : ''} ${isActive ? 'active' : ''}`}
      onClick={onClick}
      disabled={!isActive || value !== null}
      data-value={value}
    >
      {value}
    </button>
  );
};

export default Cell