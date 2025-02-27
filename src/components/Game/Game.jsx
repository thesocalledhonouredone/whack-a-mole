import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Howl } from 'howler';
import './Game.scss';

const Game = ({ onGameEnd }) => {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [moles, setMoles] = useState(new Array(9).fill(false));
  const [isPlaying, setIsPlaying] = useState(true);
  const currentTimeout = useRef(null);

  // Random time helpers
  const getRandomTime = () => Math.random() * (1500 - 600) + 600;
  const getRandomDuration = () => Math.random() * (1200 - 400) + 400;
  const getRandomHole = () => Math.floor(Math.random() * 9);

  const whackSound = new Howl({
    src: ['/sounds/whack.mp3'],
    volume: 0.5
  });

  const moleVariants = {
    hidden: { y: 100 },  // Start from fully hidden
    visible: { y: 0 },   // Pop up to fully visible
    exit: { y: 100 }     // Exit by going fully down
  };

  const showNextMole = () => {
    if (!isPlaying) return;

    const randomHole = getRandomHole();
    const upDuration = getRandomDuration();

    // Show mole
    setMoles(currentMoles => {
      const newMoles = new Array(9).fill(false);
      newMoles[randomHole] = true;
      return newMoles;
    });

    // Clear any existing timeout
    if (currentTimeout.current) {
      clearTimeout(currentTimeout.current);
    }

    // Set timeout for mole to disappear if not clicked
    currentTimeout.current = setTimeout(() => {
      setMoles(currentMoles => {
        const newMoles = new Array(9).fill(false);
        return newMoles;
      });
      // Schedule next mole
      setTimeout(showNextMole, getRandomTime());
    }, upDuration);
  };

  useEffect(() => {
    if (!isPlaying) return;

    // Timer countdown
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsPlaying(false);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Start the game
    showNextMole();

    return () => {
      clearInterval(timer);
      if (currentTimeout.current) {
        clearTimeout(currentTimeout.current);
      }
    };
  }, [isPlaying]);

  const handleWhack = (index) => {
    if (!moles[index] || !isPlaying) return;
    
    whackSound.play();
    setScore(prev => prev + 10);

    // Immediately hide the mole
    setMoles(new Array(9).fill(false));

    // Clear current timeout and schedule next mole
    if (currentTimeout.current) {
      clearTimeout(currentTimeout.current);
    }
    setTimeout(showNextMole, getRandomTime());
  };

  return (
    <motion.div 
      className="game"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="game__stats">
        <motion.div 
          className="score"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 0.3 }}
          key={score}
        >
          Score: {score}
        </motion.div>
        <div className="time">Time: {timeLeft}s</div>
      </div>

      <div className="game__grid">
        {moles.map((isUp, index) => (
          <motion.div 
            key={index}
            className="hole"
            onClick={() => handleWhack(index)}
          >
            <AnimatePresence mode="wait">
              {isUp && (
                <motion.div
                  className="mole"
                  variants={moleVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ 
                    type: "spring",
                    stiffness: 400,
                    damping: 25,
                    mass: 0.8,
                    duration: 0.15
                  }}
                >
                  <div className="face" />
                  <div className="smile" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {!isPlaying && (
        <motion.div 
          className="game-over"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          <h2>Game Over!</h2>
          <p>Final Score: {score}</p>
          <button onClick={onGameEnd}>Play Again</button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Game;