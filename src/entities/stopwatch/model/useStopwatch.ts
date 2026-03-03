// import { useState, useEffect, useRef } from 'react';
// import { StopwatchStatus } from './types';

// export const useStopwatch = () => {
//   const [status, setStatus] = useState<StopwatchStatus>(StopwatchStatus.IDLE);
//   const [time, setTime] = useState<number>(0);

//   const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

//   useEffect(() => {
//     if (status === StopwatchStatus.RUNNING) {
//       intervalRef.current = setInterval(() => {
//         setTime((prevTime) => prevTime + 10);
//       }, 10);
//     } else {
//       if (intervalRef.current) clearInterval(intervalRef.current);
//     }

//     return () => {
//       if (intervalRef.current) clearInterval(intervalRef.current);
//     };
//   }, [status]);

//   const start = () => {
//     if (status === StopwatchStatus.IDLE) {
//       setTime(0);
//     }
//     setStatus(StopwatchStatus.RUNNING);
//   };

//   const pause = () => {
//     setStatus(StopwatchStatus.PAUSED);
//   };

//   const resume = () => {
//     setStatus(StopwatchStatus.RUNNING);
//   };

//   const clear = () => {
//     setStatus(StopwatchStatus.IDLE);
//     setTime(0);
//   };

//   return {
//     status,
//     time,
//     actions: { start, pause, resume, clear },
//   };
// };





// import { useState, useEffect, useRef } from "react";
// import { StopwatchStatus } from "./types";

// export const useStopwatch = () => {
//   const [status, setStatus] = useState<StopwatchStatus>(StopwatchStatus.IDLE);
//   const [time, setTime] = useState<number>(0);

//   const startTimeRef = useRef<number>(0);
//   const accumulatedTimeRef = useRef<number>(0);
//   const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

//   useEffect(() => {
//     if (status === StopwatchStatus.RUNNING) {
//       startTimeRef.current = Date.now();
//       intervalRef.current = setInterval(() => {
//         const now = Date.now();
//         const delta = now - startTimeRef.current;
//         setTime(accumulatedTimeRef.current + delta);
//       }, 10); 
//     } else {
//       if (intervalRef.current) clearInterval(intervalRef.current);
//     }

//     return () => {
//       if (intervalRef.current) clearInterval(intervalRef.current);
//     };
//   }, [status]);

//   const start = () => {
//     // if (status === StopwatchStatus.IDLE) {
//     //   setTime(0);
//     //   accumulatedTimeRef.current = 0;
//     // }
//     setStatus(StopwatchStatus.RUNNING);
//   };

//   const pause = () => {
//     if (status === StopwatchStatus.RUNNING) {
//       accumulatedTimeRef.current += Date.now() - startTimeRef.current;
//       setStatus(StopwatchStatus.PAUSED);
//     }
//   };

//   const resume = () => {
//     setStatus(StopwatchStatus.RUNNING);
//   };

//   const clear = () => {
//     setStatus(StopwatchStatus.IDLE);
//     setTime(0);
//     accumulatedTimeRef.current = 0;
//   };

//   return {
//     status,
//     time,
//     actions: { start, pause, resume, clear },
//   };
// };



import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { StopwatchStatus } from "./types";

export const useStopwatch = () => {
  const timeRef = useRef<number>(0);
  const [status, setStatus] = useState<StopwatchStatus>(StopwatchStatus.IDLE);

  const accumulatedTimeRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (status === StopwatchStatus.RUNNING) {
      startTimeRef.current = Date.now();

      intervalRef.current = setInterval(() => {
        const now = Date.now();
        const delta = now - startTimeRef.current;
        timeRef.current = accumulatedTimeRef.current + delta;
      }, 10);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [status]);

  const start = useCallback(() => {
    if (status === StopwatchStatus.IDLE) {
      timeRef.current = 0;
      accumulatedTimeRef.current = 0;
    }
    if (status !== StopwatchStatus.RUNNING) {
      setStatus(StopwatchStatus.RUNNING);
    }
  }, [status]);

  const pause = useCallback(() => {
    if (status === StopwatchStatus.RUNNING) {
      accumulatedTimeRef.current += Date.now() - startTimeRef.current;
      setStatus(StopwatchStatus.PAUSED);
    }
  }, [status]);

  const resume = useCallback(() => {
    if (status === StopwatchStatus.PAUSED) {
      setStatus(StopwatchStatus.RUNNING);
    }
  }, [status]);

  const clear = useCallback(() => {
    setStatus(StopwatchStatus.IDLE);
    timeRef.current = 0;
    accumulatedTimeRef.current = 0;
  }, []);

  const actions = useMemo(
    () => ({ start, pause, resume, clear }),
    [start, pause, resume, clear]
  );

  return {
    timeRef,
    status,
    actions,
  };
};