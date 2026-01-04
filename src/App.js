import React, { useState } from "react";
import "./App.css";

function App() {
  const [rooms, setRooms] = useState([
    { prev: "", pres: "" }
  ]);
  const [billAmount, setBillAmount] = useState("");
  const [result, setResult] = useState([]);
  const [costPerUnit, setCostPerUnit] = useState(0);

  const addRoom = () => {
    setRooms([...rooms, { prev: "", pres: "" }]);
  };

  const removeRoom = (index) => {
    const updated = rooms.filter((_, i) => i !== index);
    setRooms(updated);
  };

  const handleChange = (index, field, value) => {
    const updated = [...rooms];
    updated[index][field] = value;
    setRooms(updated);
  };

  const calculateBill = () => {
    const units = rooms.map(r => Number(r.pres) - Number(r.prev));
    const totalUnits = units.reduce((a, b) => a + b, 0);
    const cpu = billAmount / totalUnits;

    const output = units.map((u, i) => ({
      room: i + 1,
      prev: rooms[i].prev,
      pres: rooms[i].pres,
      units: u,
      bill: Math.round(u * cpu)
    }));

    setCostPerUnit(cpu.toFixed(2));
    setResult(output);
  };

  return (
    <div className="dashboard">
      <h1>⚡ Electricity Bill Dashboard</h1>

      {/* SUMMARY */}
      <div className="summary">
        <div className="card">
          <p>Total Bill</p>
          <h2>₹ {billAmount || 0}</h2>
        </div>
        <div className="card">
          <p>Cost / Unit</p>
          <h2>₹ {costPerUnit || 0}</h2>
        </div>
        <div className="card">
          <p>Total Rooms</p>
          <h2>{rooms.length}</h2>
        </div>
      </div>

      {/* INPUT ROOMS */}
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

        <button className="calc-btn" onClick={calculateBill}>
          Calculate Bill
        </button>
      </div>

      {/* RESULTS */}
      <div className="room-grid">
        {result.map((r) => (
          <div className="room-card" key={r.room}>
            <h4>Room {r.room}</h4>
            <p>Previous: {r.prev}</p>
            <p>Present: {r.pres}</p>
            <p>Units Used: {r.units}</p>
            <strong>₹ {r.bill}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
