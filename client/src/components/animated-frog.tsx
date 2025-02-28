import { useState, useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';

// Frog sound effects as base64 strings
const sounds = {
  ribbit: "data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4LjI5LjEwMAAAAAAAAAAAAAAA//tQwAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAACAAAGhgBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVWqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqr///////////////////////////////////////////8AAAAATGF2YzU4LjU0AAAAAAAAAAAAAAAAJAQAAAAAAAAABoY4WbdsAAAAAAD/+1DEAAAUdV2P9BAAJR29sfw0ACXn39+/fv37Bw4cOHDhw4cOHDhw4cOHDhw4cOHDhw4cOHDhw4cOHDhw4cOHDhw4cOHDhw4cOHDhw4cOHDhw4cOHDhw4cOHDhw4cOHDhw4cOHDhw4cOHDhw4cOHDhw4cOHDhw4cOHDhw4cOHDhw4cOHDhw4cOHDhw4cOHDhw4cOHDhw4cOA="
};

export default function AnimatedFrog() {
  const [isBlinking, setIsBlinking] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();

  // Home base position (near the logo)
  const homeBase = { x: 0, y: 0 };

  // Random position within viewport but not too far from home
  const getRandomPosition = (adventureMode: boolean) => {
    if (!containerRef.current) return homeBase;

    if (!adventureMode) {
      // Stay close to home with small movements
      return {
        x: Math.random() * 60 - 30, // -30px to +30px from home
        y: Math.random() * 40 - 20, // -20px to +20px from home
      };
    }

    // Adventure mode - explore further!
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    return {
      x: Math.random() * (viewportWidth - 200), // Keep some margin from edges
      y: Math.random() * (Math.min(viewportHeight, 500)), // Don't go too far down
    };
  };

  // Regular movement pattern
  useEffect(() => {
    // Blinking animation
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 300);
    }, Math.random() * 3000 + 2000);

    // Movement pattern
    const moveInterval = setInterval(async () => {
      // 30% chance to go on an adventure
      const isAdventuring = Math.random() > 0.7;

      if (isAdventuring) {
        // Adventure time! Move to a random spot
        const adventureSpot = getRandomPosition(true);
        await controls.start({
          ...adventureSpot,
          transition: {
            duration: 3, // Slower for long distances
            type: "spring",
            bounce: 0.3,
            damping: 15
          }
        });

        // Maybe do a spin
        if (Math.random() > 0.5) {
          await controls.start({
            rotate: [0, 360],
            transition: { duration: 1, type: "spring" }
          });
        }

        // Wait a bit
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Return home
        await controls.start({
          ...homeBase,
          transition: {
            duration: 2,
            type: "spring",
            bounce: 0.3
          }
        });
      } else {
        // Small movements around home
        const newPos = getRandomPosition(false);
        await controls.start({
          ...newPos,
          transition: {
            duration: 1,
            type: "spring",
            bounce: 0.3
          }
        });
      }
    }, 4000);

    return () => {
      clearInterval(blinkInterval);
      clearInterval(moveInterval);
    };
  }, []);

  // Musical notes animation
  const MusicalNote = ({ delay = 0 }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0, y: 0 }}
      animate={showNotes ? {
        opacity: [0, 1, 0],
        scale: [0.5, 1, 0.5],
        y: -50,
        x: Math.random() * 40 - 20,
      } : { opacity: 0 }}
      transition={{
        duration: 2,
        delay,
        repeat: showNotes ? Infinity : 0,
        repeatDelay: 0.5,
      }}
      className="absolute top-0 left-1/2"
    >
      <span className="text-primary text-2xl">♪</span>
    </motion.div>
  );

  // Handle click
  const handleClick = () => {
    if (!isPlaying) {
      setIsPlaying(true);
      setShowNotes(true);

      try {
        const audio = new Audio(sounds.ribbit);
        audio.play().then(() => {
          setTimeout(() => {
            audio.pause();
            setIsPlaying(false);
            setShowNotes(false);
          }, 1000);
        }).catch(() => {
          setTimeout(() => {
            setIsPlaying(false);
            setShowNotes(false);
          }, 1000);
        });
      } catch (error) {
        setTimeout(() => {
          setIsPlaying(false);
          setShowNotes(false);
        }, 1000);
      }
    }
  };

  return (
    <motion.div
      ref={containerRef}
      animate={controls}
      initial={homeBase}
      className="relative cursor-pointer"
      onClick={handleClick}
      style={{ zIndex: 10 }}
    >
      {showNotes && (
        <>
          <MusicalNote delay={0} />
          <MusicalNote delay={0.2} />
          <MusicalNote delay={0.4} />
        </>
      )}

      <motion.svg
        width="64"
        height="64"
        viewBox="0 0 64 64"
        className="bg-white rounded-full p-1"
        animate={{
          y: [0, -5, 0],
          scale: isPlaying ? [1, 1.1, 1] : 1,
        }}
        transition={{
          y: {
            repeat: Infinity,
            duration: 2,
            ease: "easeInOut"
          },
          scale: {
            duration: isPlaying ? 0.3 : 0.2,
            repeat: isPlaying ? Infinity : 0
          }
        }}
      >
        <circle cx="32" cy="32" r="28" fill="#90be6d" />
        {isBlinking || isPlaying ? (
          <>
            {/* Happy curved eyes */}
            <path
              d="M19 28 Q24 23, 29 28"
              stroke="black"
              strokeWidth="3"
              fill="none"
            />
            <path
              d="M35 28 Q40 23, 45 28"
              stroke="black"
              strokeWidth="3"
              fill="none"
            />
          </>
        ) : (
          <>
            {/* Normal eyes */}
            <ellipse cx="24" cy="28" rx="5" ry="7" fill="black" />
            <ellipse cx="40" cy="28" rx="5" ry="7" fill="black" />
            <circle cx="22" cy="25" r="2" fill="white" opacity="0.7" />
            <circle cx="38" cy="25" r="2" fill="white" opacity="0.7" />
          </>
        )}
      </motion.svg>
    </motion.div>
  );
}