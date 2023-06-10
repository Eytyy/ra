import RadioShowForm from './RadioShowForm';
import type { calendar_v3 } from 'googleapis';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { formatDate } from '../lib/helpers';
import ShowLoadingSkeleton from './ShowLoadingSkeleton';
import AddToCalendar from './AddToCalendar';

type Props = {
  id: string;
  submit: (formData: FormData) => void;
};

const fetchEvent = async (eventId: string) => {
  const response = await fetch('/api/get-event', {
    method: 'POST',
    body: JSON.stringify({ eventId }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const result: calendar_v3.Schema$Event = await response.json();
  return result;
};

export default function RadioShow({ id, submit }: Props) {
  const { isLoading, data: event } = useQuery(['getEvent', id], () =>
    fetchEvent(id)
  );

  const eventDate = useMemo(() => {
    if (!event || !event.start?.dateTime) return null;
    return formatDate(event.start.dateTime);
  }, [event]);

  if (!event || isLoading || !eventDate) {
    return <ShowLoadingSkeleton />;
  }

  const date = event?.start?.dateTime;
  const artist = event?.summary;

  return (
    <div className="space-y-8 md:space-y-10 grid grid-rows-[min-content_1fr] text-base">
      <div className="space-y-2 font-light">
        <p>Your show is on:</p>
        <div className="font-semibold">
          <div>{eventDate.date} </div>
          <div>
            <span>{eventDate.time} </span>
            <span className="font-light">Bethlehem Time</span>
          </div>
        </div>
        <AddToCalendar {...event} />
      </div>
      {artist && date && (
        <RadioShowForm date={date} artist={artist} submit={submit} />
      )}
    </div>
  );
}
