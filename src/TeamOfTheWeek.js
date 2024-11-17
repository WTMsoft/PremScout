import React from "react";

const TeamOfTheWeek = ({ players }) => {
  // Formation: 1 Goalkeeper, 4 Defenders, 3 Midfielders, 3 Forwards
  const formation = [
    { position: "GKP", count: 1 },
    { position: "DEF", count: 4 },
    { position: "MID", count: 3 },
    { position: "FWD", count: 3 },
  ];

  const getTopPlayers = (position, count) =>
    players
      .filter((player) => player.position === position)
      .sort((a, b) => b.total_points - a.total_points)
      .slice(0, count);

  const lineup = formation.map(({ position, count }) =>
    getTopPlayers(position, count)
  );

  return (
    <div className="bg-green-700 text-white p-6 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-6">Team of the Week</h2>
      <div className="grid grid-rows-4 gap-4">
        {lineup.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className={`flex justify-center gap-4 ${
              row.length === 1
                ? "justify-center"
                : row.length === 3
                ? "justify-between"
                : "justify-evenly"
            }`}
          >
            {row.map((player, playerIndex) => (
              <div
                key={playerIndex}
                className="bg-green-900 p-4 rounded shadow-md w-24 text-center"
              >
                <h3 className="text-sm font-bold">{player.name}</h3>
                <p className="text-xs">{player.position}</p>
                <p className="text-xs mt-1">Pts: {player.total_points}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamOfTheWeek;
