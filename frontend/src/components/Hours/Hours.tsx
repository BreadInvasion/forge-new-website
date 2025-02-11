import React from "react";

const Hours = () => {
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <iframe
        src="https://calendar.google.com/calendar/embed?height=600&wkst=1&ctz=America%2FNew_York&showPrint=0&mode=WEEK&src=bW9uaWNhbHUxMTI4QGdtYWlsLmNvbQ&src=YWRkcmVzc2Jvb2sjY29udGFjdHNAZ3JvdXAudi5jYWxlbmRhci5nb29nbGUuY29t&src=MDloMnRqZGZvZm1tcHBiMDhsbTZ1ZG5kbW9AZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ&src=aThxdmFodDE1aHFzdjlpbDFyNjdmNnV2NzhAZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ&src=azJyNm9zamptczZscXQ0MWJpNWE3ajQ4bjBAZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ&color=%23039BE5&color=%2333B679&color=%23D50000&color=%23795548&color=%23F4511E"
        style={{ border: "solid 1px #777" }}
        width="800"
        height="600"
        frameBorder="0"
        scrolling="no"
      />
    </div>
  );
};

export default Hours;

/*
import React, {ReactNode, SyntheticEvent} from 'react';
import ApiCalendar from "react-google-calendar-api";

const config = {
  clientId: "<CLIENT_ID>",
  apiKey: "<API_KEY>",
  scope: "https://www.googleapis.com/auth/calendar",
  discoveryDocs: [
    "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
  ],
};

const apiCalendar = new ApiCalendar(config);
*/