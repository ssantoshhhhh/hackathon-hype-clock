import { useEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  speed: number;
  opacity: number;
}

export const ParticleSystem = () => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    // Create initial particles
    const initialParticles: Particle[] = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      color: ['primary', 'secondary', 'accent'][Math.floor(Math.random() * 3)],
      speed: Math.random() * 0.5 + 0.1,
      opacity: Math.random() * 0.5 + 0.1
    }));

    setParticles(initialParticles);

    // Animate particles
    const interval = setInterval(() => {
      setParticles(prev => prev.map(particle => ({
        ...particle,
        y: particle.y <= 0 ? 100 : particle.y - particle.speed,
        opacity: Math.sin(Date.now() * 0.001 + particle.id) * 0.3 + 0.4
      })));
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {particles.map(particle => (
        <div
          key={particle.id}
          className={`absolute rounded-full bg-${particle.color} transition-opacity duration-100`}
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            opacity: particle.opacity,
            boxShadow: `0 0 ${particle.size * 2}px currentColor`
          }}
        />
      ))}
    </div>
  );
};