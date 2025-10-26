import { Difficulty } from '../pages/HomePage';
import { gameTree } from '../gameData/gameTree';

export type BotValue = 'X' | 'O';

export class XOBot {
  private difficulty: Difficulty;
  private botValue: BotValue;
  private playerValue: BotValue;
  private boardState: string; // String representation: '.' for empty, 'X' or 'O' for filled

  constructor(
    difficulty: Difficulty,
    botValue: BotValue,
    initialBoard: string = '.........'
  ) {
    this.difficulty = difficulty;
    this.botValue = botValue;
    this.playerValue = botValue === 'X' ? 'O' : 'X';
    this.boardState = initialBoard;
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
    this.boardState = this.boardState.substring(0, cellIndex) + this.playerValue + this.boardState.substring(cellIndex + 1);
  }

  // Record bot's own move and update internal state
  recordBotMove(cellIndex: number): void {
    this.boardState = this.boardState.substring(0, cellIndex) + this.botValue + this.boardState.substring(cellIndex + 1);
  }

  // Sync bot state with external game state
  syncState(boardState: string): void {
    this.boardState = boardState;
  }

  // Calculate winner for the board
  private _calculateWinner(boardStr: string): string | null {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6] // diagonals
    ];

    for (const [a, b, c] of lines) {
      if (boardStr[a] !== '.' && boardStr[a] === boardStr[b] && boardStr[a] === boardStr[c]) {
        return boardStr[a];
      }
    }
    return null;
  }

  // Get all available moves
  private _getAvailableMoves(): number[] {
    const availableMoves: number[] = [];
    
    for (let i = 0; i < 9; i++) {
      if (this.boardState[i] === '.') {
        availableMoves.push(i);
      }
    }

    return availableMoves;
  }

  // Easy difficulty - purely random selection
  private _easyMove(): number | null {
    const availableMoves = this._getAvailableMoves();
    if (availableMoves.length === 0) return null;

    // Pure random move selection
    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
  }

  // Medium difficulty - strategic rule set
  private _mediumMove(): number | null {
    const availableMoves = this._getAvailableMoves();
    if (availableMoves.length === 0) return null;

    // Priority 1: Take winning move if available
    const winningMove = this._findWinningMove(availableMoves, this.botValue);
    if (winningMove !== null) return winningMove;

    // Priority 2: Block opponent from winning
    const blockingMove = this._findWinningMove(availableMoves, this.playerValue);
    if (blockingMove !== null) return blockingMove;

    // Priority 3: Take center if available
    const centerMove = this._findCenterMove(availableMoves);
    if (centerMove !== null) return centerMove;

    // Priority 4: Take any corner
    const cornerMove = this._findCornerMove(availableMoves);
    if (cornerMove !== null) return cornerMove;

    // Priority 5: Take any edge
    const edgeMove = this._findEdgeMove(availableMoves);
    if (edgeMove !== null) return edgeMove;

    // Fallback: Random move
    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
  }

  // Hard difficulty - optimal play using game tree
  private _hardMove(): number | null {
    const availableMoves = this._getAvailableMoves();
    if (availableMoves.length === 0) return null;

    // Try to use game tree for optimal move
    const gameTreeMove = this._getGameTreeMove(availableMoves);
    if (gameTreeMove !== null) return gameTreeMove;

    // Fallback to strategic play if game tree lookup fails
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

    // Fallback: Random move
    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
  }

  // Get optimal move from game tree
  private _getGameTreeMove(availableMoves: number[]): number | null {
    // Check if current board state exists in game tree
    const currentStateMoves = gameTree[this.boardState];
    if (!currentStateMoves) return null;

    // Determine if bot should maximize (X) or minimize (O)
    const shouldMaximize = this.botValue === 'X';
    
    let bestMove: number | null = null;
    let bestValue: number = shouldMaximize ? -Infinity : Infinity;

    // Evaluate all available moves
    for (const moveIdx of availableMoves) {
      const moveStr = moveIdx.toString();
      const moveData = currentStateMoves[moveStr];
      
      if (moveData) {
        const gameValue = moveData.gameValue;
        
        if (shouldMaximize) {
          // X wants to maximize game value
          if (gameValue > bestValue || (gameValue === bestValue && (bestMove === null || moveIdx < bestMove))) {
            bestValue = gameValue;
            bestMove = moveIdx;
          }
        } else {
          // O wants to minimize game value
          if (gameValue < bestValue || (gameValue === bestValue && (bestMove === null || moveIdx < bestMove))) {
            bestValue = gameValue;
            bestMove = moveIdx;
          }
        }
      }
    }

    return bestMove;
  }

  // Find winning move for specified player
  private _findWinningMove(availableMoves: number[], player: string): number | null {
    for (const cellIndex of availableMoves) {
      // Create test board by setting the cell
      const testBoard = this.boardState.substring(0, cellIndex) + player + this.boardState.substring(cellIndex + 1);
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
        if (this.boardState[oppositeCorner] === this.playerValue) {
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
    // Convert string board to array for compatibility
    return this.boardState.split('').map(char => char === '.' ? null : char);
  }

  getBoardState(): string {
    return this.boardState;
  }
}