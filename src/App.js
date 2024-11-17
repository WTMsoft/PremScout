import React, { useEffect, useState } from "react";
import Papa from "papaparse";
import TeamOfTheWeek from "./TeamOfTheWeek";
import PlayerTable from "./PlayerTable";
import PlayerCard from "./PlayerCard";

const App = () => {
  const [players, setPlayers] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://gateway.pinata.cloud/ipfs/QmVYY6116EnyM6BpwQ5vywxTRXuShgquZ3HCgAPf5Zm3uc"
        );
        const csvText = await response.text();
        Papa.parse(csvText, {
          header: true,
          complete: (result) => {
            setPlayers(result.data);
          },
        });
      } catch (error) {
        console.error("Error fetching or parsing dataset:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="containe bg-cover bg-center w-full min-h-screen bg-black">
      <h1 className="text-white text-3xl font-bold mb-6 p-12">PREMSCOUT</h1>

      {/* Render Team of the Week */}
      <TeamOfTheWeek
        className="container mx-auto bg-black"
        players={players}
        onPlayerClick={setSelectedPlayer}
      />

      {/* Render Player Table */}
      <PlayerTable players={players} onPlayerClick={setSelectedPlayer} />

      {/* Render Player Card if a player is selected */}
      {selectedPlayer && (
        <PlayerCard
          player={selectedPlayer}
          onClose={() => setSelectedPlayer(null)}
        />
      )}
    </div>
  );
};

export default App;
