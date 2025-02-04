import React, { useEffect, useState } from 'react';
import { gapi } from 'gapi-script';

//create .env out of this information
const CLIENT_ID = process.env.REACT_APP_CLIENT_ID!;
const API_KEY = process.env.REACT_APP_API_KEY!;
const CALENDAR_ID = process.env.REACT_APP_CALENDAR_ID!;
const SCOPES = process.env.REACT_APP_SCOPES!;

const GoogleCalendar: React.FC = () => {
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    const initClient = () => {
      gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"],
        scope: SCOPES,
      }).then(() => {
        gapi.client.calendar.events.list({
          calendarId: CALENDAR_ID,
          timeMin: (new Date()).toISOString(),
          showDeleted: false,
          singleEvents: true,
          maxResults: 10,
          orderBy: 'startTime',
        }).then((response: any) => {
          const events = response.result.items;
          setEvents(events);
        });
      });
    };

    gapi.load('client:auth2', initClient);
  }, []);

  return (
    <div>
      <h2>Volunteer Schedule</h2>
      <ul>
        {events.map((event, index) => (
          <li key={index}>
            <strong>{event.summary}</strong><br />
            {event.start.dateTime || event.start.date} - {event.end.dateTime || event.end.date}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GoogleCalendar;
