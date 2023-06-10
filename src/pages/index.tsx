import { Inter } from 'next/font/google';
import LoadingShows from '@/components/LoadingShows';
import Header from '@/components/Header';
import Main from '@/components/Main';
import { calendar_v3, google } from 'googleapis';
import { DateTime } from 'luxon';
import Head from 'next/head';

type CalendarEvent = calendar_v3.Schema$Event;
type CalendarEvents = { items?: CalendarEvent[] };

const inter = Inter({ subsets: ['latin'] });

export default function Home({ events }: { events: CalendarEvents }) {
  if (!events) {
    return <LoadingShows />;
  }

  if (!events.items) {
    return <div>no events</div>;
  }

  return (
    <div className={inter.className}>
      <Head>
        <title>RA</title>
      </Head>
      <div className="h-screen items-center gap-14 md:p-16 p-8">
        <Header />
        <Main data={events.items} />
      </div>
    </div>
  );
}

export const getStaticProps = async () => {
  const calendarId = process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_ID;

  if (!calendarId) {
    return {
      props: {
        events: null,
      },
    };
  }
  const now = DateTime.utc();
  const timeMin = now.toISO();
  const timeMax = now.plus({ months: 1 }).toISO();

  if (!timeMin || !timeMax) {
    throw new Error('Missing required fields');
  }

  const calendar = google.calendar({
    version: 'v3',
    auth: process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_API_KEY,
  });

  const response = await calendar.events.list({
    calendarId,
    timeMin,
    timeMax,
    singleEvents: true,
    orderBy: 'startTime',
    maxResults: 300,
    fields: 'items(id,start,summary)',
  });

  const events = response.data;

  return {
    props: {
      events,
    },
    revalidate: 60 * 60 * 24,
  };
};
