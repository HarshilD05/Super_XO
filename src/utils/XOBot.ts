import { Difficulty } from '../pages/HomePage';

export type BotValue = 'X' | 'O';

export class XOBot {
  private difficulty: Difficulty;
  private botValue: BotValue;
  private playerValue: BotValue;
  private board: (string | null)[];

  constructor(
    difficulty: Difficulty,
    botValue: BotValue,
    initialBoard: (string | null)[] = Array(9).fill(null)
  ) {
    this.difficulty = difficulty;
    this.botValue = botValue;
    this.playerValue = botValue === 'X' ? 'O' : 'X';
    this.board = [...initialBoard];
  }

  // Public method to get bot's move
  getMove(): number | null {
    switch (this.difficulty) {
      case 'easy':
        return this._easyMove();
      case 'medium':
        return this._mediumMove();
      case 'hard':
        return this._hardMove();
      default:
        return this._easyMove();
    }
  }

  // Record opponent's move and update internal state
  recordPlayerMove(cellIndex: number): void {
    this.board[cellIndex] = this.playerValue;
  }

  // Record bot's own move and update internal state
  recordBotMove(cellIndex: number): void {
    this.board[cellIndex] = this.botValue;
  }

  // Sync bot state with external game state
  syncState(board: (string | null)[]): void {
    this.board = [...board];
  }

  // Calculate winner for the board
  private _calculateWinner(cells: (string | null)[]): string | null {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6] // diagonals
    ];

    for (const [a, b, c] of lines) {
      if (cells[a] && cells[a] === cells[b] && cells[a] === cells[c]) {
        return cells[a];
      }
    }
    return null;
  }

  // Get all available moves
  private _getAvailableMoves(): number[] {
    const availableMoves: number[] = [];
    
    for (let i = 0; i < 9; i++) {
      if (this.board[i] === null) {
        availableMoves.push(i);
      }
    }

    return availableMoves;
  }

  // Easy difficulty move with priority system
  private _easyMove(): number | null {
    const availableMoves = this._getAvailableMoves();
    if (availableMoves.length === 0) return null;

    // Priority 1: Winning move
    const winningMove = this._findWinningMove(availableMoves, this.botValue);
    if (winningMove !== null) return winningMove;

    // Priority 2: Block opponent winning move
    const blockingMove = this._findWinningMove(availableMoves, this.playerValue);
    if (blockingMove !== null) return blockingMove;

    // Priority 3: Take corner
    const cornerMove = this._findCornerMove(availableMoves);
    if (cornerMove !== null) return cornerMove;

    // Priority 4: Take center
    const centerMove = this._findCenterMove(availableMoves);
    if (centerMove !== null) return centerMove;

    // Priority 5: Take opposite corner
    const oppositeCornerMove = this._findOppositeCornerMove(availableMoves);
    if (oppositeCornerMove !== null) return oppositeCornerMove;

    // Priority 6: Remaining edge
    const edgeMove = this._findEdgeMove(availableMoves);
    if (edgeMove !== null) return edgeMove;

    // Fallback: Random move
    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
  }

  // Medium difficulty (same as easy for now)
  private _mediumMove(): number | null {
    return this._easyMove();
  }

  // Hard difficulty (same as easy for now)
  private _hardMove(): number | null {
    return this._easyMove();
  }

  // Find winning move for specified player
  private _findWinningMove(availableMoves: number[], player: string): number | null {
    for (const cellIndex of availableMoves) {
      const testBoard = [...this.board];
      testBoard[cellIndex] = player;
      if (this._calculateWinner(testBoard) === player) {
        return cellIndex;
      }
    }
    return null;
  }

  // Find corner moves (positions 0, 2, 6, 8)
  private _findCornerMove(availableMoves: number[]): number | null {
    const corners = [0, 2, 6, 8];
    const cornerMoves = availableMoves.filter(move => corners.includes(move));
    return cornerMoves.length > 0 ? cornerMoves[Math.floor(Math.random() * cornerMoves.length)] : null;
  }

  // Find center move (position 4)
  private _findCenterMove(availableMoves: number[]): number | null {
    return availableMoves.includes(4) ? 4 : null;
  }

  // Find opposite corner moves
  private _findOppositeCornerMove(availableMoves: number[]): number | null {
    const oppositeCorners = { 0: 8, 2: 6, 6: 2, 8: 0 };
    
    for (const cellIndex of availableMoves) {
      if (cellIndex in oppositeCorners) {
        const oppositeCorner = oppositeCorners[cellIndex as keyof typeof oppositeCorners];
        if (this.board[oppositeCorner] === this.playerValue) {
          return cellIndex;
        }
      }
    }
    return null;
  }

  // Find edge moves (positions 1, 3, 5, 7)
  private _findEdgeMove(availableMoves: number[]): number | null {
    const edges = [1, 3, 5, 7];
    const edgeMoves = availableMoves.filter(move => edges.includes(move));
    return edgeMoves.length > 0 ? edgeMoves[Math.floor(Math.random() * edgeMoves.length)] : null;
  }

  // Getters for debugging and external access
  getBotValue(): BotValue {
    return this.botValue;
  }

  getPlayerValue(): BotValue {
    return this.playerValue;
  }

  getDifficulty(): Difficulty {
    return this.difficulty;
  }

  getBoard(): (string | null)[] {
    return [...this.board];
  }
}