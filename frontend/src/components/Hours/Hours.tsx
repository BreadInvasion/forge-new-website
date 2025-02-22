import React from "react";

const Hours = () => {
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <iframe
        src="https://calendar.google.com/calendar/b/1/embed?height=800&wkst=1&bgcolor=%23ffffff&ctz=America%2FNew_York&src=MDloMnRqZGZvZm1tcHBiMDhsbTZ1ZG5kbW9AZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ&src=aThxdmFodDE1aHFzdjlpbDFyNjdmNnV2NzhAZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ&src=azJyNm9zamptczZscXQ0MWJpNWE3ajQ4bjBAZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ&color=%231F753C&color=%2330487E&color=%238A2D38&mode=WEEK&showNav=0&showTitle=0&showDate=0&showPrint=0&showTabs=0&showCalendars=0"
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