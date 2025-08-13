import { useEffect, useState } from 'react';

interface TimeRemaining {
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
}

interface AnimationTriggerProps {
  show: boolean;
  type: 'milestone' | 'hour' | 'final';
  timeRemaining: TimeRemaining;
}

const confettiColors = [
  'bg-primary',
  'bg-secondary', 
  'bg-accent',
  'bg-neon-cyan',
  'bg-neon-pink',
  'bg-neon-orange'
];

export const AnimationTrigger = ({ show, type, timeRemaining }: AnimationTriggerProps) => {
  const [confetti, setConfetti] = useState<Array<{ id: number; color: string; delay: number; x: number; y: number }>>([]);
  const [showFireworks, setShowFireworks] = useState(false);

  useEffect(() => {
    if (show) {
      if (type === 'milestone') {
        // Create confetti burst
        const newConfetti = Array.from({ length: 20 }, (_, i) => ({
          id: i,
          color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
          delay: Math.random() * 0.5,
          x: Math.random() * 100,
          y: Math.random() * 100
        }));
        setConfetti(newConfetti);
        setTimeout(() => setConfetti([]), 2000);
      } else if (type === 'hour') {
        // Trigger fireworks
        setShowFireworks(true);
        setTimeout(() => setShowFireworks(false), 4000);
      }
    }
  }, [show, type]);

  const getMessage = () => {
    if (type === 'final') {
      return "🚨 FINAL HOUR ACTIVATED! 🚨";
    } else if (type === 'hour') {
      const hoursLeft = timeRemaining.hours;
      return `🎉 ${hoursLeft} HOUR${hoursLeft !== 1 ? 'S' : ''} REMAINING! 🎉`;
    } else {
      return "🎯 MILESTONE REACHED! 🎯";
    }
  };

  const getAnimationClasses = () => {
    let classes = "text-4xl md:text-6xl lg:text-8xl font-black text-center";
    
    if (type === 'final') {
      classes += " text-red-400 animate-pulse";
    } else if (type === 'hour') {
      classes += " motivation-text";
    } else {
      classes += " text-secondary";
    }
    
    return classes;
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      {/* Confetti for milestones */}
      {type === 'milestone' && confetti.map((piece) => (
        <div
          key={piece.id}
          className={`absolute w-3 h-3 ${piece.color} animate-confetti-burst`}
          style={{
            left: `${piece.x}%`,
            top: `${piece.y}%`,
            animationDelay: `${piece.delay}s`
          }}
        />
      ))}

      {/* Fireworks for hours */}
      {type === 'hour' && showFireworks && (
        <div className="absolute inset-0">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-primary rounded-full"
              style={{
                left: `${20 + i * 15}%`,
                top: `${10 + Math.random() * 30}%`,
                animation: `confetti-burst 2s ease-out ${i * 0.3}s forwards`
              }}
            />
          ))}
          {[...Array(6)].map((_, i) => (
            <div
              key={`secondary-${i}`}
              className="absolute w-2 h-2 bg-secondary rounded-full"
              style={{
                left: `${25 + i * 15}%`,
                top: `${40 + Math.random() * 30}%`,
                animation: `confetti-burst 2s ease-out ${i * 0.3 + 1}s forwards`
              }}
            />
          ))}
        </div>
      )}

      {/* Central message */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="cyber-card p-8 md:p-12 max-w-4xl mx-auto animate-milestone-pulse">
          <div className={getAnimationClasses()}>
            {getMessage()}
          </div>
          
          {type === 'hour' && (
            <div className="mt-4 text-xl md:text-2xl text-center text-muted-foreground">
              Keep pushing! Innovation never sleeps! 💪
            </div>
          )}
          
          {type === 'final' && (
            <div className="mt-4 text-xl md:text-2xl text-center text-muted-foreground animate-pulse">
              This is your moment - make it count! ⚡
            </div>
          )}
        </div>
      </div>

      {/* Full screen glow effect for final hour */}
      {type === 'final' && (
        <div className="absolute inset-0 bg-red-500/20 animate-pulse" />
      )}
    </div>
  );
};