import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { format, toZonedTime } from "date-fns-tz";

function App() {
  const [eventData, setEventData] = useState({
    summary: "",
    location: "Zoom",
    zoomLink: "",
    timeZone: "PST", // Default to PST
    startTime: "",
    endTime: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData({ ...eventData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Map the selected time zone to its corresponding TZID
    const timeZoneMap = {
      CST: "America/Chicago",
      PST: "America/Los_Angeles",
      EST: "America/New_York",
    };
    const tzid = timeZoneMap[eventData.timeZone];

    // Convert local times to UTC for DTSTART and DTEND
    const startZoned = toZonedTime(new Date(eventData.startTime), tzid);
    const endZoned = toZonedTime(new Date(eventData.endTime), tzid);

    const startDt = format(startZoned, "yyyyMMdd'T'HHmmss", { timeZone: tzid });
    const endDt = format(endZoned, "yyyyMMdd'T'HHmmss", { timeZone: tzid });

    // Generate unique UID and current timestamp
    const uid = uuidv4();
    const dtstamp = format(new Date(), "yyyyMMdd'T'HHmmss'Z'", { timeZone: "UTC" });

    // Generate .ics content
    const icsContent = `BEGIN:VCALENDAR
CALSCALE:GREGORIAN
VERSION:2.0
X-WR-CALNAME:${eventData.summary}\\n
METHOD:PUBLISH
PRODID:-//Custom iCalendar Generator//EN
BEGIN:VTIMEZONE
TZID:${tzid}
BEGIN:DAYLIGHT
TZOFFSETFROM:-0800
DTSTART:20070311T020000
RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU
TZNAME:${eventData.timeZone}
TZOFFSETTO:-0700
END:DAYLIGHT
BEGIN:STANDARD
TZOFFSETFROM:-0700
DTSTART:20071104T020000
RRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU
TZNAME:${eventData.timeZone}
TZOFFSETTO:-0800
END:STANDARD
END:VTIMEZONE
BEGIN:VEVENT
TRANSP:OPAQUE
DTEND;TZID=${tzid}:${endDt}
UID:${uid}
DTSTAMP:${dtstamp}
URL;VALUE=URI:${eventData.zoomLink}
SEQUENCE:0
SUMMARY:${eventData.summary}\\n
DTSTART;TZID=${tzid}:${startDt}
LOCATION:${eventData.location}
END:VEVENT
END:VCALENDAR`;

    // Download the .ics file
    const blob = new Blob([icsContent], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${eventData.summary.replace(/\s+/g, "_")}.ics`;
    link.click();
  };

  return (
    <div className="App" style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Create an iCalendar (.ics) File</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "10px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>Event Title:</label>
          <input
            type="text"
            name="summary"
            value={eventData.summary}
            onChange={handleChange}
            required
            style={{ width: "30%", padding: "8px", boxSizing: "border-box" }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>Location:</label>
          <input
            type="text"
            name="location"
            value={eventData.location}
            onChange={handleChange}
            required
            style={{ width: "30%", padding: "8px", boxSizing: "border-box" }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>Zoom Link:</label>
          <input
            type="url"
            name="zoomLink"
            value={eventData.zoomLink}
            onChange={handleChange}
            required
            style={{ width: "30%", padding: "8px", boxSizing: "border-box" }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>Time Zone:</label>
          <select
            name="timeZone"
            value={eventData.timeZone}
            onChange={handleChange}
            style={{ width: "30%", padding: "8px", boxSizing: "border-box" }}
          >
            <option value="PST">PST (Pacific Standard Time)</option>
            <option value="CST">CST (Central Standard Time)</option>
            <option value="EST">EST (Eastern Standard Time)</option>
          </select>
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>Start Time:</label>
          <input
            type="datetime-local"
            name="startTime"
            value={eventData.startTime}
            onChange={handleChange}
            required
            style={{ width: "30%", padding: "8px", boxSizing: "border-box" }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>End Time:</label>
          <input
            type="datetime-local"
            name="endTime"
            value={eventData.endTime}
            onChange={handleChange}
            required
            style={{ width: "30%", padding: "8px", boxSizing: "border-box" }}
          />
        </div>
        <button
          type="submit"
          style={{
            padding: "10px 20px",
            background: "#FF69B4",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Generate .ics File
        </button>
      </form>
    </div>
  );
}

export default App;
