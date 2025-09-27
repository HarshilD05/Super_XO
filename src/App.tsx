import { useState } from 'react';
import HomePage, { GameMode, Difficulty } from './pages/HomePage';
import SuperXOGame from './pages/SuperXOGame';

function App() {
  const [currentScreen, setCurrentScreen] = useState<'home' | 'game'>('home');
  const [gameMode, setGameMode] = useState<GameMode>('pvp');
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');

  const handleStartGame = (mode: GameMode, selectedDifficulty?: Difficulty) => {
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
      ) : (
        <SuperXOGame 
          gameMode={gameMode} 
          difficulty={difficulty} 
          onBackToHome={handleBackToHome}
        />
      )}
    </div>
  );
}

export default App;