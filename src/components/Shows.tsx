import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import type { calendar_v3 } from 'googleapis';

import Arrow from './arrow';
import { useLayout } from '@/context/layout';

type CalendarEvent = calendar_v3.Schema$Event;

type Props = {
  update: (event: CalendarEvent) => void;
  events: CalendarEvent[];
};

export default function Shows({ update, events }: Props) {
  const [value, setValue] = useState<string>('');
  const [selected, setSelected] = useState<CalendarEvent | null>(
    null
  );
  const [visible, setVisible] = useState<boolean>(false);
  const { toggleList } = useLayout();

  const toggle = () => {
    setVisible(!visible);
    toggleList(!visible);
  };

  // Order calendar events by date and remove duplicates
  const filteredEvents = useMemo(() => {
    return (
      events
        // remove events without a summary or start date
        .filter((event) => {
          if (!event.summary || !event.start?.dateTime) return false;
          return event.summary.trim() !== '';
        })
        // sort by date (descending)
        .sort((a, b) => {
          const dateA = a.start?.dateTime as string;
          const dateB = b.start?.dateTime as string;
          if (dateA < dateB) return -1;
          if (dateA > dateB) return 1;
          return 0;
        })
        // remove duplicate events
        .filter(
          (event, index, self) =>
            index ===
            self.findIndex(
              (e) => e.summary!.trim() === event.summary!.trim()
            )
        )
    );
  }, [events]);

  // Filter calendar events based on search value
  const results = useMemo(() => {
    if (value == '') return filteredEvents;
    return filteredEvents.filter((event) =>
      event.summary!.toLowerCase().includes(value.toLowerCase())
    );
  }, [filteredEvents, value]);

  // Group events by date
  const resultsByDate = useMemo(() => {
    return results.reduce((acc, event) => {
      const date = event.start?.dateTime?.split('T')[0];
      if (!date) return acc;

      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(event);
      return acc;
    }, {} as Record<string, CalendarEvent[]>);
  }, [results]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setValue(e.target.value);
  }

  function updateSelected(event: CalendarEvent) {
    if (!event.id) return;

    update(event);
    setSelected(event);
    toggle();
    setValue('');
  }

  const formatGroupDate = (date: string) => {
    const formattedDate = new Date(date).toLocaleDateString(
      'default',
      {
        weekday: 'long',
        month: 'long',
        day: '2-digit',
      }
    );
    return formattedDate;
  };

  // crop selected text to fit in button
  const selectedText =
    selected?.summary && selected.summary.length > 20
      ? `${selected.summary.slice(0, 20)}...`
      : selected?.summary;

  return (
    <div
      className={clsx(
        'w-full relative no-scrollbar',
        visible && 'overflow-scroll h-full'
      )}
    >
      <div
        className={clsx(
          'sticky top-0 space-y-4 bg-black',
          visible && 'pb-4'
        )}
      >
        <motion.button
          onClick={toggle}
          className="form-element flex justify-between gap-2 items-center"
        >
          {selected ? (
            <span className="uppercase w-full">{`${selectedText}`}</span>
          ) : (
            <span className="text-gray-400">SELECT RADIO SHOW</span>
          )}
          <Arrow />
        </motion.button>
        {visible && (
          <input
            className="w-full rounded-full uppercase form-element outline-none"
            value={value}
            onChange={handleChange}
            placeholder="SEARCH"
          />
        )}
      </div>

      {visible && (
        <div className="space-y-8 mt-4">
          {Object.entries(resultsByDate).map(([date, events]) => (
            <div key={date} className="space-y-2">
              <h3 className="text-gray-400">
                {formatGroupDate(date)}
              </h3>
              <div className="space-y-4">
                {events.map((event) => (
                  <button
                    key={event.id}
                    className="hover:bg-[#111010] cursor-pointer bg-[#202020] p-4 rounded-full text-center w-full"
                    onClick={() => updateSelected(event)}
                  >
                    {event.summary}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
