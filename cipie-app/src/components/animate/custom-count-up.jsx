// import { useEffect, useState } from 'react';

// export function useCountUp({ end, duration = 1500, start = 0, startOn = false }) {
//   const [count, setCount] = useState(start);

//   useEffect(() => {
//     if (!startOn) return;

//     let startTime = null;
//     let animationFrame;

//     const step = (timestamp) => {
//       if (!startTime) startTime = timestamp;
//       const progress = timestamp - startTime;

//       const percent = Math.min(progress / duration, 1);
//       const value = Math.floor(percent * (end - start) + start);

//       setCount(value);

//       if (percent < 1) {
//         animationFrame = requestAnimationFrame(step);
//       }
//     };

//     animationFrame = requestAnimationFrame(step);

//     return () => cancelAnimationFrame(animationFrame);
//   }, [startOn, end, duration, start]);

//   return count;
// }
