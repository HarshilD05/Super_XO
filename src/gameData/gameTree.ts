// Game tree structure for optimal Tic Tac Toe play
// State format: 9 characters string where '.' = empty, 'X' = X player, 'O' = O player
// Position mapping: 0-8 from left to right, top to bottom
// Example: "X.O......" means X at position 0, O at position 2

export interface GameTreeNode {
  state: string;
  gameValue: number; // -1 = O wins, 0 = Draw, 1 = X wins
}

export interface GameTreeMoves {
  [movePosition: string]: GameTreeNode;
}

export interface GameTree {
  [boardState: string]: GameTreeMoves;
}

// Import the game tree data from JSON file
import gameTreeData from './xo_game_tree.json';

export const gameTree: GameTree = gameTreeData as GameTree;
