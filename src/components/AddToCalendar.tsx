'use client';

import React from 'react';
import { google } from 'calendar-link';
import type { calendar_v3 } from 'googleapis';
import Link from 'next/link';

import { FaRegCalendarPlus } from 'react-icons/fa';

export default function AddToCalendar(
  calendarEvent: calendar_v3.Schema$Event
) {
  const event = {
    title: calendarEvent.summary || 'Radio Show',
    description: calendarEvent.description || '',
    start: calendarEvent.start?.dateTime,
    end: calendarEvent.end?.dateTime,
  };

  return (
    <Link
      target="_blank"
      href={google(event)}
      className="flex gap-2 items-center text-sm"
    >
      <FaRegCalendarPlus />
      <span className="border-b-[1px]">Add to your calendar</span>
    </Link>
  );
}
