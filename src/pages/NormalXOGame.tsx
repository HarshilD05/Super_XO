import React, { useState } from 'react';
import XOBoard from '../components/XOBoard';
import { ArrowLeft, ArrowRight, Home, RotateCcw, Trophy, Users, Bot } from 'lucide-react';
import { GameMode, Difficulty } from './HomePage';
import { XOBot, BotValue } from '../utils/XOBot';

interface NormalXOGameState {
  board: (string | null)[];
  moves: number[];
  currentMove: number;
  winner: string | null;
}

interface NormalXOGameProps {
  gameMode: GameMode;
  difficulty: Difficulty;
  onBackToHome: () => void;
}

const NormalXOGame: React.FC<NormalXOGameProps> = ({ gameMode, difficulty, onBackToHome }) => {
  const initialState: NormalXOGameState = {
    board: Array(9).fill(null),
    moves: [],
    currentMove: 0,
    winner: null,
  };

  const [gameState, setGameState] = useState<NormalXOGameState>(initialState);
  const [bot, setBot] = useState<XOBot | null>(null);
  const [showGameEndPopup, setShowGameEndPopup] = useState(false);

  // Restart game function
  const handleRestart = () => {
    const newInitialState: NormalXOGameState = {
      board: Array(9).fill(null),
      moves: [],
      currentMove: 0,
      winner: null,
    };
    
    setGameState(newInitialState);
    setShowGameEndPopup(false);
    
    // Reinitialize bot if in bot mode
    if (gameMode === 'bot') {
      const randomBotValue: BotValue = Math.random() < 0.5 ? 'X' : 'O';
      const newBot = new XOBot(difficulty, randomBotValue);
      setBot(newBot);
    }
  };

  // Initialize bot when game starts
  React.useEffect(() => {
    if (gameMode === 'bot' && !bot) {
      // Randomly assign bot to X or O
      const randomBotValue: BotValue = Math.random() < 0.5 ? 'X' : 'O';
      const newBot = new XOBot(difficulty, randomBotValue);
      setBot(newBot);
    } else if (gameMode === 'pvp') {
      setBot(null);
    }
  }, [gameMode, difficulty, bot]);

  // Show popup when game ends
  React.useEffect(() => {
    const isDraw = !gameState.winner && gameState.board.every(cell => cell !== null);
    if (gameState.winner || isDraw) {
      setTimeout(() => {
        setShowGameEndPopup(true);
      }, 1000); // Small delay to let the final move be visible
    }
  }, [gameState.winner, gameState.board]);

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

  // Use effect to make bot moves
  React.useEffect(() => {
    if (gameMode === 'bot' && bot && !gameState.winner) {
      const currentPlayer = gameState.currentMove % 2 === 0 ? 'X' : 'O';
      const isBotTurn = currentPlayer === bot.getBotValue();
      
      if (isBotTurn) {
        // Bot's turn - sync state and get move
        bot.syncState(gameState.board);
        const botMove = bot.getMove();
        
        if (botMove !== null) {
          setTimeout(() => {
            handleCellClick(botMove);
          }, 500); // Small delay to make bot move visible
        }
      }
    }
  }, [gameState.currentMove, gameMode, gameState.winner, bot]);

  const handleCellClick = (cellIndex: number) => {
    if (gameState.winner || gameState.board[cellIndex] !== null) {
      return;
    }

    const newBoard = [...gameState.board];
    newBoard[cellIndex] = (gameState.currentMove % 2) === 0 ? 'X' : 'O';

    const newMoves = [...gameState.moves.slice(0, gameState.currentMove), cellIndex];

    // Record move in bot if it's a player move
    if (gameMode === 'bot' && bot) {
      const currentPlayer = (gameState.currentMove % 2) === 0 ? 'X' : 'O';
      if (currentPlayer !== bot.getBotValue()) {
        // This is a player move, record it
        bot.recordPlayerMove(cellIndex);
      } else {
        // This is a bot move, record it as bot move
        bot.recordBotMove(cellIndex);
      }
    }

    // Check for winner
    const winner = calculateWinner(newBoard);

    setGameState({
      board: newBoard,
      moves: newMoves,
      currentMove: gameState.currentMove + 1,
      winner: winner,
    });
  };

  const handleUndo = () => {
    if (gameState.currentMove === 0) return;

    const newCurrentMove = gameState.currentMove - 1;
    const newBoard = [...gameState.board];
    const lastMove = gameState.moves[newCurrentMove];
    
    // Undo the last move
    newBoard[lastMove] = null;
    
    setGameState({
      ...gameState,
      board: newBoard,
      currentMove: newCurrentMove,
      winner: null, // Reset winner on undo
    });
  };

  const handleRedo = () => {
    if (gameState.currentMove >= gameState.moves.length) return;

    const cellIndex = gameState.moves[gameState.currentMove];
    const newBoard = [...gameState.board];
    newBoard[cellIndex] = gameState.currentMove % 2 === 0 ? 'X' : 'O';

    const winner = calculateWinner(newBoard);

    setGameState({
      ...gameState,
      board: newBoard,
      currentMove: gameState.currentMove + 1,
      winner: winner,
    });
  };

  const nextPlayer = gameState.currentMove % 2 === 0 ? 'X' : 'O';
  
  // Determine player labels based on bot configuration
  const getPlayerLabel = (): string => {
    if (gameMode === 'pvp') {
      return `Player ${nextPlayer}`;
    }
    
    if (bot) {
      const isBotTurn = nextPlayer === bot.getBotValue();
      if (isBotTurn) {
        return 'Bot Thinking...';
      } else {
        return `Your Turn (${nextPlayer})`;
      }
    }
    
    return `Player ${nextPlayer}`;
  };

  // Determine win message based on bot configuration
  const getWinMessage = (winner: string): string => {
    if (gameMode === 'pvp') {
      return `Winner: ${winner}`;
    }
    
    if (bot) {
      if (winner === bot.getBotValue()) {
        return 'Bot Wins!';
      } else {
        return 'You Win!';
      }
    }
    
    return `Winner: ${winner}`;
  };

  // Check for draw
  const isDraw = !gameState.winner && gameState.board.every(cell => cell !== null);

  return (
    <div className="game-container">
      <div className="game-header">
        <button onClick={onBackToHome} className="home-button">
          <Home size={20} /> Home
        </button>
        <h1 className="game-title">Normal Tic Tac Toe</h1>
        <div className="game-mode-indicator">
          {gameMode === 'bot' ? `vs Bot (${difficulty})` : 'vs Player'}
        </div>
      </div>
      
      <div className="button-container">
        <button
          onClick={handleUndo}
          disabled={gameState.currentMove === 0}
          className="button"
        >
          <ArrowLeft size={20} /> Undo
        </button>

        { (gameState.winner)? (
          <div className={`super-winner super-winner-${gameState.winner.toLowerCase()}`}>
            {getWinMessage(gameState.winner)}
          </div>
          ) : isDraw ? (
          <div className="super-winner">
            It's a Draw!
          </div>
          ) : (
          <div className={`next-player next-player-${nextPlayer.toLowerCase()}`}>
            {getPlayerLabel()}
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
      
      <div className="normal-xo-game-board">
        <XOBoard
          cells={gameState.board}
          onCellClick={handleCellClick}
          isActive={!gameState.winner && !isDraw}
          winner={gameState.winner}
        />
      </div>

      {/* Game End Popup */}
      {showGameEndPopup && (
        <div className="game-end-overlay" onClick={() => setShowGameEndPopup(false)}>
          <div className="game-end-popup" onClick={(e) => e.stopPropagation()}>
            {gameState.winner ? (
              <div className={`game-end-content winner-${gameState.winner.toLowerCase()}`}>
                <div className="game-end-icon">
                  <Trophy size={64} />
                </div>
                <h2 className="game-end-title">
                  {getWinMessage(gameState.winner)}
                </h2>
                <div className="game-end-subtitle">
                  {gameMode === 'bot' 
                    ? (gameState.winner === (bot?.getBotValue() || 'O') 
                        ? `The bot (${gameState.winner}) wins!` 
                        : `You (${gameState.winner}) are victorious!`
                      )
                    : `Player ${gameState.winner} takes the victory!`
                  }
                </div>
              </div>
            ) : (
              <div className="game-end-content draw">
                <div className="game-end-icon">
                  {gameMode === 'bot' ? <Bot size={64} /> : <Users size={64} />}
                </div>
                <h2 className="game-end-title">It's a Draw!</h2>
                <div className="game-end-subtitle">
                  {gameMode === 'bot' 
                    ? "You and the bot are evenly matched!" 
                    : "Both players played excellently!"
                  }
                </div>
              </div>
            )}
            
            <div className="game-end-actions">
              <button 
                className="game-end-button restart-button"
                onClick={handleRestart}
              >
                <RotateCcw size={20} />
                Play Again
              </button>
              
              <button 
                className="game-end-button home-button"
                onClick={() => {
                  setShowGameEndPopup(false);
                  onBackToHome();
                }}
              >
                <Home size={20} />
                Back to Home
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NormalXOGame;