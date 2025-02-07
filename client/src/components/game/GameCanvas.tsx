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

export function GameCanvas({ children, onAnswer, gamePhase, onDodgeComplete, wrongAnswers, speed }: GameCanvasProps) {
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
  const [explosionPosition, setExplosionPosition] = useState<{x: number, y: number} | null>(null);
  const [showGameOver, setShowGameOver] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

  // Add resize handler
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      setCanvasSize({
        width: window.innerWidth,
        height: Math.min(window.innerHeight * 0.7, 600)
      });
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle touch controls for mobile
  useEffect(() => {
    if (!isMobile || gamePhase !== 'DODGING' || isGameOver) return;

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const touch = e.touches[0];
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;

      setSpaceshipX(Math.max(50, Math.min(canvasSize.width - 50, x)));
      setSpaceshipPosition(Math.max(50, Math.min(canvasSize.height - 50, y)));
    };

    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    return () => document.removeEventListener('touchmove', handleTouchMove);
  }, [isMobile, gamePhase, isGameOver, canvasSize]);

  // Sound effects
  useEffect(() => {
    const createAudioElement = (src: string) => {
      const audio = new Audio(src);
      audio.volume = 0.5;
      return audio;
    };

    const explosionSound = createAudioElement('/sounds/explosion.mp3');
    const engineSound = createAudioElement('/sounds/engine.mp3');
    engineSound.loop = true;

    return () => {
      explosionSound.pause();
      engineSound.pause();
    };
  }, []);

  // Handle keyboard controls during dodge phase
  useEffect(() => {
    if (gamePhase !== 'DODGING' || isGameOver) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const moveAmount = 30 * speed;

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
  }, [gamePhase, speed, isGameOver]);

  // Handle collision detection during dodge phase
  const checkCollisions = useCallback(() => {
    // Define rocket hitbox with tighter bounds
    const rocketHitbox = {
      x: spaceshipX + 10, // Center the hitbox
      y: spaceshipPosition + 8, // Account for nose cone
      width: 20,  // Tighter width
      height: 32  // Include nose cone and body
    };

    asteroids.forEach(asteroid => {
      // Create a circular hitbox for asteroid
      const asteroidCenter = {
        x: asteroid.position.x + asteroid.size / 2,
        y: asteroid.position.y + asteroid.size / 2
      };
      const asteroidRadius = asteroid.size * 0.4; // Slightly smaller than visual size

      // Check if rocket corners are inside asteroid circle
      const corners = [
        { x: rocketHitbox.x, y: rocketHitbox.y }, // Top left
        { x: rocketHitbox.x + rocketHitbox.width, y: rocketHitbox.y }, // Top right
        { x: rocketHitbox.x, y: rocketHitbox.y + rocketHitbox.height }, // Bottom left
        { x: rocketHitbox.x + rocketHitbox.width, y: rocketHitbox.y + rocketHitbox.height } // Bottom right
      ];

      // Check each corner for collision
      for (const corner of corners) {
        const dx = corner.x - asteroidCenter.x;
        const dy = corner.y - asteroidCenter.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < asteroidRadius) {
          // Play explosion sound
          const explosionSound = new Audio('/sounds/explosion.mp3');
          explosionSound.volume = 0.5;
          explosionSound.play();

          // Set explosion at collision point
          setExplosionPosition({
            x: corner.x,
            y: corner.y
          });

          setIsGameOver(true);
          setShowGameOver(true);

          // Delay the dodge complete callback to show explosion animation
          setTimeout(() => {
            onDodgeComplete(false);
            setShowGameOver(false);
            setExplosionPosition(null);
            setIsGameOver(false);
          }, 2000);
          return;
        }
      }
    });
  }, [asteroids, spaceshipPosition, spaceshipX, onDodgeComplete]);

  useEffect(() => {
    if (gamePhase !== 'DODGING' || isGameOver) return;

    const interval = setInterval(checkCollisions, 16); // 60fps checks
    return () => clearInterval(interval);
  }, [gamePhase, isGameOver, checkCollisions]);

  // Add timer for dodge phase
  useEffect(() => {
    if (gamePhase === 'DODGING' && !isGameOver) {
      const timer = setTimeout(() => {
        setSpaceshipX(100);
        setSpaceshipPosition(300);
        onDodgeComplete(true);
      }, 9000); // 9 seconds for dodge phase

      return () => clearTimeout(timer);
    }
  }, [gamePhase, isGameOver, onDodgeComplete]);

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
    if (gamePhase !== 'DODGING' || isGameOver) return;

    const interval = setInterval(() => {
      if (asteroids.length < 5) {
        const baseSize = 20 + Math.random() * 30;
        const sizeIncrease = wrongAnswers * 5; 

        setAsteroids(prev => [...prev, {
          id: Date.now(),
          size: baseSize + sizeIncrease,
          position: {
            x: window.innerWidth,
            y: Math.random() * 400 + 100
          },
          rotation: Math.random() * 360,
          speed: speed * (1 + Math.random() * 0.5) 
        }]);
      }
    }, gamePhase === 'DODGING' ? 1000 : 2000);

    return () => clearInterval(interval);
  }, [asteroids.length, gamePhase, wrongAnswers, speed, isGameOver]);

  // Handle asteroids cleanup and phase transition
  useEffect(() => {
    let transitionTimeout: NodeJS.Timeout;
    const cleanup = setInterval(() => {
      setAsteroids(prev => {
        const remaining = prev.filter(asteroid => asteroid.position.x > -200);

        // If in dodge phase and all asteroids have passed, schedule transition
        if (gamePhase === 'DODGING' && remaining.length === 0 && prev.length > 0 && !isGameOver) {
          // Clear any existing transition timeout
          if (transitionTimeout) {
            clearTimeout(transitionTimeout);
          }

          // Set a new transition timeout
          transitionTimeout = setTimeout(() => {
            setSpaceshipX(100);
            setSpaceshipPosition(300);
            onDodgeComplete(true);
          }, 1000); // Delay transition to ensure last asteroid is fully off screen
        }
        return remaining;
      });
    }, 100);

    return () => {
      clearInterval(cleanup);
      if (transitionTimeout) {
        clearTimeout(transitionTimeout);
      }
    };
  }, [gamePhase, onDodgeComplete, isGameOver]);

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
        speed: (Math.random() * 0.5 + 0.1) * speed 
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
    <div className="relative w-full overflow-hidden rounded-lg shadow-2xl bg-gradient-to-b from-indigo-900 via-purple-900 to-pink-900"
         style={{ height: canvasSize.height }}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
        style={{ width: '100%', height: '100%' }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-pink-500/10" />

      {/* Game phase message - make it responsive */}
      {gamePhase === 'DODGING' && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white/90 px-4 py-2 rounded-full text-purple-900 font-bold text-sm md:text-base"
        >
          {isMobile ? "Touch and drag to move!" : "Use Arrow Keys to Move"}
        </motion.div>
      )}

      {/* Spaceship with responsive positioning */}
      <AnimatePresence>
        {!isGameOver && (
          <Spaceship
            position={spaceshipPosition}
            powered={isPowered}
            x={gamePhase === 'DODGING' ? spaceshipX : undefined}
          />
        )}
      </AnimatePresence>

      {/* Responsive explosion effect */}
      <AnimatePresence>
        {explosionPosition && (
          <motion.div
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: [1, 2], opacity: [1, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute"
            style={{
              left: explosionPosition.x - (isMobile ? 25 : 50),
              top: explosionPosition.y - (isMobile ? 25 : 50),
              width: isMobile ? 50 : 100,
              height: isMobile ? 50 : 100,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <div className="w-full h-full relative">
              <div className="absolute inset-0 bg-orange-500 rounded-full opacity-80" />
              <div className="absolute inset-2 bg-yellow-500 rounded-full opacity-90" />
              <div className="absolute inset-4 bg-white rounded-full" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Game Over Message with responsive text */}
      <AnimatePresence>
        {showGameOver && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="bg-black/80 text-white px-4 md:px-8 py-2 md:py-4 rounded-lg text-lg md:text-2xl font-bold">
              Game Over! Spaceship Destroyed
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Asteroids with responsive sizing */}
      <AnimatePresence>
        {asteroids.map(asteroid => (
          <Asteroid
            key={asteroid.id}
            size={isMobile ? asteroid.size * 0.7 : asteroid.size}
            position={asteroid.position}
            rotation={asteroid.rotation}
            speed={asteroid.speed}
          />
        ))}
      </AnimatePresence>

      {/* Math Problem UI with responsive layout */}
      {gamePhase === 'QUESTIONS' && (
        <motion.div
          className="relative z-10 h-full flex items-center justify-center p-4 md:p-8"
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