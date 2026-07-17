import React, { useState, useEffect } from "react";
import "./App.css";

const ROOM_COLORS = [
  "#6366f1", // Indigo
  "#10b981", // Emerald
  "#f59e0b", // Amber
  "#ec4899", // Pink
  "#8b5cf6", // Violet
  "#06b6d4", // Cyan
  "#f97316", // Orange
  "#14b8a6", // Teal
];

function App() {
  const [rooms, setRooms] = useState([{ prev: "", pres: "" }]);
  const [billAmount, setBillAmount] = useState("");
  const [results, setResults] = useState([]);
  const [costPerUnit, setCostPerUnit] = useState(null);
  const [totalUnitsConsumed, setTotalUnitsConsumed] = useState(0);

  // 🌙 THEME STATE
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) setTheme(savedTheme);
  }, []);

  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const addRoom = () => {
    setRooms([...rooms, { prev: "", pres: "" }]);
  };

  const removeRoom = (index) => {
    setRooms(rooms.filter((_, i) => i !== index));
    // Clear results on layout changes to avoid state mismatch
    setResults([]);
    setCostPerUnit(null);
  };

  const handleChange = (index, field, value) => {
    const updated = [...rooms];
    updated[index][field] = value;
    setRooms(updated);
  };

  const calculateBill = () => {
    if (!billAmount || Number(billAmount) <= 0) {
      alert("Please enter a valid total bill amount");
      return;
    }

    // Verify all fields are filled
    const hasEmptyFields = rooms.some(r => r.prev === "" || r.pres === "");
    if (hasEmptyFields) {
      alert("Please enter both previous and present readings for all rooms");
      return;
    }

    const units = rooms.map(r => Number(r.pres) - Number(r.prev));

    if (units.some(u => u < 0)) {
      alert("Present units must be greater than or equal to previous units for all rooms");
      return;
    }

    const totalUnits = units.reduce((a, b) => a + b, 0);

    if (totalUnits === 0) {
      alert("Total units consumed must be greater than 0 to calculate the bill division");
      return;
    }

    const cpu = billAmount / totalUnits;

    const output = rooms.map((r, i) => ({
      room: i + 1,
      prev: r.prev,
      pres: r.pres,
      units: units[i],
      bill: Math.round(units[i] * cpu),
      percentage: ((units[i] / totalUnits) * 100).toFixed(1)
    }));

    setCostPerUnit(cpu.toFixed(2));
    setTotalUnitsConsumed(totalUnits);
    setResults(output);
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="logo-container">
          <svg className="logo-icon" fill="currentColor" viewBox="0 0 24 24">
            <path d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <span className="logo-text">EasyCalc</span>
        </div>

        <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle Theme">
          {theme === "light" ? (
            <>
              <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
              </svg>
              <span>Dark Mode</span>
            </>
          ) : (
            <>
              <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
              </svg>
              <span>Light Mode</span>
            </>
          )}
        </button>
      </header>

      <main className="layout-grid">
        {/* INPUT PANEL */}
        <section className="glass-card">
          <h3 className="card-title">
            <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Room Meter Readings
          </h3>

          <div className="rooms-list">
            {rooms.map((room, index) => (
              <div className="room-input" key={index}>
                <div className="room-header">
                  <h4>Room {index + 1}</h4>
                  {rooms.length > 1 && (
                    <button
                      className="remove-btn"
                      onClick={() => removeRoom(index)}
                      title="Remove Room"
                      aria-label={`Remove Room ${index + 1}`}
                    >
                      <svg fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>

                <div className="input-group">
                  <span className="input-label">Previous Units</span>
                  <input
                    type="number"
                    placeholder="e.g. 1024"
                    value={room.prev}
                    onChange={(e) => handleChange(index, "prev", e.target.value)}
                  />
                </div>

                <div className="input-group">
                  <span className="input-label">Present Units</span>
                  <input
                    type="number"
                    placeholder="e.g. 1250"
                    value={room.pres}
                    onChange={(e) => handleChange(index, "pres", e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="bill-input-container">
            <div className="input-group">
              <span className="input-label">Total Electricity Bill (₹)</span>
              <input
                type="number"
                placeholder="Enter bill amount in ₹"
                value={billAmount}
                onChange={(e) => setBillAmount(e.target.value)}
              />
            </div>
          </div>

          <div className="action-buttons">
            <button className="btn btn-secondary" onClick={addRoom}>
              <svg fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Add Room
            </button>

            <button className="btn btn-primary" onClick={calculateBill}>
              <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75h.008v.008H15.75v-.008zm0-2.25h.008v.008H15.75v-.008zm0-2.25h.008v.008H15.75V11.25zm-2.25 4.5h.008v.008h-.008v-.008zm0-2.25h.008v.008h-.008v-.008zm0-2.25h.008v.008h-.008V11.25zm-2.25 4.5h.008v.008H11.25v-.008zm0-2.25h.008v.008H11.25v-.008zm0-2.25h.008v.008H11.25V11.25zm-2.25 4.5h.008v.008H9v-.008zm0-2.25h.008v.008H9v-.008zm0-2.25h.008v.008H9V11.25zM18 19.5v-15A1.5 1.5 0 0016.5 3h-9A1.5 1.5 0 006 4.5v15A1.5 1.5 0 007.5 21h9a1.5 1.5 0 001.5-1.5zM9 7.5h6" />
              </svg>
              Calculate Bill
            </button>
          </div>
        </section>

        {/* RESULTS PANEL */}
        {results.length > 0 && (
          <section className="results-section">
            {/* Overview Stat Cards */}
            <div className="summary">
              <div className="card">
                <p>Total Bill</p>
                <h2>₹ {billAmount}</h2>
              </div>
              <div className="card">
                <p>Cost / Unit</p>
                <h2>₹ {costPerUnit}</h2>
              </div>
              <div className="card">
                <p>Total Units</p>
                <h2>{totalUnitsConsumed}</h2>
              </div>
            </div>

            {/* Segmented Progress Chart Card */}
            <div className="glass-card chart-card">
              <div className="progress-header">
                <h3 className="card-title" style={{ marginBottom: 0 }}>
                  <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z" />
                  </svg>
                  Consumption Breakdown
                </h3>
              </div>

              <div className="progress-bar-container">
                {results.map((r, index) => (
                  <div
                    key={index}
                    className="progress-segment"
                    style={{
                      width: `${r.percentage}%`,
                      backgroundColor: ROOM_COLORS[index % ROOM_COLORS.length]
                    }}
                    data-tooltip={`Room ${r.room}: ${r.percentage}% (${r.units} units)`}
                  />
                ))}
              </div>

              <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", fontSize: "0.85rem" }}>
                {results.map((r, index) => (
                  <div key={index} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span
                      style={{
                        width: "12px",
                        height: "12px",
                        borderRadius: "50%",
                        backgroundColor: ROOM_COLORS[index % ROOM_COLORS.length]
                      }}
                    />
                    <span style={{ fontWeight: 600 }}>Room {r.room}:</span>
                    <span style={{ color: "var(--text-muted)" }}>{r.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Room Cards Grid */}
            <div className="room-grid">
              {results.map((r, index) => (
                <div className="room-card" key={r.room}>
                  <div className="room-card-header">
                    <h4>Room {r.room}</h4>
                    <span
                      className="room-badge"
                      style={{
                        backgroundColor: `${ROOM_COLORS[index % ROOM_COLORS.length]}15`,
                        color: ROOM_COLORS[index % ROOM_COLORS.length]
                      }}
                    >
                      {r.percentage}% Share
                    </span>
                  </div>

                  <div className="room-details">
                    <div className="detail-row">
                      <span>Previous Reading</span>
                      <span>{r.prev}</span>
                    </div>
                    <div className="detail-row">
                      <span>Present Reading</span>
                      <span>{r.pres}</span>
                    </div>
                    <div className="detail-row">
                      <span>Units Consumed</span>
                      <span>{r.units}</span>
                    </div>
                  </div>

                  <div className="room-cost">
                    <span>Amount Due</span>
                    <strong>₹ {r.bill}</strong>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
