import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Play, Pause, RotateCcw } from "lucide-react";

// Frog sound effects as base64 strings
const sounds = {
  start: "data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4LjI5LjEwMAAAAAAAAAAAAAAA//tQwAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAADAAAGhgBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVWqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqr///////////////////////////////////////////8AAAAATGF2YzU4LjU0AAAAAAAAAAAAAAAAJAYAAAAAAAAABoYoGtdsAAAAAAD/+1DEAAAHdAF19AAAJdW/L7w1gCR8+fPnz8uO4fFwMBhAwQMhAgIHygICAg+D8uBgICB8oCAgICAgICAgICBE/Ln5cDi4HxcXAwEBB8H5QEHwEDgQEBAiIAAAAABgIGCBAQEBAQEBAQEjACAYBgwEBAgICAgQEBAQEB8HwfBwEBAQEBAQEBAQEBAQECJ8oCAg+Ln5c/L",
  tick: "data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4LjI5LjEwMAAAAAAAAAAAAAAA//tQwAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAACAAAEYABmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmb///////////////////8AAAAATGF2YzU4LjU0AAAAAAAAAAAAAAAAJAQAAAAAAAAABGCoqz1SAAAAAAD/+1DEAAAGCAGHtAAABEw/L7YQAAI0NDQyMTExLy8vLy4uLi0tLSwrKysqKikpKSkpKCgoKCcnJycnJiYmJiYmJSUlJSUkJCQkIyMjIyMjIyIiIiIiISEhISEhICAf",
  complete: "data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4LjI5LjEwMAAAAAAAAAAAAAAA//tQwAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAAEAAAHKABmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmf39/f39/f39/f39/f39/f39/f39/f39/f3+ZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZ////////////////////AAAAATGF2YzU4LjU0AAAAAAAAAAAAAAAAJAUAAAAAAAAAByiQk/ZRAAAAAAD/+1DEAAAHCAGFtAAABBo/L7w1gARJSUlJSUlGRkZGRkZEREREREREQEBAQEBAQEA/Pz8/Pz8/Pz8+Pj4+Pj4+Pj4+Pj09PT09PT09PT09PT09PDw8PDw8PDw8PDw8PDw7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7",
};

export default function KitchenTimer() {
  const [minutes, setMinutes] = useState(5);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(minutes * 60 + seconds);
  const [isHopping, setIsHopping] = useState(false);

  const audioRefs = {
    start: useRef<HTMLAudioElement>(null),
    tick: useRef<HTMLAudioElement>(null),
    complete: useRef<HTMLAudioElement>(null),
  };

  // Function to safely play audio
  const playSound = async (audioRef: React.RefObject<HTMLAudioElement>) => {
    try {
      if (audioRef.current) {
        // Reset the audio to beginning
        audioRef.current.currentTime = 0;
        // Create and play the audio after user interaction
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            // Ignore audio play errors
          });
        }
      }
    } catch (error) {
      // Ignore audio errors
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            playSound(audioRefs.complete);
            return 0;
          }

          // Play tick sound every 15 seconds
          if (prev % 15 === 0) {
            playSound(audioRefs.tick);
          }

          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const startTimer = () => {
    if (timeLeft > 0) {
      setIsRunning(true);
      playSound(audioRefs.start);
    }
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(minutes * 60 + seconds);
  };

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = time % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Trigger hopping animation every 15 seconds
  useEffect(() => {
    if (timeLeft % 15 === 0 && timeLeft > 0) {
      setIsHopping(true);
      setTimeout(() => setIsHopping(false), 500);
    }
  }, [timeLeft]);

  return (
    <div className="bg-white/95 rounded-lg p-6 shadow-lg max-w-sm mx-auto">
      <div className="flex justify-center mb-6">
        <motion.div
          animate={{
            y: isHopping ? -20 : 0,
            rotate: isHopping ? [0, -10, 10, -5, 5, 0] : 0,
          }}
          transition={{
            duration: 0.5,
            type: "spring",
            stiffness: 300,
          }}
        >
          {/* Timer Frog */}
          <svg width="64" height="64" viewBox="0 0 64 64" className="bg-white rounded-full p-1">
            <circle cx="32" cy="32" r="28" fill="#90be6d" />
            {/* Eyes - they close when timer is done */}
            {timeLeft === 0 ? (
              <>
                <path d="M19 28 Q24 23, 29 28" stroke="black" strokeWidth="3" fill="none" />
                <path d="M35 28 Q40 23, 45 28" stroke="black" strokeWidth="3" fill="none" />
              </>
            ) : (
              <>
                <ellipse cx="24" cy="28" rx="5" ry="7" fill="black" />
                <ellipse cx="40" cy="28" rx="5" ry="7" fill="black" />
                <circle cx="22" cy="25" r="2" fill="white" opacity="0.7" />
                <circle cx="38" cy="25" r="2" fill="white" opacity="0.7" />
              </>
            )}
          </svg>
        </motion.div>
      </div>

      <div className="text-center mb-6">
        <div className="text-4xl font-bold font-mono text-primary">
          {formatTime(timeLeft)}
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="flex-1">
          <label className="block text-sm mb-1">Minutes</label>
          <Input
            type="number"
            min="0"
            max="59"
            value={minutes}
            onChange={(e) => {
              const value = Math.min(59, Math.max(0, parseInt(e.target.value) || 0));
              setMinutes(value);
              if (!isRunning) {
                setTimeLeft(value * 60 + seconds);
              }
            }}
            disabled={isRunning}
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm mb-1">Seconds</label>
          <Input
            type="number"
            min="0"
            max="59"
            value={seconds}
            onChange={(e) => {
              const value = Math.min(59, Math.max(0, parseInt(e.target.value) || 0));
              setSeconds(value);
              if (!isRunning) {
                setTimeLeft(minutes * 60 + value);
              }
            }}
            disabled={isRunning}
          />
        </div>
      </div>

      <div className="flex gap-2 justify-center">
        {!isRunning ? (
          <Button onClick={startTimer} disabled={timeLeft === 0}>
            <Play className="w-4 h-4 mr-1" />
            Start
          </Button>
        ) : (
          <Button onClick={pauseTimer} variant="secondary">
            <Pause className="w-4 h-4 mr-1" />
            Pause
          </Button>
        )}
        <Button onClick={resetTimer} variant="outline">
          <RotateCcw className="w-4 h-4 mr-1" />
          Reset
        </Button>
      </div>

      {/* Hidden audio elements */}
      <audio ref={audioRefs.start} src={sounds.start} />
      <audio ref={audioRefs.tick} src={sounds.tick} />
      <audio ref={audioRefs.complete} src={sounds.complete} />
    </div>
  );
}