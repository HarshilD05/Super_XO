import React, { useState, useEffect } from 'react';
import { Bot, Users, X, Grid3X3, Grid } from 'lucide-react';
import { getDifficultyFromStorage, saveDifficultyToStorage } from '../utils/sessionStorage';

export type GameMode = 'pvp' | 'bot';
export type Difficulty = 'easy' | 'medium' | 'hard';
export type GameType = 'super-xo' | 'normal-xo';

interface HomePageProps {
  onStartGame: (gameType: GameType, mode: GameMode, difficulty?: Difficulty) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onStartGame }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [selectedGameType, setSelectedGameType] = useState<GameType>('super-xo');
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');

  // Load difficulty from session storage on component mount
  useEffect(() => {
    const savedDifficulty = getDifficultyFromStorage();
    setDifficulty(savedDifficulty);
  }, []);

  // Save difficulty to session storage when it changes
  const handleDifficultyChange = (newDifficulty: Difficulty) => {
    setDifficulty(newDifficulty);
    saveDifficultyToStorage(newDifficulty);
  };

  const handleGameTypeSelect = (gameType: GameType) => {
    setSelectedGameType(gameType);
    setShowPopup(true);
  };

  const handleStartGame = (mode: GameMode) => {
    onStartGame(selectedGameType, mode, mode === 'bot' ? difficulty : undefined);
    setShowPopup(false);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <div className="home-container">
      <h1 className="home-title">Tic Tac Toe Games</h1>
      <p className="home-subtitle">Choose your game type and start playing!</p>
      
      <div className="game-type-selection">
        <h2 className="selection-title">Select Game Type</h2>
        
        <div className="game-type-buttons">
          <button
            className="game-type-button"
            onClick={() => handleGameTypeSelect('super-xo')}
          >
            <Grid size={48} />
            <span>Super Tic Tac Toe</span>
            <p className="game-type-description">9x9 advanced tic-tac-toe with strategic gameplay</p>
          </button>
          
          <button
            className="game-type-button"
            onClick={() => handleGameTypeSelect('normal-xo')}
          >
            <Grid3X3 size={48} />
            <span>Normal Tic Tac Toe</span>
            <p className="game-type-description">Classic 3x3 tic-tac-toe game</p>
          </button>
        </div>
      </div>

      {/* Popup Modal */}
      {showPopup && (
        <div className="popup-overlay" onClick={closePopup}>
          <div className="popup-modal" onClick={(e) => e.stopPropagation()}>
            <button className="popup-close" onClick={closePopup}>
              <X size={24} />
            </button>
            
            <h3 className="popup-title">
              {selectedGameType === 'super-xo' ? 'Super Tic Tac Toe' : 'Normal Tic Tac Toe'}
            </h3>
            
            {/* Difficulty Selection */}
            <div className="popup-difficulty-section">
              <h4 className="popup-section-title">Bot Difficulty</h4>
              <div className="popup-difficulty-buttons">
                {(['easy', 'medium', 'hard'] as Difficulty[]).map((level) => (
                  <button
                    key={level}
                    className={`popup-difficulty-button ${difficulty === level ? 'selected' : ''} difficulty-${level}`}
                    onClick={() => handleDifficultyChange(level)}
                  >
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Bot Mode Button */}
            <button 
              className="popup-mode-button bot-button"
              onClick={() => handleStartGame('bot')}
            >
              <Bot size={24} />
              <span>Play Against Bot</span>
              <small>Difficulty: {difficulty}</small>
            </button>

            {/* Spacer */}
            <div className="popup-spacer"></div>

            {/* PVP Mode Button */}
            <button 
              className="popup-mode-button pvp-button"
              onClick={() => handleStartGame('pvp')}
            >
              <Users size={24} />
              <span>Player vs Player</span>
              <small>Play against another human</small>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;