import { CountdownTimer } from '@/components/CountdownTimer';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const { toast } = useToast();

  const handleCountdownComplete = () => {
    toast({
      title: "🎉 HACKATHON COMPLETE! 🎉",
      description: "Time to present your amazing creation to the world!",
      duration: 10000,
    });
  };

  return (
    <CountdownTimer 
      duration={24 * 60 * 60 * 1000} // 24 hours
      onComplete={handleCountdownComplete}
    />
  );
};

export default Index;
