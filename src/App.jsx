import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Home from './components/Home/Home';
import Game from './components/Game/Game';  // Make sure this import is added
import './styles/global.scss';

function App() {
  const [gameStarted, setGameStarted] = useState(false);

  return (
    <AnimatePresence mode="wait">
      {!gameStarted ? (
        <Home onStartGame={() => setGameStarted(true)} />
      ) : (
        <Game onGameEnd={() => setGameStarted(false)} />
      )}
    </AnimatePresence>
  );
}

export default App;