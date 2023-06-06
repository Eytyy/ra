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
  // TODO: order by date and name to make sure later events are the ones that are removed
  // Order calendr events by name and remove duplicates
  const eventsByName = useMemo(() => {
    // sort by name
    const sorted = events
      .filter((event) => {
        if (!event.summary) return false;
        return event.summary.trim() !== '';
      })
      .sort((a, b) =>
        a.summary!.localeCompare(b.summary!, undefined, {
          sensitivity: 'base',
        })
      );
    // return only unique events
    return sorted.filter(
      (event, index, self) =>
        index ===
        self.findIndex(
          (e) => e.summary!.trim() === event.summary!.trim()
        )
    );
  }, [events]);

  // Filter calendar events based on search value
  const results = useMemo(() => {
    if (value == '') return eventsByName;
    return eventsByName.filter((event) =>
      event.summary!.toLowerCase().includes(value.toLowerCase())
    );
  }, [eventsByName, value]);

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
          className="form-element text-xl flex justify-between items-center"
        >
          {selected ? (
            <span className="uppercase w-full">{`${selected.summary}`}</span>
          ) : (
            <span className="text-gray-400">SELECT RADIO SHOW</span>
          )}
          <Arrow />
        </motion.button>
        {visible && (
          <input
            className="w-full h-10 p-[1rem] bg-[#111010] rounded-full text-center uppercase"
            value={value}
            onChange={handleChange}
            placeholder="SEARCH"
          />
        )}
      </div>

      {visible && (
        <div className="space-y-4">
          {results.map((event) => (
            <div
              key={event.id}
              className="hover:bg-[#111010] cursor-pointer bg-[#202020] p-4 rounded-full text-center"
              onClick={() => updateSelected(event)}
            >
              {event.summary}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
