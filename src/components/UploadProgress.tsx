import { useEffect, useRef, useState } from 'react';
import {
  motion,
  AnimationPlaybackControls,
  animate,
} from 'framer-motion';

const UploadProgress = ({
  isUploading,
  isDone,
  isError,
  progress,
  setProgressAnimating,
  reset,
}: {
  isUploading: boolean;
  isDone: boolean;
  isError: boolean;
  progress: number | null;
  setProgressAnimating: (value: boolean) => void;
  reset: () => void;
}) => {
  if (isUploading && progress !== null) {
    return (
      <ProgressView
        progress={progress}
        setProgressAnimating={setProgressAnimating}
      />
    );
  } else if (isDone) {
    return (
      <CompletionView
        type={isError ? 'error' : 'success'}
        reset={reset}
      />
    );
  } else {
    return <InitialView />;
  }
};

function ProgressView({
  progress,
  setProgressAnimating,
}: {
  progress: number;
  setProgressAnimating: (value: boolean) => void;
}) {
  const [value, setValue] = useState(0);
  const ref = useRef(null);
  const lastValue = useRef(0);
  // scale progress from 0-100 to 0-1
  const pathLength = progress / 100;

  useEffect(() => {
    let count: AnimationPlaybackControls = animate(
      lastValue.current,
      progress,
      {
        duration: 1,
        onPlay: () => {
          setProgressAnimating(true);
        },
        onUpdate(value) {
          setValue(parseInt(value.toFixed(2)));
          lastValue.current = value;
        },
        onComplete() {
          count.stop();
          if (value === 100) {
            setProgressAnimating(false);
            console.log('done');
          }
        },
      }
    );
    return () => {
      if (count) count.stop();
    };
  }, [progress, setProgressAnimating, value]);
  return (
    <motion.div
      className="relative"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{
        opacity: 0,
        transition: {
          delay: 1,
        },
      }}
    >
      <svg width={300} height={300} viewBox="0 0 85 85" fill="none">
        <motion.path
          initial={{ pathLength: 0, scale: 1 }}
          animate={{ pathLength: pathLength }}
          transition={{
            duration: 1,
            ease: 'easeInOut',
          }}
          exit={{ scale: 0 }}
          fill="none"
          d="M24.0541 84C17.2452 84 11.4679 81.8114 7.34132 77.6821C4.28763 74.6264 2.30686 70.7035 1.44027 66.1199C0.614953 61.495 0.945082 56.292 2.47193 50.6761C5.23675 40.4766 11.7568 29.8642 20.7941 20.8209C29.8313 11.7776 40.4367 5.25323 50.6294 2.48656C54.2196 1.49552 57.6859 1 60.9459 1C67.7548 1 73.4908 3.18855 77.6587 7.31791C80.7124 10.3736 82.6931 14.2965 83.5597 18.8801C84.385 23.505 84.0549 28.708 82.5281 34.3239C79.7632 44.5234 73.2432 55.1358 64.2059 64.1791C55.1687 73.2224 44.5633 79.7468 34.3706 82.5134C30.7392 83.5045 27.2728 84 24.0541 84Z"
          stroke="white"
        />
      </svg>
      <motion.div
        exit={{
          opacity: 0,
          transition: {
            duration: 0.35,
          },
        }}
        ref={ref}
        className="absolute"
      >
        {value}%
      </motion.div>
    </motion.div>
  );
}

function CompletionView({
  type,
  reset,
}: {
  type: 'error' | 'success';
  reset: () => void;
}) {
  useEffect(() => {
    const timeout = setTimeout(() => {
      reset();
    }, 2000);
    return () => clearTimeout(timeout);
  }, [reset]);

  return (
    <motion.div initial={{ opacity: 1 }} animate={{ opacity: 1 }}>
      {type === 'error' && <div>Upload error</div>}
      {type === 'success' && <div>Upload success</div>}
    </motion.div>
  );
}

const loadingVariants = {
  initial: {
    scale: 0,
  },
  animate: {
    scale: [1, 0.1, 1],
    skewX: [0, 10, 0],
    skewY: [0, 40, 0],
    rotate: [0, 180, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
    },
  },
  exit: {
    scale: 0,
    transition: {
      duration: 1,
    },
  },
};

function InitialView() {
  return (
    <motion.div
      variants={loadingVariants}
      initial="initial"
      animate="animate"
    >
      <svg width={300} height={300} viewBox="0 0 85 85" fill="none">
        <motion.path
          fill="none"
          d="M24.0541 84C17.2452 84 11.4679 81.8114 7.34132 77.6821C4.28763 74.6264 2.30686 70.7035 1.44027 66.1199C0.614953 61.495 0.945082 56.292 2.47193 50.6761C5.23675 40.4766 11.7568 29.8642 20.7941 20.8209C29.8313 11.7776 40.4367 5.25323 50.6294 2.48656C54.2196 1.49552 57.6859 1 60.9459 1C67.7548 1 73.4908 3.18855 77.6587 7.31791C80.7124 10.3736 82.6931 14.2965 83.5597 18.8801C84.385 23.505 84.0549 28.708 82.5281 34.3239C79.7632 44.5234 73.2432 55.1358 64.2059 64.1791C55.1687 73.2224 44.5633 79.7468 34.3706 82.5134C30.7392 83.5045 27.2728 84 24.0541 84Z"
          stroke="white"
        />
      </svg>
    </motion.div>
  );
}

export default UploadProgress;
