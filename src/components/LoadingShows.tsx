import { motion } from 'framer-motion';
import Logo from './logo';

type Props = {
  progress?: number;
};

const loadingVariants = {
  initial: {
    scale: 0,
  },
  animate: {
    scale: [1, 1.2, 1],
    skewX: [0, 10, 0],
    skewY: [0, 40, 0],
    rotate: [0, 90, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
    },
  },
  exit: {
    scale: 0,
    transition: {
      duration: 0.5,
    },
  },
};

export default function LoadingShows() {
  return (
    <div className="bg-black text-white gap-4 text-xl md:p-16 p-8 flex flex-col items-center justify-center fixed top-0 left-0 w-full h-full">
      <motion.div
        variants={loadingVariants}
        initial="initial"
        animate="animate"
      >
        <Logo big />
      </motion.div>

      <div className="font-bold w-[300px] text-right">
        <h1>RA</h1>
      </div>
    </div>
  );
}
