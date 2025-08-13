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
  const [startTime] = useState(() => Date.now());

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
    const endTime = startTime + duration;
    
    const updateTimer = () => {
      const newTime = calculateTimeRemaining(endTime);
      const prevTime = timeRemaining;
      
      setTimeRemaining(newTime);

      // Check for milestone animations
      const totalMinutes = Math.floor(newTime.total / (1000 * 60));
      const prevTotalMinutes = Math.floor(prevTime.total / (1000 * 60));

      // Every 30 minutes (milestone)
      if (totalMinutes > 0 && totalMinutes % 30 === 0 && totalMinutes !== prevTotalMinutes) {
        setAnimationType('milestone');
        setShowAnimation(true);
        setTimeout(() => setShowAnimation(false), 3000);
      }

      // Every hour
      if (totalMinutes > 0 && totalMinutes % 60 === 0 && totalMinutes !== prevTotalMinutes) {
        setAnimationType('hour');
        setShowAnimation(true);
        setTimeout(() => setShowAnimation(false), 5000);
      }

      // Final hour
      if (newTime.hours === 0 && prevTime.hours > 0) {
        setAnimationType('final');
        setShowAnimation(true);
        setTimeout(() => setShowAnimation(false), 3000);
      }

      // Timer complete
      if (newTime.total <= 0 && prevTime.total > 0) {
        setIsActive(false);
        onComplete?.();
      }
    };

    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [duration, calculateTimeRemaining, onComplete, startTime, timeRemaining]);

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
      classes += " animate-warning-pulse";
    }
    
    return classes;
  };

  const getSeparatorClasses = () => {
    let classes = "timer-separator";
    
    if (timeRemaining.hours === 0) {
      classes += " animate-warning-pulse";
    }
    
    return classes;
  };

  const getProgressPercentage = () => {
    return Math.max(0, Math.round(((duration - timeRemaining.total) / duration) * 100));
  };

  return (
    <div className="timer-container cyber-grid">
      <ParticleSystem />
      
      {/* Hackathon Title */}
      <div className="text-center mb-8 lg:mb-12">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black mb-4">
          <span className="motivation-text">HACKATHON</span>
        </h1>
        <p className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground uppercase tracking-[0.3em] font-medium">
          Code • Create • Conquer
        </p>
      </div>

      {/* Main Timer Display */}
      <div className="cyber-card p-6 sm:p-8 md:p-12 lg:p-16 mb-8 lg:mb-12 max-w-6xl mx-auto">
        <div className="timer-display">
          {/* Hours */}
          <div className="text-center">
            <div 
              className={getTimerClasses()}
              onClick={handleTimerClick}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && handleTimerClick()}
              aria-label={`${timeRemaining.hours} hours remaining`}
            >
              {formatNumber(timeRemaining.hours)}
            </div>
            <div className="timer-label mt-2">Hours</div>
          </div>

          {/* Separator */}
          <div className={getSeparatorClasses()}>:</div>

          {/* Minutes */}
          <div className="text-center">
            <div 
              className={getTimerClasses()}
              onClick={handleTimerClick}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && handleTimerClick()}
              aria-label={`${timeRemaining.minutes} minutes remaining`}
            >
              {formatNumber(timeRemaining.minutes)}
            </div>
            <div className="timer-label mt-2">Minutes</div>
          </div>

          {/* Separator */}
          <div className={getSeparatorClasses()}>:</div>

          {/* Seconds */}
          <div className="text-center">
            <div 
              className={getTimerClasses()}
              onClick={handleTimerClick}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && handleTimerClick()}
              aria-label={`${timeRemaining.seconds} seconds remaining`}
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

      {/* Status and Info Panel */}
      <div className="fixed bottom-4 left-4 right-4 flex justify-between items-end z-10">
        {/* Status Indicator */}
        <div className="status-indicator">
          <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
            isActive ? 'bg-secondary animate-pulse shadow-[0_0_20px_hsl(120_100%_60%/0.8)]' : 'bg-destructive'
          }`} />
          <span className="text-sm font-medium">
            {isActive ? 'ACTIVE' : 'COMPLETE'}
          </span>
        </div>

        {/* Progress Info */}
        <div className="status-indicator">
          <div className="text-right">
            {timeRemaining.total > 0 ? (
              <>
                <div className="text-xs text-muted-foreground">Progress</div>
                <div className="text-sm font-mono font-bold text-primary">
                  {getProgressPercentage()}% Complete
                </div>
              </>
            ) : (
              <div className="text-sm font-bold text-secondary">🎉 COMPLETE! 🎉</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};