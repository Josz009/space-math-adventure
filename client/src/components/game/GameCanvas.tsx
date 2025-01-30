import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Spaceship } from './Spaceship';
import { Asteroid } from './Asteroid';
import React from 'react';

interface GameCanvasProps {
  children?: React.ReactNode;
  onAnswer: (correct: boolean) => void;
  gamePhase: 'QUESTIONS' | 'DODGING' | 'NEW_WORLD';
  onDodgeComplete: (survived: boolean) => void;
}

export function GameCanvas({ children, onAnswer, gamePhase, onDodgeComplete }: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [spaceshipPosition, setSpaceshipPosition] = useState(300);
  const [spaceshipX, setSpaceshipX] = useState(100); // X position for dodging phase
  const [isPowered, setIsPowered] = useState(false);
  const [asteroids, setAsteroids] = useState<Array<{ id: number; size: number; position: { x: number; y: number }; rotation: number }>>([]);
  const [isGameOver, setIsGameOver] = useState(false);

  // Handle keyboard controls during dodge phase
  useEffect(() => {
    if (gamePhase !== 'DODGING') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          setSpaceshipPosition(prev => Math.max(50, prev - 30));
          break;
        case 'ArrowDown':
          setSpaceshipPosition(prev => Math.min(550, prev + 30));
          break;
        case 'ArrowLeft':
          setSpaceshipX(prev => Math.max(50, prev - 30));
          break;
        case 'ArrowRight':
          setSpaceshipX(prev => Math.min(750, prev + 30));
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gamePhase]);

  // Handle collision detection during dodge phase
  useEffect(() => {
    if (gamePhase !== 'DODGING') return;

    const checkCollisions = () => {
      const shipRadius = 20;
      const shipBounds = {
        x: spaceshipX,
        y: spaceshipPosition,
        radius: shipRadius
      };

      for (const asteroid of asteroids) {
        const asteroidBounds = {
          x: asteroid.position.x,
          y: asteroid.position.y,
          radius: asteroid.size / 2
        };

        const dx = shipBounds.x - asteroidBounds.x;
        const dy = shipBounds.y - asteroidBounds.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < shipBounds.radius + asteroidBounds.radius) {
          setIsGameOver(true);
          onDodgeComplete(false);
          return;
        }
      }
    };

    const interval = setInterval(checkCollisions, 100);
    return () => clearInterval(interval);
  }, [gamePhase, asteroids, spaceshipPosition, spaceshipX, onDodgeComplete]);

  // Handle correct/incorrect answers during question phase
  const handleAnswer = (correct: boolean) => {
    if (correct) {
      setIsPowered(true);
      setSpaceshipPosition(prev => Math.max(100, prev - 50));
      setTimeout(() => setIsPowered(false), 1000);
    }
    onAnswer(correct);
  };

  // Generate new asteroids periodically during dodge phase
  useEffect(() => {
    if (gamePhase !== 'DODGING') return;

    const interval = setInterval(() => {
      if (asteroids.length < 5) {
        setAsteroids(prev => [...prev, {
          id: Date.now(),
          size: Math.random() * 30 + 20,
          position: { 
            x: window.innerWidth,
            y: Math.random() * 400 + 100
          },
          rotation: Math.random() * 360
        }]);
      }
    }, gamePhase === 'DODGING' ? 1000 : 2000);

    return () => clearInterval(interval);
  }, [asteroids.length, gamePhase]);

  // Clean up asteroids that have moved off screen
  useEffect(() => {
    const cleanup = setInterval(() => {
      setAsteroids(prev => {
        const remaining = prev.filter(asteroid => asteroid.position.x > -200);
        // If in dodge phase and all asteroids are cleared, complete the phase
        if (gamePhase === 'DODGING' && remaining.length === 0 && prev.length > 0) {
          onDodgeComplete(true);
        }
        return remaining;
      });
    }, 1000);

    return () => clearInterval(cleanup);
  }, [gamePhase, onDodgeComplete]);

  // Stars background effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const stars: Array<{ x: number; y: number; size: number; speed: number }> = [];
    const numStars = 150;

    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2,
        speed: Math.random() * 0.5 + 0.1
      });
    }

    let animationFrameId: number;
    const render = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      stars.forEach(star => {
        star.y += star.speed;
        if (star.y > canvas.height) {
          star.y = 0;
          star.x = Math.random() * canvas.width;
        }

        ctx.fillStyle = `rgba(255, 255, 255, ${0.5 + Math.random() * 0.5})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = window.requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="relative w-full h-[600px] overflow-hidden rounded-2xl shadow-2xl">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 bg-gradient-to-b from-indigo-900 via-purple-900 to-pink-900"
        style={{ width: '100%', height: '100%' }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-pink-500/10" />

      {/* Game phase message */}
      {gamePhase === 'DODGING' && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white/90 px-6 py-2 rounded-full text-purple-900 font-bold"
        >
          Dodge the Asteroids! Use Arrow Keys to Move
        </motion.div>
      )}

      {/* Spaceship */}
      <Spaceship 
        position={spaceshipPosition} 
        powered={isPowered} 
        x={gamePhase === 'DODGING' ? spaceshipX : undefined}
      />

      {/* Asteroids */}
      <AnimatePresence>
        {asteroids.map(asteroid => (
          <Asteroid
            key={asteroid.id}
            size={asteroid.size}
            position={asteroid.position}
            rotation={asteroid.rotation}
          />
        ))}
      </AnimatePresence>

      {/* Math Problem UI */}
      {gamePhase === 'QUESTIONS' && (
        <motion.div 
          className="relative z-10 h-full flex items-center justify-center p-8"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ 
            type: "spring",
            stiffness: 200,
            damping: 20
          }}
        >
          {children && React.cloneElement(children as React.ReactElement, { onAnswer: handleAnswer })}
        </motion.div>
      )}
    </div>
  );
}