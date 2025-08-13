import { useState, useEffect, useCallback } from 'react';
import { MotivationalText } from './MotivationalText';
import { AnimationTrigger } from './AnimationTrigger';
import { ParticleSystem } from './ParticleSystem';

interface TimeRemaining {
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
}

interface CountdownTimerProps {
  duration?: number; // Duration in milliseconds (default 24 hours)
  onComplete?: () => void;
}

export const CountdownTimer = ({ 
  duration = 24 * 60 * 60 * 1000, // 24 hours in milliseconds
  onComplete 
}: CountdownTimerProps) => {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>({
    hours: 24,
    minutes: 0,
    seconds: 0,
    total: duration
  });
  const [isActive, setIsActive] = useState(true);
  const [showAnimation, setShowAnimation] = useState(false);
  const [animationType, setAnimationType] = useState<'milestone' | 'hour' | 'final'>('milestone');
  const [clickEffect, setClickEffect] = useState(false);

  const calculateTimeRemaining = useCallback((endTime: number) => {
    const now = Date.now();
    const difference = endTime - now;

    if (difference <= 0) {
      return {
        hours: 0,
        minutes: 0,
        seconds: 0,
        total: 0
      };
    }

    const hours = Math.floor(difference / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    return {
      hours,
      minutes,
      seconds,
      total: difference
    };
  }, []);

  useEffect(() => {
    const endTime = Date.now() + duration;
    
    const interval = setInterval(() => {
      const newTime = calculateTimeRemaining(endTime);
      setTimeRemaining(newTime);

      // Check for milestone animations
      const totalMinutes = Math.floor(newTime.total / (1000 * 60));
      const prevTotalMinutes = Math.floor(timeRemaining.total / (1000 * 60));

      // Every 30 minutes (milestone)
      if (totalMinutes % 30 === 0 && totalMinutes !== prevTotalMinutes && totalMinutes > 0) {
        setAnimationType('milestone');
        setShowAnimation(true);
        setTimeout(() => setShowAnimation(false), 3000);
      }

      // Every hour
      if (totalMinutes % 60 === 0 && totalMinutes !== prevTotalMinutes && totalMinutes > 0) {
        setAnimationType('hour');
        setShowAnimation(true);
        setTimeout(() => setShowAnimation(false), 5000);
      }

      // Final hour
      if (newTime.hours === 0 && timeRemaining.hours > 0) {
        setAnimationType('final');
        setShowAnimation(true);
        setTimeout(() => setShowAnimation(false), 3000);
      }

      // Timer complete
      if (newTime.total <= 0) {
        setIsActive(false);
        onComplete?.();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [duration, calculateTimeRemaining, onComplete, timeRemaining.total, timeRemaining.hours]);

  const handleTimerClick = () => {
    setClickEffect(true);
    setTimeout(() => setClickEffect(false), 600);
  };

  const formatNumber = (num: number): string => {
    return num.toString().padStart(2, '0');
  };

  const getTimerClasses = () => {
    let classes = "timer-digit transition-all duration-300 cursor-pointer select-none";
    
    if (clickEffect) {
      classes += " animate-milestone-pulse";
    }
    
    if (timeRemaining.hours === 0) {
      classes += " text-red-500";
    }
    
    return classes;
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center cyber-grid">
      <ParticleSystem />
      
      {/* Hackathon Title */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4">
          <span className="motivation-text">HACKATHON</span>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground uppercase tracking-widest">
          Code • Create • Conquer
        </p>
      </div>

      {/* Main Timer Display */}
      <div className="cyber-card p-8 md:p-12 lg:p-16 mb-8">
        <div className="flex items-center justify-center space-x-4 md:space-x-8">
          {/* Hours */}
          <div className="text-center">
            <div 
              className={getTimerClasses()}
              onClick={handleTimerClick}
            >
              {formatNumber(timeRemaining.hours)}
            </div>
            <div className="timer-label mt-2">Hours</div>
          </div>

          {/* Separator */}
          <div className="timer-separator">:</div>

          {/* Minutes */}
          <div className="text-center">
            <div 
              className={getTimerClasses()}
              onClick={handleTimerClick}
            >
              {formatNumber(timeRemaining.minutes)}
            </div>
            <div className="timer-label mt-2">Minutes</div>
          </div>

          {/* Separator */}
          <div className="timer-separator">:</div>

          {/* Seconds */}
          <div className="text-center">
            <div 
              className={getTimerClasses()}
              onClick={handleTimerClick}
            >
              {formatNumber(timeRemaining.seconds)}
            </div>
            <div className="timer-label mt-2">Seconds</div>
          </div>
        </div>
      </div>

      {/* Motivational Text */}
      <MotivationalText 
        timeRemaining={timeRemaining}
        isActive={isActive}
      />

      {/* Animation Trigger */}
      <AnimationTrigger 
        show={showAnimation}
        type={animationType}
        timeRemaining={timeRemaining}
      />

      {/* Status Indicator */}
      <div className="absolute bottom-8 left-8 flex items-center space-x-2">
        <div className={`w-3 h-3 rounded-full ${isActive ? 'bg-secondary animate-pulse' : 'bg-red-500'}`} />
        <span className="text-sm text-muted-foreground">
          {isActive ? 'ACTIVE' : 'COMPLETE'}
        </span>
      </div>

      {/* Timer Info */}
      <div className="absolute bottom-8 right-8 text-right">
        <div className="text-sm text-muted-foreground">
          {timeRemaining.total > 0 ? (
            <>
              <div>Time Remaining</div>
              <div className="text-primary font-mono">
                {Math.floor(timeRemaining.total / (1000 * 60 * 60))}h {Math.floor((timeRemaining.total % (1000 * 60 * 60)) / (1000 * 60))}m
              </div>
            </>
          ) : (
            <div className="text-secondary font-bold">🎉 HACKATHON COMPLETE! 🎉</div>
          )}
        </div>
      </div>
    </div>
  );
};