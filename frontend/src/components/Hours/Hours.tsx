import React from "react";

const Hours = () => {
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <iframe
        src="https://calendar.google.com/calendar/embed?height=600&wkst=1&ctz=America%2FNew_York&showPrint=0&mode=WEEK&src=bW9uaWNhbHUxMTI4QGdtYWlsLmNvbQ"
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
