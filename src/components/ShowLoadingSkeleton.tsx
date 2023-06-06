import { motion, Variants } from 'framer-motion';

const variants: Variants = {
  initial: {
    background: 'linear-gradient(45deg, #111111, #222222,  #333333)',
    backgroundSize: '300%',
    backgroundPosition: '0% 0%',
  },
  animate: {
    background:
      'linear-gradient(to right, #111111, #222222,  #333333)',
    backgroundPosition: ['0% 0%', '100% 100%'],
    backgroundSize: '300%',
    transition: {
      repeat: Infinity,
      duration: 3,
      ease: 'easeInOut',
      repeatType: 'reverse',
    },
  },
};

export default function LoadingSkeleton() {
  return (
    <motion.div className="space-y-10">
      <div className="space-y-2">
        <motion.div
          className="h-6 w-1/3"
          variants={variants}
          initial="initial"
          animate="animate"
        />
        <motion.div
          className="h-6 w-full"
          variants={variants}
          initial="initial"
          animate="animate"
        />
        <motion.div
          className="bg-[rgba(255,255,255,0.3)] h-6 w-2/4"
          variants={variants}
          initial="initial"
          animate="animate"
        />
      </div>
      <div className="space-y-10">
        <motion.div
          className="h-12 form-element"
          variants={variants}
          initial="initial"
          animate="animate"
        />
        <div className="flex h-[164px] items-center gap-4 flex-col border-2 p-10 rounded-3xl border-dashed border-[rgba(255,255,255,0.2)]" />
        <div className="border-[1px] border-[rgba(255,255,255,0.2)] h-16 w-full rounded-[2.5rem]" />
      </div>
    </motion.div>
  );
}
