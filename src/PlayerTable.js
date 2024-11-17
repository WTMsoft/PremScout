import React, { useState } from "react";

const PlayerTable = ({ players = [], onPlayerClick = () => {} }) => {
  const [filter, setFilter] = useState("");
  const [positionFilter, setPositionFilter] = useState("");
  const [teamFilter, setTeamFilter] = useState("");
  const [priceRange, setPriceRange] = useState([0, 200]);
  const [sortField, setSortField] = useState(null);
  const [decending, setDecending] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const playersPerPage = 20;

  const filteredPlayers = (players || []).filter((player) => {
    const matchesName = player.name && player.name.toLowerCase().includes(filter.toLowerCase());
    const matchesPosition = positionFilter ? player.position === positionFilter : true;
    const matchesTeam = teamFilter ? player.team === teamFilter : true;
    const matchesPrice = player.now_cost >= priceRange[0] && player.now_cost <= priceRange[1];
    return matchesName && matchesPosition && matchesTeam && matchesPrice;
  });

  const sortedPlayers = [...filteredPlayers].sort((a, b) => {
    if (!sortField) return 0;
    let aValue = a[sortField];
    let bValue = b[sortField];
    if (aValue === undefined) aValue = "";
    if (bValue === undefined) bValue = "";
    if (typeof aValue === "string" && !isNaN(aValue)) {
      aValue = parseFloat(aValue);
    }
    if (typeof bValue === "string" && !isNaN(bValue)) {
      bValue = parseFloat(bValue);
    }
    if (sortField === "predicted_points" || sortField === "expected_goals") {
      aValue = Math.round(aValue * 10) / 10;
      bValue = Math.round(bValue * 10) / 10;
    }
    if (typeof aValue === "string" && typeof bValue === "string") {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }
    return decending ? (aValue < bValue ? 1 : -1) : (aValue > bValue ? 1 : -1);
  });

  const totalPages = Math.ceil(sortedPlayers.length / playersPerPage);
  const startIndex = (currentPage - 1) * playersPerPage;
  const paginatedPlayers = sortedPlayers.slice(startIndex, startIndex + playersPerPage);

  const toggleSort = (field) => {
    if (sortField === field) {
      setDecending(!decending);
    } else {
      setSortField(field);
      setDecending(true);
    }
  };

  const teams = [...new Set((players || []).map((player) => player.team))].sort();

  const isPremscoutColumn = (field) => {
    return field === "expected_goals" || field === "predicted_points";
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="mt-8 p-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-100 text-center">Player Data</h2>

        {/* Filter Section */}
        <div className="flex flex-wrap gap-4 mb-4 justify-center">
          <input
            type="text"
            placeholder="Search players..."
            className="p-3 border rounded-full bg-gray-700 text-gray-100 border-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder-gray-400 text-center w-48"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />

          <select
            className="p-3 border rounded-full bg-indigo-900 text-gray-100 border-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none text-center appearance-none pr-8 w-40 hover:bg-indigo-800 transition-colors"
            value={positionFilter}
            onChange={(e) => setPositionFilter(e.target.value)}
          >
            <option value="">All Positions</option>
            <option value="GKP">Goalkeeper</option>
            <option value="DEF">Defender</option>
            <option value="MID">Midfielder</option>
            <option value="FWD">Forward</option>
          </select>

          <select
            className="p-3 border rounded-full bg-indigo-900 text-gray-100 border-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none text-center appearance-none pr-8 w-40 hover:bg-indigo-800 transition-colors"
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

          <div className="flex items-center">
            <label className="mr-2 text-gray-100">Price Range:</label>
            <input
              type="range"
              min="0"
              max="200"
              step="1"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
              className="focus:ring-2 focus:ring-blue-500"
            />
            <span className="ml-2 text-gray-100">${(priceRange[1] / 10).toFixed(1)}M</span>
          </div>

          <button
            onClick={() => {
              setSortField(null);
              setDecending(true);
              setCurrentPage(1);
            }}
            className="p-3 bg-gray-700 text-gray-100 rounded-full shadow-sm hover:bg-gray-600 px-6"
          >
            Reset Sort
          </button>
        </div>

        {/* Rest of the component remains the same */}
        {/* Player Table */}
        <div className="overflow-hidden rounded-lg border border-gray-800">
          <table className="min-w-full table-auto">
            <thead className="bg-indigo-900">
              <tr>
                {[
                  { field: "name", label: "Name" },
                  { field: "team", label: "Team" },
                  { field: "position", label: "Position" },
                  { field: "expected_goals", label: "PREMSCOUT Expected\nGoals" },
                  { field: "predicted_points", label: "PREMSCOUT Projected Points" },
                  { field: "goals_scored", label: "Goals" },
                  { field: "total_points", label: "Total Points" },
                  { field: "now_cost", label: "Price" },
                  { field: "form", label: "Form" },
                  { field: "assists", label: "Assists" },
                  { field: "clean_sheets", label: "Clean Sheets" },
                  { field: "saves_per_90", label: "Saves Per 90" }
                ].map(({ field, label }, index, array) => (
                  <th
                    key={label}
                    className={`p-3 border-b border-gray-800 cursor-pointer text-center ${
                      isPremscoutColumn(field) ? 'text-green-400' : 'text-gray-100'
                    } ${
                      sortField === field ? "bg-indigo-800" : ""
                    } ${
                      index === 0 ? 'rounded-tl-lg' : ''
                    } ${
                      index === array.length - 1 ? 'rounded-tr-lg' : ''
                    }`}
                    onClick={() => field && toggleSort(field)}
                  >
                    <span className="flex items-center justify-center">
                      {label}
                      {field && sortField === field && (
                        <span className="ml-2 text-sm">
                          {decending ? "🔽" : "🔼"}
                        </span>
                      )}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedPlayers.map((player, index) => (
                <tr
                  key={index}
                  className={`${
                    index % 2 === 0 ? "bg-black" : "bg-gray-900"
                  } ${
                    index === paginatedPlayers.length - 1 ? "last-row" : ""
                  }`}
                >
                  <td
                    className={`p-3 text-blue-400 cursor-pointer hover:text-blue-300 underline text-center border-b border-gray-800 ${
                      index === paginatedPlayers.length - 1 ? "rounded-bl-lg" : ""
                    }`}
                    onClick={() => onPlayerClick(player)}
                  >
                    {player.name}
                  </td>
                  {[
                    player.team,
                    player.position,
                    player.expected_goals !== undefined ? parseFloat(player.expected_goals).toFixed(1) : "0.0",
                    player.predicted_points !== undefined && player.predicted_points !== null ? Math.round(player.predicted_points * 10) / 10 : "0.0",
                    player.goals_scored,
                    player.total_points,
                    `$${(player.now_cost / 10).toFixed(1)}M`,
                    player.form,
                    player.assists,
                    player.clean_sheets,
                    player.saves_per_90
                  ].map((value, cellIndex, array) => (
                    <td
                      key={cellIndex}
                      className={`p-3 ${
                        cellIndex < 2 ? 'text-gray-100' : 
                        cellIndex < 4 ? 'text-green-400' : 'text-gray-100'
                      } text-center border-b border-gray-800 ${
                        index === paginatedPlayers.length - 1 && cellIndex === array.length - 1 ? "rounded-br-lg" : ""
                      }`}
                    >
                      {value}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-center items-center mt-4 gap-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`p-2 rounded ${
              currentPage === 1
                ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-gray-100"
            }`}
          >
            Previous
          </button>
          <p className="text-gray-100">
            Page {currentPage} of {totalPages}
          </p>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`p-2 rounded ${
              currentPage === totalPages
                ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-gray-100"
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlayerTable;