import { google } from 'googleapis';
import { NextApiRequest, NextApiResponse } from 'next';

const calendar = google.calendar({
  version: 'v3',
  auth: process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_API_KEY,
});

export default async function getEvent(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const calendarId = process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_ID;

  if (!calendarId) {
    res.status(500).json({ error: 'Missing calendarId' });
  }

  const body = req.body;
  const { eventId } = body;

  if (!eventId) {
    res.status(500).json({ error: 'Missing eventId' });
  }
  try {
    const event = await calendar.events.get({
      calendarId,
      eventId,
    });
    res.status(200).json(event.data);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e });
  }
}
