import { useCallback, useEffect, useState } from 'react';
import type { calendar_v3 } from 'googleapis';
import Shows from './Shows';
import RadioShow from './RadioShow';
import clsx from 'clsx';
import { useMutation } from '@tanstack/react-query';

import uploadToDropbox from '@/lib/dropbox';
import { useLayout } from '@/context/layout';
import { updateTags } from '@/lib/utils';
import { getFilePath } from '@/lib/helpers';
import UploadProgress from './UploadProgress';
import { AnimatePresence, motion } from 'framer-motion';

type EventsResponse = {
  result: {
    data: calendar_v3.Schema$Event;
  };
};

type EventProps = EventsResponse['result']['data'];

function Main({ data }: { data: EventProps[] }) {
  const [progress, setProgress] = useState<null | number>(null);
  const [progressAnimating, setProgressAnimating] = useState(false);
  const [selected, setSelected] = useState<EventProps | null>(null);
  const { isListOpen } = useLayout();

  // set app height var
  useEffect(() => {
    const setHeight = () => {
      document.documentElement.style.setProperty(
        '--app-height',
        `${window.innerHeight}px`
      );
    };
    if (window) {
      setHeight();
    }
  }, []);

  const updateSelected = useCallback((event: EventProps) => {
    setSelected(event);
  }, []);

  const {
    mutate: upload,
    isLoading,
    isError,
    isSuccess,
    reset,
  } = useMutation(uploadToDropbox);

  const uploadProgressCb = useCallback(
    (progress: number) => {
      setProgress(progress);
    },
    [setProgress]
  );

  const resetApp = useCallback(() => {
    reset();
    setProgress(null);
    setSelected(null);
  }, [reset, setProgress]);

  const submit = useCallback(
    async (formData: FormData) => {
      const date = formData.get('date') as string;
      const file = formData.get('file') as File;
      const title = formData.get('title') as string;
      const artist = formData.get('artist') as string;

      // create new file with updated tags
      const updatedFile = await updateTags({
        file,
        title,
        artist,
      });
      const path = getFilePath(file.name, date);
      upload({ file: updatedFile, path, cb: uploadProgressCb });
    },
    [upload, uploadProgressCb]
  );

  const isUploading = isLoading || progressAnimating;
  const isDone = (isSuccess || isError) && !isUploading;
  const showLoadingState = isUploading || isDone;

  // show list of shows or selected show
  const placeBelowHeader = isListOpen || selected;
  const showSelected = selected?.id && !isListOpen;

  const animationKey = isUploading
    ? progress !== null
      ? 'progress'
      : 'initiated'
    : 'done';

  return (
    <AnimatePresence mode="wait">
      {showLoadingState ? (
        <motion.div
          className="fixed left-0 top-0 p-12 w-full h-full flex flex-col items-center justify-center bg-black"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
        >
          <AnimatePresence mode="wait">
            <UploadProgress
              key={animationKey}
              isUploading={isUploading}
              isDone={isDone}
              isError={isError}
              progress={progress}
              setProgressAnimating={setProgressAnimating}
              reset={resetApp}
            />
          </AnimatePresence>
        </motion.div>
      ) : (
        <div
          className={clsx(
            'flex justify-center w-full max-w-md',
            isListOpen &&
              'h-[calc(var(--app-height)-var(--header-height)-8rem)] overflow-y-scroll',
            placeBelowHeader
              ? 'relative mx-auto'
              : 'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-6'
          )}
        >
          <div
            className={clsx(
              'border-[1px] border-[#9F9F9F] w-full space-y-6 md:text-lg transition-all duration-500 ease-in-out',
              placeBelowHeader
                ? 'rounded-[2rem] p-8'
                : 'rounded-[2rem] p-6 md:p-8 md:rounded-[2.5rem]'
            )}
          >
            <Shows update={updateSelected} events={data} />
            {showSelected && (
              <RadioShow id={selected.id!} submit={submit} />
            )}
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default Main;
