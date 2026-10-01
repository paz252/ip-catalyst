import { useEffect, useRef } from 'react';

import { Box } from '@mui/material';

export function AutoScroll({ children, height = 320, speed = 0.6 }) {
  const containerRef = useRef(null);
  const pausedRef = useRef(false); // ✅ FIX: persistent state

  useEffect(() => {
    const container = containerRef.current;
    let animationFrame;

    const scroll = () => {
      if (!container) return;

      if (!pausedRef.current) {
        container.scrollTop += speed;

        // infinite loop
        if (container.scrollTop >= container.scrollHeight / 2) {
          container.scrollTop = 0;
        }
      }

      animationFrame = requestAnimationFrame(scroll);
    };

    scroll();

    return () => cancelAnimationFrame(animationFrame);
  }, [speed]);

  // proper hover handlers
  const handleMouseEnter = () => {
    pausedRef.current = true;
  };

  const handleMouseLeave = () => {
    pausedRef.current = false;
  };

  return (
    <Box
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      sx={{
        maxHeight: height,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* duplicate for infinite smooth loop */}
      <Box>
        {children}
        {children}
      </Box>
    </Box>
  );
}
