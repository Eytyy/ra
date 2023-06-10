import React, { useCallback, useRef, useState } from 'react';

type Props = {
  onFileDrop: (file: File) => void;
};

export default function useFileDnD({ onFileDrop }: Props) {
  const [dragActive, setDragActive] = useState<boolean>(false);
  const input = useRef<HTMLInputElement>(null);

  const onClick = useCallback(() => {
    if (!input.current) return void 0;
    input.current.click();
  }, []);

  const handleDrag = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();

      if (e.type === 'dragenter' || e.type === 'dragover') {
        setDragActive(true);
      } else if (e.type === 'dragleave' || e.type === 'drop') {
        setDragActive(false);
      }
    },
    []
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (
        e.dataTransfer.files.length > 0 &&
        e.dataTransfer.files[0].type.includes('audio')
      ) {
        onFileDrop(e.dataTransfer.files[0]);
        setDragActive(false);
      }
    },
    [onFileDrop]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (
        e.target.files &&
        e.target.files.length > 0 &&
        e.target.files[0].type.includes('audio')
      ) {
        onFileDrop(e.target.files[0]);
      }
    },
    [onFileDrop]
  );

  return {
    dragActive,
    ref: input,
    onClick,
    handleDrag,
    handleDrop,
    handleChange,
  };
}
