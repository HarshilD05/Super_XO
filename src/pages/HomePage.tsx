import React, { useState, useEffect } from 'react';
import { Bot, Users, Play } from 'lucide-react';
import { getDifficultyFromStorage, saveDifficultyToStorage } from '../utils/sessionStorage';

export type GameMode = 'pvp' | 'bot';
export type Difficulty = 'easy' | 'medium' | 'hard';

interface HomePageProps {
  onStartGame: (mode: GameMode, difficulty?: Difficulty) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onStartGame }) => {
  const [selectedMode, setSelectedMode] = useState<GameMode>('pvp');
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

  const handleStartGame = () => {
    onStartGame(selectedMode, selectedMode === 'bot' ? difficulty : undefined);
  };

  return (
    <div className="home-container">
      <h1 className="home-title">Super Tic Tac Toe</h1>
      <p className="home-subtitle">Choose your game mode and start playing!</p>
      
      <div className="game-mode-selection">
        <h2 className="selection-title">Select Game Mode</h2>
        
        <div className="mode-buttons">
          <button
            className={`mode-button ${selectedMode === 'pvp' ? 'selected' : ''}`}
            onClick={() => setSelectedMode('pvp')}
          >
            <Users size={32} />
            <span>Player vs Player</span>
            <p className="mode-description">Play against another human player</p>
          </button>
          
          <button
            className={`mode-button ${selectedMode === 'bot' ? 'selected' : ''}`}
            onClick={() => setSelectedMode('bot')}
          >
            <Bot size={32} />
            <span>Player vs Bot</span>
            <p className="mode-description">Play against AI opponent</p>
          </button>
        </div>
        
        {selectedMode === 'bot' && (
          <div className="difficulty-selection">
            <h3 className="difficulty-title">Select Difficulty</h3>
            <div className="difficulty-buttons">
              {(['easy', 'medium', 'hard'] as Difficulty[]).map((level) => (
                <button
                  key={level}
                  className={`difficulty-button ${difficulty === level ? 'selected' : ''} difficulty-${level}`}
                  onClick={() => handleDifficultyChange(level)}
                >
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </button>
              ))}
            </div>
            <p className="difficulty-info">
              Last selected: <strong>{difficulty}</strong>
            </p>
          </div>
        )}
        
        <button className="play-button" onClick={handleStartGame}>
          <Play size={24} />
          Start Game
        </button>
      </div>
    </div>
  );
};

export default HomePage;