import { useState, useEffect } from 'react';

interface TimeRemaining {
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
}

interface MotivationalTextProps {
  timeRemaining: TimeRemaining;
  isActive: boolean;
}

const motivationalQuotes = [
  "Keep coding, keep creating! 💻",
  "Innovation happens here! ⚡",
  "Turn caffeine into code! ☕",
  "Build the future today! 🚀",
  "Debug the world, one line at a time! 🌍",
  "Code like there's no tomorrow! ⏰",
  "Think big, code bigger! 💡",
  "Make it work, make it better! 🔧",
  "From idea to reality! ✨",
  "Push your limits! 💪",
  "Create something amazing! 🎯",
  "The magic happens in the code! 🎩",
  "Solve problems, change the world! 🌟",
  "Code, test, repeat! 🔄",
  "Innovation in progress! ⚙️"
];

const hourlyMessages = [
  "24 hours of pure innovation ahead! 🎯",
  "23 hours to make your mark! 💥",
  "22 hours of coding excellence! ⭐",
  "21 hours to build something incredible! 🚀",
  "20 hours of non-stop creativity! 🎨",
  "19 hours to change the world! 🌍",
  "18 hours of breakthrough moments! 💡",
  "17 hours to code your dreams! ✨",
  "16 hours of innovation left! ⚡",
  "15 hours to make it perfect! 🎯",
  "14 hours of coding mastery! 👑",
  "13 hours to ship something amazing! 📦",
  "12 hours - halfway to greatness! 🏃‍♂️",
  "11 hours of intense focus! 🎯",
  "10 hours to polish your creation! ✨",
  "9 hours - the final push begins! 💪",
  "8 hours of dedication left! ⏰",
  "7 hours to make it shine! 🌟",
  "6 hours - almost there! 🏁",
  "5 hours - time to optimize! ⚡",
  "4 hours - final features! 🔧",
  "3 hours - debugging time! 🐛",
  "2 hours - presentation prep! 📊",
  "1 hour - final touches! 🎨",
  "Time's up! Present your masterpiece! 🎉"
];

const finalHourMessages = [
  "🚨 FINAL HOUR - Make every second count!",
  "⏰ 60 minutes to finish strong!",
  "🔥 This is it - the final sprint!",
  "💥 Last chance to add that killer feature!",
  "⚡ Final hour energy - you've got this!"
];

export const MotivationalText = ({ timeRemaining, isActive }: MotivationalTextProps) => {
  const [currentQuote, setCurrentQuote] = useState(0);
  const [showSpecialMessage, setShowSpecialMessage] = useState(false);

  useEffect(() => {
    const quoteInterval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % motivationalQuotes.length);
    }, 8000); // Change quote every 8 seconds

    return () => clearInterval(quoteInterval);
  }, []);

  useEffect(() => {
    // Show special message for milestones
    const totalMinutes = Math.floor(timeRemaining.total / (1000 * 60));
    if (totalMinutes % 30 === 0 && totalMinutes > 0) {
      setShowSpecialMessage(true);
      setTimeout(() => setShowSpecialMessage(false), 4000);
    }
  }, [timeRemaining.total]);

  const getMessage = () => {
    if (!isActive) {
      return "🎉 Congratulations! Time to present your amazing creation! 🎉";
    }

    if (timeRemaining.hours === 0) {
      return finalHourMessages[Math.floor(Math.random() * finalHourMessages.length)];
    }

    if (showSpecialMessage) {
      if (timeRemaining.minutes === 0) {
        // Hour milestone
        return hourlyMessages[24 - timeRemaining.hours];
      } else {
        // 30-minute milestone
        return "🎯 30-minute checkpoint - Keep the momentum going!";
      }
    }

    return motivationalQuotes[currentQuote];
  };

  const getTextClasses = () => {
    let classes = "motivation-text text-center max-w-4xl mx-auto transition-all duration-500";
    
    if (timeRemaining.hours === 0) {
      classes += " text-red-400 animate-pulse";
    }
    
    if (showSpecialMessage) {
      classes += " scale-110";
    }

    return classes;
  };

  return (
    <div className="mb-12">
      <div className={getTextClasses()}>
        {getMessage()}
      </div>
      
      {/* Progress indicators */}
      <div className="mt-8 flex justify-center space-x-2">
        {[...Array(24)].map((_, i) => {
          const hoursPassed = 24 - timeRemaining.hours;
          const isCompleted = i < hoursPassed;
          const isCurrent = i === hoursPassed && isActive;
          
          return (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                isCompleted 
                  ? 'bg-secondary glow-secondary' 
                  : isCurrent 
                  ? 'bg-primary glow-primary animate-pulse' 
                  : 'bg-muted'
              }`}
            />
          );
        })}
      </div>
      
      {/* Time progress bar */}
      <div className="mt-4 w-full max-w-md mx-auto">
        <div className="h-1 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-1000 ease-out"
            style={{ 
              width: `${Math.max(0, ((24 * 60 * 60 * 1000 - timeRemaining.total) / (24 * 60 * 60 * 1000)) * 100)}%` 
            }}
          />
        </div>
        <div className="mt-2 text-center">
          <span className="text-xs text-muted-foreground">
            {Math.max(0, Math.round(((24 * 60 * 60 * 1000 - timeRemaining.total) / (24 * 60 * 60 * 1000)) * 100))}% Complete
          </span>
        </div>
      </div>
    </div>
  );
};