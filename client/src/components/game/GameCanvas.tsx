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
  wrongAnswers: number;
  speed: number;
}

export function GameCanvas({
  children,
  onAnswer,
  gamePhase,
  onDodgeComplete,
  wrongAnswers,
  speed
}: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [spaceshipPosition, setSpaceshipPosition] = useState(300);
  const [spaceshipX, setSpaceshipX] = useState(100);
  const [isPowered, setIsPowered] = useState(false);
  const [asteroids, setAsteroids] = useState<Array<{
    id: number;
    size: number;
    position: { x: number; y: number };
    rotation: number;
    speed: number;
  }>>([]);
  const [isGameOver, setIsGameOver] = useState(false);

  // Handle keyboard controls during dodge phase
  useEffect(() => {
    if (gamePhase !== 'DODGING') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const moveAmount = 30 * speed; // Increased movement speed based on performance

      switch (e.key) {
        case 'ArrowUp':
          setSpaceshipPosition(prev => Math.max(50, prev - moveAmount));
          break;
        case 'ArrowDown':
          setSpaceshipPosition(prev => Math.min(550, prev + moveAmount));
          break;
        case 'ArrowLeft':
          setSpaceshipX(prev => Math.max(50, prev - moveAmount));
          break;
        case 'ArrowRight':
          setSpaceshipX(prev => Math.min(750, prev + moveAmount));
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gamePhase, speed]);

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
        const baseSize = 20 + Math.random() * 30;
        const sizeIncrease = wrongAnswers * 5; // Asteroids get bigger with wrong answers

        setAsteroids(prev => [...prev, {
          id: Date.now(),
          size: baseSize + sizeIncrease,
          position: {
            x: window.innerWidth,
            y: Math.random() * 400 + 100
          },
          rotation: Math.random() * 360,
          speed: speed * (1 + Math.random() * 0.5) // Asteroids move faster with better performance
        }]);
      }
    }, gamePhase === 'DODGING' ? 1000 : 2000);

    return () => clearInterval(interval);
  }, [asteroids.length, gamePhase, wrongAnswers, speed]);

  // Clean up asteroids that have moved off screen
  useEffect(() => {
    const cleanup = setInterval(() => {
      setAsteroids(prev => {
        const remaining = prev.filter(asteroid => asteroid.position.x > -200);
        // If in dodge phase and all asteroids are cleared, complete the phase
        if (gamePhase === 'DODGING' && remaining.length === 0 && prev.length > 0) {
          // Reset ship position and trigger completion
          setSpaceshipX(100);
          setSpaceshipPosition(300);
          onDodgeComplete(true);
        }
        return remaining;
      });
    }, 1000);

    return () => clearInterval(cleanup);
  }, [gamePhase, onDodgeComplete]);

  // When game phase changes to DODGING, spawn initial asteroids
  useEffect(() => {
    if (gamePhase === 'DODGING') {
      // Spawn initial wave of asteroids
      const baseSize = 20 + Math.random() * 30;
      const sizeIncrease = wrongAnswers * 5;

      setAsteroids([
        {
          id: Date.now(),
          size: baseSize + sizeIncrease,
          position: { x: window.innerWidth, y: Math.random() * 400 + 100 },
          rotation: Math.random() * 360,
          speed: speed * (1 + Math.random() * 0.5)
        }
      ]);
    } else {
      // Clear asteroids when not in dodging phase
      setAsteroids([]);
    }
  }, [gamePhase, wrongAnswers, speed]);

  // Stars background effect with speed modification
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
        speed: (Math.random() * 0.5 + 0.1) * speed // Stars move faster with better performance
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
  }, [speed]);

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