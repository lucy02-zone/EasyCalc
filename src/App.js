import React, { useState } from "react";
import "./App.css";

function App() {
  const [rooms, setRooms] = useState([{ prev: "", pres: "" }]);
  const [billAmount, setBillAmount] = useState("");
  const [results, setResults] = useState([]);
  const [costPerUnit, setCostPerUnit] = useState(null);

  const addRoom = () => {
    setRooms([...rooms, { prev: "", pres: "" }]);
  };

  const removeRoom = (index) => {
    setRooms(rooms.filter((_, i) => i !== index));
  };

  const handleChange = (index, field, value) => {
    const updated = [...rooms];
    updated[index][field] = value;
    setRooms(updated);
  };

  const calculateBill = () => {
    if (!billAmount) {
      alert("Please enter total bill amount");
      return;
    }

    const units = rooms.map(r => Number(r.pres) - Number(r.prev));

    if (units.some(u => u < 0)) {
      alert("Present units must be greater than previous units");
      return;
    }

    const totalUnits = units.reduce((a, b) => a + b, 0);
    const cpu = billAmount / totalUnits;

    const output = rooms.map((r, i) => ({
      room: i + 1,
      prev: r.prev,
      pres: r.pres,
      units: units[i],
      bill: Math.round(units[i] * cpu)
    }));

    setCostPerUnit(cpu.toFixed(2));
    setResults(output);
  };

  return (
    <div className="dashboard">
      <h1>⚡ Electricity Bill Dashboard</h1>

      {/* ROOM INPUTS */}
      <div className="input-card">
        <h3>Room Meter Readings</h3>

        {rooms.map((room, index) => (
          <div className="room-input" key={index}>
            <h4>Room {index + 1}</h4>

            <input
              type="number"
              placeholder="Previous Units"
              value={room.prev}
              onChange={(e) =>
                handleChange(index, "prev", e.target.value)
              }
            />

            <input
              type="number"
              placeholder="Present Units"
              value={room.pres}
              onChange={(e) =>
                handleChange(index, "pres", e.target.value)
              }
            />

            {rooms.length > 1 && (
              <button
                className="remove-btn"
                onClick={() => removeRoom(index)}
              >
                ❌
              </button>
            )}
          </div>
        ))}

        <button className="add-btn" onClick={addRoom}>
          ➕ Add Room
        </button>

        {/* TOTAL BILL INPUT */}
        <input
          className="bill-input"
          type="number"
          placeholder="Total Electricity Bill (₹)"
          value={billAmount}
          onChange={(e) => setBillAmount(e.target.value)}
        />

        <button className="calc-btn" onClick={calculateBill}>
          Calculate Bill
        </button>
      </div>

      {/* RESULTS */}
      {results.length > 0 && (
        <>
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
              <p>Total Rooms</p>
              <h2>{rooms.length}</h2>
            </div>
          </div>

          <div className="room-grid">
            {results.map((r) => (
              <div className="room-card" key={r.room}>
                <h4>Room {r.room}</h4>
                <p>Previous: {r.prev}</p>
                <p>Present: {r.pres}</p>
                <p>Units Used: {r.units}</p>
                <strong>₹ {r.bill}</strong>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default App;
