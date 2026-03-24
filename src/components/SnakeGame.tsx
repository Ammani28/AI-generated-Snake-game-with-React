import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION = { x: 0, y: -1 };

export default function SnakeGame() {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(true);
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  const generateFood = useCallback(() => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      const onSnake = snake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
      if (!onSnake) break;
    }
    return newFood;
  }, [snake]);

  const moveSnake = useCallback(() => {
    if (isGameOver || isPaused) return;

    setSnake(prevSnake => {
      const head = prevSnake[0];
      const newHead = {
        x: (head.x + direction.x + GRID_SIZE) % GRID_SIZE,
        y: (head.y + direction.y + GRID_SIZE) % GRID_SIZE,
      };

      if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        setIsGameOver(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => s + 10);
        setFood(generateFood());
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, isGameOver, isPaused, generateFood]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
        case ' ':
          setIsPaused(p => !p);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    if (!isPaused && !isGameOver) {
      gameLoopRef.current = setInterval(moveSnake, 120);
    } else {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    }
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [isPaused, isGameOver, moveSnake]);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood({ x: 5, y: 5 });
    setScore(0);
    setIsGameOver(false);
    setIsPaused(false);
  };

  return (
    <div className="flex flex-col items-center gap-4 bg-black p-4 border-2 border-cyan shadow-[4px_4px_0_#ff00ff]">
      <div className="flex justify-between items-center w-full max-w-[400px] px-2">
        <div 
          className="text-3xl font-black glitch-cyan" 
          data-text={`DATA_VAL: ${score}`}
        >
          DATA_VAL: {score}
        </div>
        <div className="text-[10px] font-bold text-magenta animate-pulse uppercase">
          [ {isPaused ? 'WAITING_FOR_INPUT' : 'SYSTEM_ACTIVE'} ]
        </div>
      </div>

      <div 
        className="relative bg-black border-2 border-magenta overflow-hidden"
        style={{ 
          width: GRID_SIZE * 20, 
          height: GRID_SIZE * 20,
          display: 'grid',
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`
        }}
      >
        {/* Grid Lines */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" 
             style={{ 
               backgroundImage: 'linear-gradient(to right, #00ffff 1px, transparent 1px), linear-gradient(to bottom, #00ffff 1px, transparent 1px)',
               backgroundSize: '20px 20px' 
             }} 
        />

        {/* Snake Body */}
        {snake.map((segment, i) => (
          <div
            key={i}
            className={`absolute border border-black ${i === 0 ? 'bg-cyan z-10 shadow-[2px_2px_0_#ff00ff]' : 'bg-cyan/40'}`}
            style={{
              width: 20,
              height: 20,
              left: segment.x * 20,
              top: segment.y * 20,
            }}
          />
        ))}

        {/* Food */}
        <motion.div
          animate={{ 
            x: [0, -2, 2, 0],
            y: [0, 2, -2, 0],
            opacity: [1, 0.5, 1]
          }}
          transition={{ repeat: Infinity, duration: 0.2 }}
          className="absolute bg-magenta shadow-[2px_2px_0_#00ffff]"
          style={{
            width: 16,
            height: 16,
            left: food.x * 20 + 2,
            top: food.y * 20 + 2,
          }}
        />

        {/* Game Over Overlay */}
        <AnimatePresence>
          {isGameOver && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/95 flex flex-col items-center justify-center z-20 border-4 border-magenta"
            >
              <h2 
                className="text-5xl font-black text-cyan mb-4 glitch-cyan" 
                data-text="CORE_CRASH"
              >
                CORE_CRASH
              </h2>
              <p className="text-sm text-magenta mb-8 font-mono">RECOVERY_FAILED: {score} BYTES</p>
              <button
                onClick={resetGame}
                className="px-10 py-4 bg-cyan text-black font-black hover:bg-magenta hover:text-white transition-all border-b-4 border-r-4 border-white active:border-0"
              >
                REBOOT_SYSTEM
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pause Overlay */}
        <AnimatePresence>
          {isPaused && !isGameOver && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 flex items-center justify-center z-20 backdrop-blur-[2px]"
            >
              <button
                onClick={() => setIsPaused(false)}
                className="text-2xl font-black text-magenta glitch-magenta"
                data-text="INITIATE_SEQUENCE"
              >
                INITIATE_SEQUENCE
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <div className="flex gap-6 text-[10px] font-bold text-cyan/40">
        <span>[ DIR_INPUT: ARROWS ]</span>
        <span>[ BREAK_EXEC: SPACE ]</span>
      </div>
    </div>
  );
}
