import { useCallback, useEffect, useRef, useState } from 'react';
import type { calendar_v3 } from 'googleapis';
import Shows from './Shows';
import RadioShow from './RadioShow';
import LoadingShows from './LoadingShows';
import clsx from 'clsx';
import { useMutation } from '@tanstack/react-query';

import uploadToDropbox from '@/lib/dropbox';
import { useLayout } from '@/context/layout';
import { updateTags } from '@/lib/utils';
import { getDateStamp, getFilePath } from '@/lib/helpers';
import UploadMessage from './UploadMessage';

type EventsResponse = {
  result: {
    data: calendar_v3.Schema$Event;
  };
};

type EventProps = EventsResponse['result']['data'];

function Main({ data }: { data: EventProps[] }) {
  const [selected, setSelected] = useState<EventProps | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const to = useRef<NodeJS.Timeout | null>(null);

  const { isListOpen } = useLayout();

  const {
    mutate: upload,
    isLoading: isUploading,
    isError: isUploadError,
    isSuccess: isUploadSuccess,
  } = useMutation(uploadToDropbox);

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
      upload({ file: updatedFile, path });
    },
    [upload]
  );

  const updateSelected = useCallback((event: EventProps) => {
    setSelected(event);
  }, []);

  // handle upload errors and success
  useEffect(() => {
    if (isUploadError) {
      setSelected(null);
      setMessage('upload error');
      to.current = setTimeout(() => {
        setMessage(null);
      }, 3000);
    }
    return () => {
      if (to.current) {
        clearTimeout(to.current);
      }
      setMessage(null);
    };
  }, [isUploadError]);

  useEffect(() => {
    if (isUploadSuccess) {
      setSelected(null);
      setMessage('upload success');
      to.current = setTimeout(() => {
        setMessage(null);
      }, 3000);
    }
    return () => {
      if (to.current) {
        clearTimeout(to.current);
      }
      setMessage(null);
    };
  }, [isUploadSuccess]);

  // show loading indicator while uploading
  if (isUploading) {
    return <LoadingShows />;
  }

  // show list of shows or selected show
  const placeBelowHeader = isListOpen || selected;
  const showSelected = selected?.id && !isListOpen;

  return (
    <>
      <div
        className={clsx(
          'flex justify-center w-full max-w-lg px-8 relative',
          'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
          placeBelowHeader &&
            'top-[calc(var(--header-height)+4rem)] translate-y-0 max-h-[calc(100vh-var(--header-height)-10rem)]'
        )}
      >
        <div className="border-[1px] border-[#9F9F9F] rounded-[2.5rem] p-8 w-full space-y-6">
          <Shows update={updateSelected} events={data} />
          {showSelected && (
            <RadioShow id={selected.id!} submit={submit} />
          )}
        </div>
        {message && <UploadMessage message={message} />}
      </div>
    </>
  );
}

export default Main;
