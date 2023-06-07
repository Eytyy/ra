import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

type Props = {
  updateFile: (file: File) => void;
};

export default function FileUpload({ updateFile }: Props) {
  const [dragActive, setDragActive] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function onClickUpload() {
    if (!fileInputRef.current) return void 0;
    fileInputRef.current.click();
  }

  function handleDrag(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave' || e.type === 'drop') {
      setDragActive(false);
    }
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    if (
      e.dataTransfer.files.length > 0 &&
      e.dataTransfer.files[0].type.includes('audio')
    ) {
      updateFile(e.dataTransfer.files[0]);
      setDragActive(false);
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (
      e.target.files &&
      e.target.files.length > 0 &&
      e.target.files[0].type.includes('audio')
    ) {
      updateFile(e.target.files[0]);
    }
  }

  return (
    <motion.div
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
        accept="audio/*"
        onChange={handleChange}
        className="hidden"
      />
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        type="button"
        className="border-[1px] px-6 py-2 rounded-[2.5rem]"
        onClick={onClickUpload}
      >
        ADD
      </motion.button>
      <p className="text-sm">or drag and drop your audio file here</p>
    </motion.div>
  );
}
