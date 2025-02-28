import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";

export default function Stopwatch() {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning) {
      interval = setInterval(() => {
        setTime(prev => prev + 10); // Update every 10ms for smoother display
      }, 10);
    }

    return () => clearInterval(interval);
  }, [isRunning]);

  const handleStartStop = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
    setLaps([]);
  };

  const handleLap = () => {
    setLaps(prev => [...prev, time]);
  };

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const milliseconds = Math.floor((ms % 1000) / 10);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4"
    >
      <div className="text-center mb-6">
        <div className="text-4xl font-mono font-bold text-primary">
          {formatTime(time)}
        </div>
      </div>

      <div className="flex gap-2 justify-center mb-4">
        <Button onClick={handleStartStop}>
          {isRunning ? (
            <>
              <Pause className="w-4 h-4 mr-1" />
              Pause
            </>
          ) : (
            <>
              <Play className="w-4 h-4 mr-1" />
              Start
            </>
          )}
        </Button>
        <Button variant="outline" onClick={handleLap} disabled={!isRunning}>
          Lap
        </Button>
        <Button variant="outline" onClick={handleReset}>
          <RotateCcw className="w-4 h-4 mr-1" />
          Reset
        </Button>
      </div>

      {laps.length > 0 && (
        <div className="mt-4 max-h-32 overflow-y-auto">
          <div className="text-sm font-medium mb-2">Laps</div>
          {laps.map((lap, index) => (
            <div key={index} className="flex justify-between py-1 border-b border-gray-200">
              <span>Lap {index + 1}</span>
              <span className="font-mono">{formatTime(lap)}</span>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
