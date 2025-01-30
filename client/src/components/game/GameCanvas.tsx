import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Spaceship } from './Spaceship';
import { Asteroid } from './Asteroid';
import React from 'react';

interface GameCanvasProps {
  children?: React.ReactNode;
  onAnswer: (correct: boolean) => void;
}

export function GameCanvas({ children, onAnswer }: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [spaceshipPosition, setSpaceshipPosition] = useState(300);
  const [isPowered, setIsPowered] = useState(false);
  const [asteroids, setAsteroids] = useState<Array<{ id: number; size: number; position: { x: number; y: number }; rotation: number }>>([]);

  // Handle correct/incorrect answers
  const handleAnswer = (correct: boolean) => {
    if (correct) {
      setIsPowered(true);
      setSpaceshipPosition(prev => Math.max(100, prev - 50));
      setTimeout(() => setIsPowered(false), 1000);
    }
    onAnswer(correct);
  };

  // Generate new asteroids periodically
  useEffect(() => {
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
    }, 2000);

    return () => clearInterval(interval);
  }, [asteroids.length]); // Changed dependency to asteroids.length to avoid unnecessary re-renders

  // Clean up asteroids that have moved off screen
  useEffect(() => {
    const cleanup = setInterval(() => {
      setAsteroids(prev => prev.filter(asteroid => asteroid.position.x > -200));
    }, 1000);

    return () => clearInterval(cleanup);
  }, []);

  // Stars background effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Star properties
    const stars: Array<{ x: number; y: number; size: number; speed: number }> = [];
    const numStars = 150;

    // Initialize stars
    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2,
        speed: Math.random() * 0.5 + 0.1
      });
    }

    // Animation loop
    let animationFrameId: number;
    const render = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw stars
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

      {/* Spaceship */}
      <Spaceship position={spaceshipPosition} powered={isPowered} />

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
    </div>
  );
}