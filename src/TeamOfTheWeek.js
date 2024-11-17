const TeamOfTheWeek = ({ players, onPlayerClick }) => {
  const formation = [
    { position: "GKP", count: 1 },
    { position: "DEF", count: 4 },
    { position: "MID", count: 3 },
    { position: "FWD", count: 3 },
  ];

  const getTopPlayers = (position, count) =>
    players
      .filter((player) => player.position === position)
      .sort((a, b) => b.predicted_points - a.total_predicted_points)
      .slice(0, count);

  const lineup = formation.map(({ position, count }) =>
    getTopPlayers(position, count)
  );

  return (
    <div className="grid gap-6 text-center bg-gray-100 p-4 rounded-md">
      <h2 className="text-lg font-semibold mb-4">Team of the Week</h2>
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
                className="p-4 bg-green-200 rounded shadow-md w-24 text-center cursor-pointer"
                onClick={() => onPlayerClick(player)}
              >
                <h3 className="text-sm font-bold">{player.name}</h3>
                <p className="text-xs">{player.position}</p>
                <p className="text-xs mt-1">
                  Pts: {Math.round(player.predicted_points * 10) / 10}
                </p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamOfTheWeek;
