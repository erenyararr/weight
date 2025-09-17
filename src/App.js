import React, { useEffect, useState } from "react";
import "./App.css";

/* ===== 1) Hard-coded users (for internal use / demo only) ===== */
const USERS = {
  erenyy: "1234",
  // add more: "hasan": "abcd",
};

/* ===== 2) Login Component ===== */
function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (USERS[username] && USERS[username] === password) {
      onLogin(username);
    } else {
      setErr("Invalid username or password.");
    }
  };

  return (
    <div className="login-wrap">
      <form className="login-card" onSubmit={handleSubmit} autoComplete="off">
        <h2>Sign In</h2>

        <label>Username</label>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value.trim())}
          autoFocus
        />

        <label>Password</label>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {err && <div className="error">{err}</div>}
        <button type="submit">Sign In</button>
      </form>
    </div>
  );
}

/* ===== 3) Weight & Balance App ===== */
const aircraftData = {
  "C-GQKX (C150M)": { emptyWeight: 1128.87, emptyMoment: 37255.09, emptyArm: 33.0,  maxTakeoffWeight: 1599, maxUsableFuel: 135 },
  "C-GQHU (C150M)": { emptyWeight: 1128.87, emptyMoment: 37255.09, emptyArm: 33.0,  maxTakeoffWeight: 1599, maxUsableFuel: 135 },
  "C-GPUY (C150M)": { emptyWeight: 1138.84, emptyMoment: 38478.37, emptyArm: 33.79, maxTakeoffWeight: 1599, maxUsableFuel: 135 },
  "C-GNUQ (C150M)": { emptyWeight: 1136.75, emptyMoment: 38565.23, emptyArm: 33.93, maxTakeoffWeight: 1599, maxUsableFuel: 135 },
  "C-GNLY (C150M)": { emptyWeight: 1135.8,  emptyMoment: 38500.7,  emptyArm: 33.90, maxTakeoffWeight: 1599, maxUsableFuel: 135 },
  "C-GYGH (C150M)": { emptyWeight: 1136.75, emptyMoment: 38565.23, emptyArm: 33.93, maxTakeoffWeight: 1599, maxUsableFuel: 135 },
  "C-GUGC (C150L)": { emptyWeight: 1117.65, emptyMoment: 37020.15, emptyArm: 33.13, maxTakeoffWeight: 1599, maxUsableFuel: 135 },
  "C-GUDB (C150M)": { emptyWeight: 1140.15, emptyMoment: 36837.00, emptyArm: 32.31, maxTakeoffWeight: 1599, maxUsableFuel: 135 },
  "C-GRWH (C150M)": { emptyWeight: 1143.3,  emptyMoment: 37700.10, emptyArm: 32.96, maxTakeoffWeight: 1599, maxUsableFuel: 135 },
  "C-GRAE (C150M)": { emptyWeight: 1116.15, emptyMoment: 36220.38, emptyArm: 32.45, maxTakeoffWeight: 1599, maxUsableFuel: 135 },
  "C-GACS (C150L)": { emptyWeight: 1112.34, emptyMoment: 37090.82, emptyArm: 33.35, maxTakeoffWeight: 1599, maxUsableFuel: 135 },
  "C-FUAE (C150M)": { emptyWeight: 1109.25, emptyMoment: 37347.83, emptyArm: 33.67, maxTakeoffWeight: 1599, maxUsableFuel: 135 },
  "C-FTPX (C150K)": { emptyWeight: 1153.75, emptyMoment: 38592.08, emptyArm: 33.45, maxTakeoffWeight: 1599, maxUsableFuel: 135 },
  "C-GNBI (C150M)": { emptyWeight: 1108.75, emptyMoment: 37317.38, emptyArm: 33.66, maxTakeoffWeight: 1599, maxUsableFuel: 135 },
  "C-GHQS (A150M)": { emptyWeight: 1137.95, emptyMoment: 38210.21, emptyArm: 33.57, maxTakeoffWeight: 1599, maxUsableFuel: 135 },
  "C-GFVI (C150M)": { emptyWeight: 1139.42, emptyMoment: 38091.38, emptyArm: 33.43, maxTakeoffWeight: 1599, maxUsableFuel: 135 },
  "C-GDXD (C150M)": { emptyWeight: 1156.25, emptyMoment: 39259.43, emptyArm: 33.95, maxTakeoffWeight: 1599, maxUsableFuel: 135 },
  "C-GBGM (A150M)": { emptyWeight: 1153.48, emptyMoment: 38418.20, emptyArm: 33.31, maxTakeoffWeight: 1599, maxUsableFuel: 135 },
  "C-GAQH (C150M)": { emptyWeight: 1151.86, emptyMoment: 38460.20, emptyArm: 33.38, maxTakeoffWeight: 1599, maxUsableFuel: 135 },
  "C-FTOD (C150M)": { emptyWeight: 1112.15, emptyMoment: 36577.25, emptyArm: 32.93, maxTakeoffWeight: 1599, maxUsableFuel: 135 },
};

