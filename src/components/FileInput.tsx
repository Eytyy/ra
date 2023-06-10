import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import useFileDnD from '@/hooks/useFileDnd';

type Props = {
  updateFile: (file: File) => void;
};

export default function FileInput({ updateFile }: Props) {
  const {
    dragActive,
    ref: fileInputRef,
    handleChange,
    handleDrag,
    handleDrop,
    onClick,
  } = useFileDnD({
    onFileDrop: updateFile,
  });

  return (
    <div
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
      className={clsx(
        'flex items-center gap-4 flex-col border-[1px] p-10 rounded-3xl border-dashed',
        dragActive ? 'border-white' : 'border-[#575757]'
      )}
    >
      <input
        name="file"
        ref={fileInputRef}
        type="file"
        accept="audio/mpeg"
        onChange={handleChange}
        className="hidden"
      />
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        type="button"
        className="border-[1px] px-6 py-2 rounded-[2.5rem]"
        onClick={onClick}
      >
        ADD
      </motion.button>
      <p className="text-sm">or drag and drop your audio file here</p>
    </div>
  );
}
