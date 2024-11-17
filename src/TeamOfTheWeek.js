import React from "react";

const TeamOfTheWeek = ({ players = [], onPlayerClick }) => {
  const formation = [
    { position: "GKP", count: 1 },
    { position: "DEF", count: 4 },
    { position: "MID", count: 3 },
    { position: "FWD", count: 3 },
  ];

  const getTopPlayers = (position, count) => {
    if (!players || players.length === 0) return [];
    return players
      .filter((player) => player.position === position)
      .sort((a, b) => b.predicted_points - a.predicted_points)
      .slice(0, count);
  };

  const lineup = formation.map(({ position, count }) =>
    getTopPlayers(position, count)
  );

  return (
    <div
      className="relative flex justify-center items-center bg-cover bg-center w-full min-h-screen px-4"
      style={{
        backgroundImage: "url('/field.png')",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="max-w-screen-lg w-full">
        <h2 className="text-white text-center text-4xl font-bold pt-6 mb-8">
          Team of the Week
        </h2>
        <h4 className="text text-center text-1xl font-bold pt-3 mb-4">
          PREMSCOUT Projected Points
        </h4>
        <div className="flex flex-col justify-between items-center pt-8 pb-16 space-y-4">
          {lineup.map((row, rowIndex) => (
            <div
              key={rowIndex}
              className={`flex justify-center gap-16 ${
                rowIndex === 0 ? "mt-4" : ""
              }`}
            >
              {row.map((player, playerIndex) => (
                <div
                  key={playerIndex}
                  className="relative flex flex-col items-center shadow-lg rounded-lg w-36 h-52 cursor-pointer bg-white overflow-hidden"
                  onClick={() => onPlayerClick(player)}
                >
                  <div className="flex flex-col items-center p-4 w-full">
                    <h3
                      className="text-base font-bold text-center text-gray-800 mb-1 truncate"
                      title={player.name} // Tooltip for full name
                    >
                      {player.name}
                    </h3>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      {player.team}
                    </p>
                    <p className="text-sm font-medium text-gray-600 mb-2">
                      {player.position}
                    </p>
                    <p className="text-2xl font-extrabold p-2 text-gray-800">
                      {Math.round(player.predicted_points * 10) / 10} pts
                    </p>
                  </div>
                  <div className="absolute bottom-0 w-full bg-purple-700 text-white py-2 rounded-b-lg text-center">
                    <p className="text-sm font-medium">{player.position}</p>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeamOfTheWeek;