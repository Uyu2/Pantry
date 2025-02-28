import { useState } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import KitchenTimer from './kitchen-timer';
import Stopwatch from './stopwatch';

export default function DragableClock({ isVisible }: { isVisible: boolean }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  return (
    <motion.div
      drag
      dragMomentum={false}
      dragConstraints={{ left: -100, right: 800, top: -100, bottom: 400 }}
      style={{
        x: position.x,
        y: position.y,
        position: 'fixed',
        top: '20px',
        right: '8px',
        zIndex: 50,
        display: isVisible ? 'block' : 'none',
        cursor: 'move',
      }}
      onDragEnd={(event, info) => {
        setPosition({ x: position.x + info.offset.x, y: position.y + info.offset.y });
      }}
    >
      <div className="bg-white/95 rounded-lg shadow-lg p-4 w-[300px]">
        <Tabs defaultValue="timer" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="timer">Timer</TabsTrigger>
            <TabsTrigger value="stopwatch">Stopwatch</TabsTrigger>
          </TabsList>
          <TabsContent value="timer">
            <KitchenTimer />
          </TabsContent>
          <TabsContent value="stopwatch">
            <Stopwatch />
          </TabsContent>
        </Tabs>
      </div>
    </motion.div>
  );
}