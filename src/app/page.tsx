'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

// Icon components using simple SVG shapes
const StarIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

const HeartIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

const CircleIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <circle cx="12" cy="12" r="8" />
  </svg>
);

const TriangleIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2l10 18H2L12 2z" />
  </svg>
);

const DiamondIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2l4 8-4 12-4-12 4-8z" />
  </svg>
);

const FloatingIcon = ({ icon: Icon, finalPosition, color, scrollYProgress, startPosition }: {
  icon: React.ComponentType;
  finalPosition: { x: number; y: number };
  color: string;
  scrollYProgress: any;
  startPosition: { x: number; y: number };
}) => {
  // Transform scroll progress to icon position
  const x = useTransform(scrollYProgress, [0, 1], [startPosition.x, finalPosition.x]);
  const y = useTransform(scrollYProgress, [0, 1], [startPosition.y, finalPosition.y]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 0.5, 1, 1]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.3, 0.7, 1]);
  const rotate = useTransform(scrollYProgress, [0, 1], [360, 0]);

  return (
    <motion.div
      className="absolute"
      style={{ 
        x,
        y,
        opacity,
        scale,
        rotate,
        color 
      }}
    >
      <Icon />
    </motion.div>
  );
};

const ProgressiveColumns = () => {
  const columnsRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: columnsRef,
    offset: ["start end", "end start"] // Extended range for two-phase animation
  });

  // Phase 1: Left-to-right fill (0 to 0.5 scroll progress)
  const leftFillWidth = useTransform(
    scrollYProgress,
    [0, 0.5], // First half of scroll
    ["0%", "100%"]
  );

  // Phase 2: Right-to-left fill (0.5 to 1 scroll progress)
  const rightFillWidth = useTransform(
    scrollYProgress,
    [0.5, 1], // Second half of scroll
    ["0%", "100%"]
  );

  // Phase 1: Text appears (0 to 0.5 scroll progress)
  const textRevealWidth = useTransform(
    scrollYProgress,
    [0, 0.5],
    ["0%", "100%"]
  );

  // Phase 2: Text disappears (0.5 to 1 scroll progress)
  const textDisappearWidth = useTransform(
    scrollYProgress,
    [0.5, 1],
    ["100%", "0%"]
  );

  return (
    <div 
      ref={columnsRef}
      className="w-full h-screen flex relative"
      style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}
    >
      {Array.from({ length: 8 }).map((_, index) => (
        <div
          key={index}
          className="relative flex-1 overflow-hidden"
          style={{ width: '12.5%' }}
        >
          {/* Background column */}
          <div className="absolute inset-0 bg-white/10" />
          
          {/* Phase 1: Left-to-right fill */}
          <motion.div
            className="absolute top-0 left-0 bottom-0 bg-purple-600"
            style={{
              width: leftFillWidth,
            }}
            initial={{ width: "0%" }}
          />
          
          {/* Phase 2: Right-to-left fill */}
          <motion.div
            className="absolute top-0 right-0 bottom-0 bg-indigo-600"
            style={{
              width: rightFillWidth,
            }}
            initial={{ width: "0%" }}
          />
          
          {/* Optional column separator */}
          {index < 7 && (
            <div className="absolute top-0 right-0 w-px h-full bg-white/20" />
          )}
        </div>
      ))}
      
      {/* Centered WEBSITE text with dual-phase effect */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="relative overflow-hidden">
          <div className="text-white text-8xl font-bold tracking-wider opacity-20">
            WEBSITE
          </div>
          {/* Phase 1: Text reveal */}
          <motion.div
            className="absolute top-0 left-0 overflow-hidden"
            style={{
              width: textRevealWidth,
            }}
          >
            <div className="text-white text-8xl font-bold tracking-wider whitespace-nowrap">
              WEBSITE
            </div>
          </motion.div>
          {/* Phase 2: Text disappear overlay */}
          <motion.div
            className="absolute top-0 left-0 overflow-hidden"
            style={{
              width: textDisappearWidth,
            }}
          >
            <div className="text-white text-8xl font-bold tracking-wider whitespace-nowrap">
              WEBSITE
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default function Home() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Generate random starting positions for each icon
  const generateStartPosition = (index: number) => {
    const seed = index * 123; // Use index as seed for consistent randomness
    const randomX = ((seed * 9301 + 49297) % 233280) / 233280 * 400 - 200;
    const randomY = ((seed * 9301 + 49297 + 1000) % 233280) / 233280 * 400 - 200;
    return { x: randomX, y: randomY };
  };

  const icons = [
    { icon: StarIcon, position: { x: -80, y: -60 }, color: '#FFD700', startPosition: generateStartPosition(0) },
    { icon: HeartIcon, position: { x: 80, y: -40 }, color: '#FF6B6B', startPosition: generateStartPosition(1) },
    { icon: CircleIcon, position: { x: -60, y: 40 }, color: '#4ECDC4', startPosition: generateStartPosition(2) },
    { icon: TriangleIcon, position: { x: 60, y: 60 }, color: '#45B7D1', startPosition: generateStartPosition(3) },
    { icon: DiamondIcon, position: { x: 0, y: -80 }, color: '#96CEB4', startPosition: generateStartPosition(4) },
    { icon: StarIcon, position: { x: -100, y: 0 }, color: '#FFEAA7', startPosition: generateStartPosition(5) },
    { icon: HeartIcon, position: { x: 100, y: 20 }, color: '#FD79A8', startPosition: generateStartPosition(6) },
    { icon: CircleIcon, position: { x: 0, y: 80 }, color: '#6C5CE7', startPosition: generateStartPosition(7) },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Spacer to allow scrolling */}
      <div className="h-screen flex items-center justify-center">
        <motion.h1 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-6xl font-bold text-white text-center"
        >
          Scroll down to see the magic ✨
        </motion.h1>
      </div>

      {/* Floating Icons Block */}
      <div className="h-screen flex items-center justify-center relative" ref={containerRef}>
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: false }}
          className="relative w-80 h-80 bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 shadow-2xl flex items-center justify-center"
        >
          <motion.div
            className="text-white text-2xl font-semibold text-center z-10"
            style={{
              opacity: useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 0, 1, 1])
            }}
          >
            Floating Icons
            <br />
            <span className="text-lg opacity-80">Animation Demo</span>
          </motion.div>
          
          {/* Render floating icons */}
          {icons.map((iconData, index) => (
            <FloatingIcon
              key={index}
              icon={iconData.icon}
              finalPosition={iconData.position}
              color={iconData.color}
              scrollYProgress={scrollYProgress}
              startPosition={iconData.startPosition}
            />
          ))}
        </motion.div>
      </div>

      {/* Progressive Columns Block */}
      <ProgressiveColumns />

      {/* Additional content for more scrolling */}
      <div className="h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: false }}
          className="text-white text-center"
        >
          <h2 className="text-3xl font-bold mb-4">Pretty cool, right? 🎉</h2>
          <p className="text-lg opacity-80">Watch the columns fill progressively as you scroll!</p>
        </motion.div>
      </div>
    </main>
  );
}
