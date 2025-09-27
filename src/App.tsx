import { useState } from 'react';
import HomePage, { GameMode, Difficulty, GameType } from './pages/HomePage';
import SuperXOGame from './pages/SuperXOGame';
import NormalXOGame from './pages/NormalXOGame';

function App() {
  const [currentScreen, setCurrentScreen] = useState<'home' | 'game'>('home');
  const [gameType, setGameType] = useState<GameType>('super-xo');
  const [gameMode, setGameMode] = useState<GameMode>('pvp');
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');

  const handleStartGame = (selectedGameType: GameType, mode: GameMode, selectedDifficulty?: Difficulty) => {
    setGameType(selectedGameType);
    setGameMode(mode);
    if (selectedDifficulty) {
      setDifficulty(selectedDifficulty);
    }
    setCurrentScreen('game');
  };

  const handleBackToHome = () => {
    setCurrentScreen('home');
  };

  return (
    <div>
      {currentScreen === 'home' ? (
        <HomePage onStartGame={handleStartGame} />
      ) : gameType === 'super-xo' ? (
        <SuperXOGame 
          gameMode={gameMode} 
          difficulty={difficulty} 
          onBackToHome={handleBackToHome}
        />
      ) : (
        <NormalXOGame 
          gameMode={gameMode} 
          difficulty={difficulty} 
          onBackToHome={handleBackToHome}
        />
      )}
    </div>
  );
}

export default App;