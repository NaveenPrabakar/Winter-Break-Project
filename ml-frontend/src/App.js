import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [playerName, setPlayerName] = useState("");
  const [playerStats, setPlayerStats] = useState(null);
  const [fullStats, setFullStats] = useState(null);

  const handleSearch = async () => {
    if (!playerName) {
      alert("Please enter a player's name.");
      return;
    }

    try {
      const res = await axios.get(
        `http://127.0.0.1:8000/player-stats/${playerName}`
      );
      setPlayerStats(res.data.players[0]);
      setFullStats(null);
    } catch (error) {
      alert(
        "Error fetching player stats: " +
          (error.response?.data?.detail || error.message)
      );
      setPlayerStats(null);
    }
  };

  const handleFullStats = async () => {
    if (!playerStats) {
      alert("Please search for a player first.");
      return;
    }
  
    try {
      const res = await axios.get(
        `http://127.0.0.1:8000/player/career/${playerName}`
      );

      const statsList = res.data.data;
      setFullStats(Array.isArray(statsList) ? statsList : []); //Make sure it is an array
    } catch (error) {
      alert(
        "Error fetching full stats: " +
          (error.response?.data?.detail || error.message)
      );
      setFullStats(null);
    }
  };

  return (
    <div className="container">
      <h1 className="header">🏈 NFL Player Stats 🏈</h1>
      <div className="searchBar">
        <input
          type="text"
          placeholder="Enter player name"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          className="input"
        />
        <button onClick={handleSearch} className="button">
          Search
        </button>
      </div>

      {playerStats && (
        <div className="statsBox animateStats">
          <h3>Player Stats</h3>
          <div style={{ textAlign: "center" }}>
            <h2>{playerStats.strPlayer}</h2>
          </div>
          <table className="table">
            <thead>
              <tr>
                <th>Team</th>
                <th>Position</th>
                <th>Date of Birth</th>
                <th>Nationality</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{playerStats.strTeam || "N/A"}</td>
                <td>{playerStats.strPosition || "N/A"}</td>
                <td>{playerStats.dateBorn || "N/A"}</td>
                <td>{playerStats.strNationality || "N/A"}</td>
                <td>{playerStats.strDescriptionEN || "No description available"}</td>
              </tr>
            </tbody>
          </table>
          <button onClick={handleFullStats} className="button">
            Full Stats
          </button>
        </div>
      )}



{fullStats && fullStats.length > 0 && (
  <div className="fullStatsBox">
    <h3>Full Career Stats</h3>
    <table className="statsTable">
      <thead>
        <tr>
          {}
          {Object.keys(fullStats[0]).map((key) => (
            <th key={key}>{key}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {}
        {fullStats.map((stat, index) => (
          <tr key={index}>
            {Object.values(stat).map((value, i) => (
              <td key={i}>{value}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}


      <div className="footballAnimation" />
    </div>
  );
}

export default App;