const GPH = 4.6;            // gallons per hour
const FUEL_LBS_PER_GAL = 6; // lbs per gallon

const parseNum = (v) => {
  const n = parseFloat(String(v).replace(",", "."));
  return Number.isFinite(n) ? n : 0;
};

function WeightBalanceApp({ onLogout, username }) {
  const [selectedAircraft, setSelectedAircraft] = useState("C-FTPX (C150K)");
  const [studentWeight, setStudentWeight] = useState(0);
  const [instructorWeight, setInstructorWeight] = useState(0);
  const [baggage1, setBaggage1] = useState(0);
  const [baggage2, setBaggage2] = useState(0);
  const [fuelWeight, setFuelWeight] = useState(0);
  const [flightTime, setFlightTime] = useState(0);

  const aircraft = aircraftData[selectedAircraft];
  const momentArms = { student: 39, instructor: 39, baggage1: 64, baggage2: 95, fuel: 42.2 };

  const zeroFuelWeight =
    aircraft.emptyWeight + studentWeight + instructorWeight + baggage1 + baggage2;

  const zeroFuelMoment =
    aircraft.emptyMoment +
    studentWeight * momentArms.student +
    instructorWeight * momentArms.instructor +
    baggage1 * momentArms.baggage1 +
    baggage2 * momentArms.baggage2;

  // Allowed fuel limited by MTOW and tank capacity
  const maxFuelByWeight = Math.max(0, aircraft.maxTakeoffWeight - zeroFuelWeight);
  const maxAllowedFuel = Math.min(aircraft.maxUsableFuel, maxFuelByWeight);

  const autoCalculateFuel = () => setFuelWeight(maxAllowedFuel);
  const handleFuelChange = (val) => {
    const v = Math.max(0, parseNum(val));
    setFuelWeight(Math.min(v, maxAllowedFuel));
  };

  // Prevent consuming more fuel than on board
  const rawUsedFuel = parseNum(flightTime) * GPH * FUEL_LBS_PER_GAL;
  const actualUsedFuel = Math.min(rawUsedFuel, fuelWeight);

  const fuelMoment = fuelWeight * momentArms.fuel;
  const takeoffWeight = zeroFuelWeight + fuelWeight;
  const takeoffMoment = zeroFuelMoment + fuelMoment;

  const landingWeight = takeoffWeight - actualUsedFuel;
  const landingMoment = takeoffMoment - actualUsedFuel * momentArms.fuel;

  const safe = (x) => (Number.isFinite(x) ? x : 0);

  return (
    <div className="attitude-bg">
      <div className="container">
        <div className="topbar">
          <h1>Select Aviation | Automated Weight & Balance</h1>
          <div className="userbox">
            <span>👤 {username}</span>
            <button onClick={onLogout}>Logout</button>
          </div>
        </div>
        <p className="subtitle">Designed for pilot operations and aircraft loading</p>

        <div className="section">
          <label>✈️ Select Aircraft:</label>
          <select value={selectedAircraft} onChange={(e) => setSelectedAircraft(e.target.value)}>
            {Object.keys(aircraftData).map((key) => (
              <option key={key} value={key}>{key}</option>
            ))}
          </select>
        </div>

        <div className="grid-inputs">
          <div>
            <label>🧍‍♂️ Student Weight</label>
            <input type="text" value={studentWeight || ""} onChange={(e) => setStudentWeight(parseNum(e.target.value))} />
          </div>
          <div>
            <label>👨‍🏫 Instructor Weight</label>
            <input type="text" value={instructorWeight || ""} onChange={(e) => setInstructorWeight(parseNum(e.target.value))} />
          </div>
          <div>
            <label>🎒 Baggage Area 1</label>
            <input type="text" value={baggage1 || ""} onChange={(e) => setBaggage1(parseNum(e.target.value))} />
          </div>
          <div>
            <label>🎒 Baggage Area 2</label>
            <input type="text" value={baggage2 || ""} onChange={(e) => setBaggage2(parseNum(e.target.value))} />
          </div>
          <div>
            <label>🕓 Flight Time (hrs)</label>
            <input
              type="text"
              value={flightTime || ""}
              onChange={(e) => setFlightTime(parseNum(e.target.value))}
              placeholder="e.g., 1.7 or 1,7"
            />
          </div>

          <div>
            <label>⛽ Fuel on Board (max {Math.floor(maxAllowedFuel)} lbs)</label>
            <input type="text" value={fuelWeight || ""} onChange={(e) => handleFuelChange(e.target.value)} />
            <button onClick={autoCalculateFuel}>Auto-calculate Fuel</button>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Description</th><th>Weight</th><th>Arm</th><th>Moment</th>
            </tr>
          </thead>
        <tbody>
            <tr><td>EMPTY WEIGHT</td><td>{aircraft.emptyWeight}</td><td>{aircraft.emptyArm}</td><td>{aircraft.emptyMoment.toFixed(2)}</td></tr>
            <tr><td>PILOT(S)</td><td>{(studentWeight + instructorWeight).toFixed(2)}</td><td>39</td><td>{((studentWeight + instructorWeight) * 39).toFixed(2)}</td></tr>
            <tr><td>BAGGAGE 1</td><td>{baggage1}</td><td>64</td><td>{(baggage1 * 64).toFixed(2)}</td></tr>
            <tr><td>BAGGAGE 2</td><td>{baggage2}</td><td>95</td><td>{(baggage2 * 95).toFixed(2)}</td></tr>
            <tr className="highlight"><td>ZERO FUEL WEIGHT</td><td>{zeroFuelWeight.toFixed(2)}</td><td>{(safe(zeroFuelMoment / zeroFuelWeight)).toFixed(2)}</td><td>{zeroFuelMoment.toFixed(2)}</td></tr>
            <tr><td>FUEL ON BOARD</td><td>{fuelWeight.toFixed(2)}</td><td>42.2</td><td>{(fuelWeight * 42.2).toFixed(2)}</td></tr>
            <tr className="highlight"><td>TAKEOFF WEIGHT</td><td>{takeoffWeight.toFixed(2)}</td><td>{(safe(takeoffMoment / takeoffWeight)).toFixed(2)}</td><td>{takeoffMoment.toFixed(2)}</td></tr>
            <tr><td>USED FUEL</td><td>{actualUsedFuel.toFixed(2)}</td><td>42.2</td><td>{(actualUsedFuel * 42.2).toFixed(2)}</td></tr>
            <tr className="highlight"><td>LANDING WEIGHT</td><td>{landingWeight.toFixed(2)}</td><td>{(safe(landingMoment / landingWeight)).toFixed(2)}</td><td>{landingMoment.toFixed(2)}</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ===== 4) Root App: show Login or App ===== */
export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("authUser");
    if (saved) setUser(saved);
  }, []);

  const handleLogin = (username) => {
    setUser(username);
    localStorage.setItem("authUser", username);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("authUser");
  };

  if (!user) return <Login onLogin={handleLogin} />;
  return <WeightBalanceApp onLogout={handleLogout} username={user} />;
}
