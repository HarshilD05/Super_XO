import { Difficulty } from '../pages/HomePage';

export type BotValue = 'X' | 'O';

export class SuperXOBot {
  private difficulty: Difficulty;
  private botValue: BotValue;
  private playerValue: BotValue;
  private boards: (string | null)[][];
  private winners: (string | null)[];
  private currentBoard: number | null;

  constructor(
    difficulty: Difficulty,
    botValue: BotValue,
    initialBoards: (string | null)[][] = Array(9).fill(null).map(() => Array(9).fill(null)),
    initialWinners: (string | null)[] = Array(9).fill(null),
    initialCurrentBoard: number | null = null
  ) {
    this.difficulty = difficulty;
    this.botValue = botValue;
    this.playerValue = botValue === 'X' ? 'O' : 'X';
    this.boards = initialBoards.map(board => [...board]);
    this.winners = [...initialWinners];
    this.currentBoard = initialCurrentBoard;
  }

  // Public method to get bot's move
  getMove(): [number, number] | null {
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
  recordPlayerMove(boardIndex: number, cellIndex: number): void {
    this.boards[boardIndex][cellIndex] = this.playerValue;
    this._updateGameState(boardIndex, cellIndex);
  }

  // Record bot's own move and update internal state
  recordBotMove(boardIndex: number, cellIndex: number): void {
    this.boards[boardIndex][cellIndex] = this.botValue;
    this._updateGameState(boardIndex, cellIndex);
  }

  // Sync bot state with external game state (for resets or corrections)
  syncState(boards: (string | null)[][], winners: (string | null)[], currentBoard: number | null): void {
    this.boards = boards.map(board => [...board]);
    this.winners = [...winners];
    this.currentBoard = currentBoard;
  }

  // Private method to update game state after a move
  private _updateGameState(boardIndex: number, cellIndex: number): void {
    // Check if the current board has a winner
    const boardWinner = this._calculateWinner(this.boards[boardIndex]);
    if (boardWinner) {
      this.winners[boardIndex] = boardWinner;
    }

    // Update current board based on Super Tic-Tac-Toe rules
    const targetBoardWon = this.winners[cellIndex] !== null;
    const targetBoardFull = this.boards[cellIndex].every(cell => cell !== null);
    this.currentBoard = (targetBoardWon || targetBoardFull) ? null : cellIndex;
  }

  // Calculate winner for a single board
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
  private _getAvailableMoves(): [number, number][] {
    const availableMoves: [number, number][] = [];
    
    // Determine which boards can be played
    const playableBoards = this.currentBoard !== null 
      ? [this.currentBoard] 
      : Array.from({ length: 9 }, (_, i) => i).filter(i => 
          !this.winners[i] && this.boards[i].some(cell => cell === null)
        );

    // Collect all available moves
    for (const boardIndex of playableBoards) {
      for (let cellIndex = 0; cellIndex < 9; cellIndex++) {
        if (this.boards[boardIndex][cellIndex] === null) {
          availableMoves.push([boardIndex, cellIndex]);
        }
      }
    }

    return availableMoves;
  }

  // Easy difficulty move with priority system
  private _easyMove(): [number, number] | null {
    const availableMoves = this._getAvailableMoves();
    if (availableMoves.length === 0) return null;

    // Priority 1: Winning move
    const winningMove = this._findWinningMove(availableMoves, this.botValue);
    if (winningMove) return winningMove;

    // Priority 2: Block opponent winning move
    const blockingMove = this._findWinningMove(availableMoves, this.playerValue);
    if (blockingMove) return blockingMove;

    // Priority 3: Take corner
    const cornerMove = this._findCornerMove(availableMoves);
    if (cornerMove) return cornerMove;

    // Priority 4: Take center
    const centerMove = this._findCenterMove(availableMoves);
    if (centerMove) return centerMove;

    // Priority 5: Take opposite corner
    const oppositeCornerMove = this._findOppositeCornerMove(availableMoves);
    if (oppositeCornerMove) return oppositeCornerMove;

    // Priority 6: Remaining edge
    const edgeMove = this._findEdgeMove(availableMoves);
    if (edgeMove) return edgeMove;

    // Fallback: Random move
    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
  }

  // Medium difficulty (same as easy for now)
  private _mediumMove(): [number, number] | null {
    return this._easyMove();
  }

  // Hard difficulty (same as easy for now)
  private _hardMove(): [number, number] | null {
    return this._easyMove();
  }

  // Find winning move for specified player
  private _findWinningMove(availableMoves: [number, number][], player: string): [number, number] | null {
    for (const [boardIndex, cellIndex] of availableMoves) {
      const testBoard = [...this.boards[boardIndex]];
      testBoard[cellIndex] = player;
      if (this._calculateWinner(testBoard) === player) {
        return [boardIndex, cellIndex];
      }
    }
    return null;
  }

  // Find corner moves (positions 0, 2, 6, 8)
  private _findCornerMove(availableMoves: [number, number][]): [number, number] | null {
    const corners = [0, 2, 6, 8];
    const cornerMoves = availableMoves.filter(([, cellIndex]) => corners.includes(cellIndex));
    return cornerMoves.length > 0 ? cornerMoves[Math.floor(Math.random() * cornerMoves.length)] : null;
  }

  // Find center move (position 4)
  private _findCenterMove(availableMoves: [number, number][]): [number, number] | null {
    const centerMoves = availableMoves.filter(([, cellIndex]) => cellIndex === 4);
    return centerMoves.length > 0 ? centerMoves[0] : null;
  }

  // Find opposite corner moves
  private _findOppositeCornerMove(availableMoves: [number, number][]): [number, number] | null {
    const oppositeCorners = { 0: 8, 2: 6, 6: 2, 8: 0 };
    
    for (const [boardIndex, cellIndex] of availableMoves) {
      if (cellIndex in oppositeCorners) {
        const oppositeCorner = oppositeCorners[cellIndex as keyof typeof oppositeCorners];
        if (this.boards[boardIndex][oppositeCorner] === this.playerValue) {
          return [boardIndex, cellIndex];
        }
      }
    }
    return null;
  }

  // Find edge moves (positions 1, 3, 5, 7)
  private _findEdgeMove(availableMoves: [number, number][]): [number, number] | null {
    const edges = [1, 3, 5, 7];
    const edgeMoves = availableMoves.filter(([, cellIndex]) => edges.includes(cellIndex));
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

  getCurrentBoard(): number | null {
    return this.currentBoard;
  }

  getBoards(): (string | null)[][] {
    return this.boards.map(board => [...board]);
  }

  getWinners(): (string | null)[] {
    return [...this.winners];
  }
}
