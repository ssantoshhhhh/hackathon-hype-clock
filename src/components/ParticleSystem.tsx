import { useEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  speed: number;
  opacity: number;
  delay: number;
}

export const ParticleSystem = () => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    // Create initial particles
    const initialParticles: Particle[] = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: 100 + Math.random() * 50, // Start below viewport
      size: Math.random() * 4 + 2,
      color: ['primary', 'secondary', 'accent', 'neon-cyan', 'neon-pink'][Math.floor(Math.random() * 5)],
      speed: Math.random() * 0.3 + 0.1,
      opacity: Math.random() * 0.6 + 0.2,
      delay: Math.random() * 5
    }));

    setParticles(initialParticles);

    // Animate particles
    const interval = setInterval(() => {
      setParticles(prev => prev.map(particle => {
        const newY = particle.y <= -10 ? 110 : particle.y - particle.speed;
        return {
          ...particle,
          y: newY,
          opacity: Math.sin((Date.now() * 0.001) + particle.delay) * 0.3 + 0.5
        };
      }));
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map(particle => (
        <div
          key={particle.id}
          className={`particle absolute transition-opacity duration-200`}
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            opacity: particle.opacity,
            backgroundColor: `hsl(var(--${particle.color}))`,
            boxShadow: `0 0 ${particle.size * 3}px hsl(var(--${particle.color}) / 0.8)`,
            animationDelay: `${particle.delay}s`
          }}
        />
      ))}
    </div>
  );
};