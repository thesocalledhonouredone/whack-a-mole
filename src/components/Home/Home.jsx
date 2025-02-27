import { motion } from 'framer-motion';
import './Home.scss';

const Home = ({ onStartGame }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.5,
        staggerChildren: 0.2 
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  return (
    <motion.div 
      className="home"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="home__content">
        <motion.h1 
          className="home__title"
          variants={itemVariants}
        >
          Whack-a-Mole!
        </motion.h1>

        <motion.div 
          className="home__stats"
          variants={itemVariants}
        >
          <div className="stat">
            <span className="stat__number">30</span>
            <span className="stat__label">Seconds</span>
          </div>
          <div className="stat">
            <span className="stat__number">100</span>
            <span className="stat__label">Points</span>
          </div>
        </motion.div>

        <motion.button
          className="home__start-btn"
          variants={itemVariants}
          whileHover={{ 
            scale: 1.05,
            transition: { type: "spring", stiffness: 400 }
          }}
          whileTap={{ scale: 0.95 }}
          onClick={onStartGame}
        >
          Start Game
        </motion.button>
      </div>
    </motion.div>
  );
};

export default Home;