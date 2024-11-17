import React, { useEffect, useState } from "react";
import Papa from "papaparse";
import TeamOfTheWeek from "./TeamOfTheWeek";
import PlayerTable from "./PlayerTable";

const App = () => {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://black-selected-toucan-858.mypinata.cloud/ipfs/QmdGnDedJiUxYtsSiZ2j79DTrkBcaU1prfqdjgogNgCNBt"
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
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Premier League Fantasy Visualizer
      </h1>
      {players.length === 0 ? (
        <p className="text-center">Loading data...</p>
      ) : (
        <>
          <TeamOfTheWeek players={players} />
          <PlayerTable players={players} />
        </>
      )}
    </div>
  );
};

export default App;
