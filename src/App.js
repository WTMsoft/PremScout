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
          const processedData = processPlayerValues(result.data);
          setPlayers(processedData);
        },
      });
    } catch (error) {
      console.error("Error fetching or parsing dataset:", error);
    }
  };

  // Process player values based on position
  const processPlayerValues = (playersData) => {
    // Group players by position and find highest predicted points for each position
    const highestPointsByPosition = playersData.reduce((acc, player) => {
      const points = parseFloat(player.predicted_points) || 0;
      if (!acc[player.position] || points > acc[player.position]) {
        acc[player.position] = points;
      }
      return acc;
    }, {});

    // Calculate value for each player
    return playersData.map(player => {
      const highestPoints = highestPointsByPosition[player.position] || 1;
      const playerPoints = parseFloat(player.predicted_points) || 0;
      const value = Math.min(5, Math.round((playerPoints / highestPoints) * 5));
      return {
        ...player,
        value
      };
    });
  };

  const fetchHeadshots = async () => {
    try {
      const response = await fetch(
        "https://black-selected-toucan-858.mypinata.cloud/ipfs/QmY99ynRsMPsRYsE98dwUyL99R2SY3wiCaBQPVfjzZwV3j"
      );
      const text = await response.text();
      const rows = text.split("\n").map((row) => row.split(","));
      const [header, ...data] = rows;

      const mappedHeadshots = data.reduce((acc, [name, url], index) => {
        if (!name || !url) {
          console.warn(`Invalid row at index ${index}:`, { name, url });
          return acc;
        }

        const normalizedName = name.trim().toLowerCase();
        acc[normalizedName] = url.trim();
        return acc;
      }, {});

      console.log("Mapped Headshots:", mappedHeadshots);
      setHeadshots(mappedHeadshots);
    } catch (error) {
      console.error("Error fetching headshots:", error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchHeadshots();
  }, []);

  const enrichedPlayers = players.map((player) => {
    const normalizedPlayerName = player.name.trim().toLowerCase();
    const imageUrl = headshots[normalizedPlayerName];
    return {
      ...player,
      image: imageUrl || "/placeholder.png",
    };
  });

  return (
    <div className="containe bg-cover bg-center w-full min-h-screen bg-black">
      <h1 className="text-white text-3xl font-bold mb-6 p-12">PREMSCOUT</h1>

      <TeamOfTheWeek
        className="container mx-auto bg-black"
        players={enrichedPlayers}
        onPlayerClick={setSelectedPlayer}
      />

      <PlayerTable
        players={enrichedPlayers}
        onPlayerClick={setSelectedPlayer}
      />

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