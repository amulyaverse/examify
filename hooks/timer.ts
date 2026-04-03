import { useState, useEffect, useRef } from 'react';

interface TimerOptions {
  autoSubmit?: boolean;
  onExpire?: () => void;
  onTick?: (timeLeft: number) => void;
}

export function useTimer(initialTime: number, options?: TimerOptions) {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isRunning) return;
    
    if (timeLeft <= 0) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (options?.onExpire) {
        options.onExpire();
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        const newTime = prev - 1;
        if (options?.onTick) {
          options.onTick(newTime);
        }
        return newTime;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [timeLeft, isRunning, options]);

  const pauseTimer = () => setIsRunning(false);
  const resumeTimer = () => setIsRunning(true);
  const resetTimer = (newTime: number) => {
    setTimeLeft(newTime);
    setIsRunning(true);
  };

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimeStatus = (): 'critical' | 'warning' | 'normal' => {
    if (timeLeft <= 60) return 'critical';
    if (timeLeft <= 300) return 'warning';
    return 'normal';
  };

  const getTimeColor = (): string => {
    const status = getTimeStatus();
    switch (status) {
      case 'critical': return 'text-red-600';
      case 'warning': return 'text-yellow-600';
      default: return 'text-green-600';
    }
  };

  return {
    timeLeft,
    isRunning,
    pauseTimer,
    resumeTimer,
    resetTimer,
    formatTime,
    getTimeStatus,
    getTimeColor
  };
}