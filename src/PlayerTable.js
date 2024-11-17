import React, { useState } from "react";

const PlayerTable = ({ players }) => {
  const [filter, setFilter] = useState("");
  const [positionFilter, setPositionFilter] = useState("");
  const [teamFilter, setTeamFilter] = useState("");
  const [priceRange, setPriceRange] = useState([0, 200]); // Adjusted maximum price range
  const [sortField, setSortField] = useState(null);
  const [ascending, setAscending] = useState(true);

  // Filter logic
  const filteredPlayers = players.filter((player) => {
    const matchesName =
      player.name && player.name.toLowerCase().includes(filter.toLowerCase());
    const matchesPosition = positionFilter
      ? player.position === positionFilter
      : true;
    const matchesTeam = teamFilter ? player.team === teamFilter : true;
    const matchesPrice =
      player.now_cost >= priceRange[0] && player.now_cost <= priceRange[1];
    return matchesName && matchesPosition && matchesTeam && matchesPrice;
  });

  // Sorting logic
  const sortedPlayers = [...filteredPlayers].sort((a, b) => {
    if (!sortField) return 0; // If no sort field is selected, return unsorted

    const aValue = isNaN(a[sortField])
      ? a[sortField]
      : parseFloat(a[sortField]);
    const bValue = isNaN(b[sortField])
      ? b[sortField]
      : parseFloat(b[sortField]);

    if (ascending) {
      return aValue > bValue ? 1 : -1;
    }
    return aValue < bValue ? 1 : -1;
  });

  const toggleSort = (field) => {
    setSortField(field);
    setAscending(sortField === field ? !ascending : true);
  };

  // Extract unique teams for the dropdown filter
  const teams = [...new Set(players.map((player) => player.team))].sort();

  return (
    <div className="mt-8">
      <h2 className="text-lg font-semibold mb-4">Player Data</h2>

      {/* Filter Section */}
      <div className="flex flex-wrap gap-4 mb-4">
        {/* Name Search Filter */}
        <input
          type="text"
          placeholder="Search players..."
          className="p-3 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />

        {/* Position Dropdown Filter */}
        <select
          className="p-3 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          value={positionFilter}
          onChange={(e) => setPositionFilter(e.target.value)}
        >
          <option value="">All Positions</option>
          <option value="GKP">Goalkeeper</option>
          <option value="DEF">Defender</option>
          <option value="MID">Midfielder</option>
          <option value="FWD">Forward</option>
        </select>

        {/* Team Dropdown Filter */}
        <select
          className="p-3 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          value={teamFilter}
          onChange={(e) => setTeamFilter(e.target.value)}
        >
          <option value="">All Teams</option>
          {teams.map((team, index) => (
            <option key={index} value={team}>
              {team}
            </option>
          ))}
        </select>

        {/* Price Range Filter */}
        <div className="flex items-center">
          <label className="mr-2">Price Range:</label>
          <input
            type="range"
            min="0"
            max="200"
            step="1"
            value={priceRange[1]}
            onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
            className="focus:ring-2 focus:ring-blue-500"
          />
          <span className="ml-2">${(priceRange[1] / 10).toFixed(1)}M</span>
        </div>

        {/* Reset Sort Button */}
        <button
          onClick={() => {
            setSortField(null);
            setAscending(true);
          }}
          className="p-3 bg-blue-500 text-white rounded-md shadow-sm hover:bg-blue-600"
        >
          Reset Sort
        </button>
      </div>

      {/* Player Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              {[
                { field: "name", label: "Name" },
                { field: null, label: "Team" }, // No sorting for the Team column
                { field: "position", label: "Position" },
                { field: "total_points", label: "Points" },
                { field: "now_cost", label: "Price" },
                { field: "goals_scored", label: "Goals" },
                { field: "assists", label: "Assists" },
              ].map(({ field, label }) => (
                <th
                  key={label}
                  className={`p-3 border cursor-pointer text-left ${
                    sortField === field ? "bg-blue-200" : ""
                  }`}
                  onClick={() => field && toggleSort(field)} // Sort only if field is not null
                >
                  <span className="flex items-center">
                    {label}
                    {field && sortField === field && (
                      <span className="ml-2 text-sm">
                        {ascending ? "🔼" : "🔽"}
                      </span>
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedPlayers.map((player, index) => (
              <tr
                key={index}
                className={`border ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                }`}
              >
                <td className="p-3">{player.name}</td>
                <td className="p-3">{player.team}</td>
                <td className="p-3">{player.position}</td>
                <td className="p-3">{player.total_points}</td>
                <td className="p-3">${(player.now_cost / 10).toFixed(1)}M</td>
                <td className="p-3">{player.goals_scored}</td>
                <td className="p-3">{player.assists}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PlayerTable;
