import React, { useEffect, useState } from "react";
import Papa from "papaparse";
import TeamOfTheWeek from "./TeamOfTheWeek";
import PlayerTable from "./PlayerTable";
import PlayerCard from "./PlayerCard";

const App = () => {
  const [players, setPlayers] = useState([]);
  const [headshots, setHeadshots] = useState({});
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  // Define the fetchData function first
  const fetchData = async () => {
    try {
      const response = await fetch(
        "https://black-selected-toucan-858.mypinata.cloud/ipfs/QmVYY6116EnyM6BpwQ5vywxTRXuShgquZ3HCgAPf5Zm3uc"
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

  const fetchHeadshots = async () => {
    try {
      const response = await fetch(
        "https://black-selected-toucan-858.mypinata.cloud/ipfs/QmY99ynRsMPsRYsE98dwUyL99R2SY3wiCaBQPVfjzZwV3j"
      );
      const text = await response.text();
      const rows = text.split("\n").map((row) => row.split(","));
      const [header, ...data] = rows;

      // Map headshot URLs to player names
      const mappedHeadshots = data.reduce((acc, [name, url], index) => {
        if (!name || !url) {
          console.warn(`Invalid row at index ${index}:`, { name, url });
          return acc; // Skip invalid rows
        }

        const normalizedName = name.trim().toLowerCase(); // Normalize the name
        acc[normalizedName] = url.trim(); // Map the URL
        return acc;
      }, {});

      console.log("Mapped Headshots:", mappedHeadshots); // Debugging
      setHeadshots(mappedHeadshots);
    } catch (error) {
      console.error("Error fetching headshots:", error);
    }
  };

  // Use useEffect for data fetching
  useEffect(() => {
    fetchData();
    fetchHeadshots();
  }, []);

  const enrichedPlayers = players.map((player) => {
    const normalizedPlayerName = player.name.trim().toLowerCase();
    const imageUrl = headshots[normalizedPlayerName];
    console.log("Mapping Player:", player.name, "Image URL:", imageUrl); // Debugging
    return {
      ...player,
      image: imageUrl || "/placeholder.png", // Use placeholder if no match found
    };
  });

  return (
    <div className="containe bg-cover bg-center w-full min-h-screen bg-black">
      <h1 className="text-white text-3xl font-bold mb-6 p-12">PREMSCOUT</h1>

      {/* Render Team of the Week */}
      <TeamOfTheWeek
        className="container mx-auto bg-black"
        players={enrichedPlayers} // Use enrichedPlayers to include headshots
        onPlayerClick={setSelectedPlayer}
      />

      {/* Render Player Table */}
      <PlayerTable
        players={enrichedPlayers}
        onPlayerClick={setSelectedPlayer}
      />

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
