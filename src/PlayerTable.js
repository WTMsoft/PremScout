import React, { useState } from "react";

const PlayerTable = ({ players, onPlayerClick }) => {
  const [filter, setFilter] = useState("");
  const [positionFilter, setPositionFilter] = useState("");
  const [teamFilter, setTeamFilter] = useState("");
  const [priceRange, setPriceRange] = useState([0, 200]); // Adjusted maximum price range
  const [sortField, setSortField] = useState(null);
  const [decending, setDecending] = useState(true);
  const [currentPage, setCurrentPage] = useState(1); // Track current page

  const playersPerPage = 20;
  console.log(players);

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

  console.log(
    "Predicted Points Data:",
    players.map((p) => p.predicted_points)
  );

  // Sorting logic
  const sortedPlayers = [...filteredPlayers].sort((a, b) => {
    if (!sortField) return 0; // If no sort field is selected, do not sort

    let aValue = a[sortField];
    let bValue = b[sortField];

    // Handle undefined values
    if (aValue === undefined) aValue = "";
    if (bValue === undefined) bValue = "";

    // Convert numeric fields to numbers
    if (typeof aValue === "string" && !isNaN(aValue)) {
      aValue = parseFloat(aValue);
    }
    if (typeof bValue === "string" && !isNaN(bValue)) {
      bValue = parseFloat(bValue);
    }

    // Ensure numeric fields like predicted_points and expected_goals are numbers
    if (sortField === "predicted_points" || sortField === "expected_goals") {
      aValue = Math.round(aValue * 10) / 10; // Default to 0 if invalid or undefined
      bValue = Math.round(bValue * 10) / 10; // Default to 0 if invalid or undefined
    }

    // Handle case-insensitive string comparison for string fields
    if (typeof aValue === "string" && typeof bValue === "string") {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }

    // Sort based on ascending or descending order
    if (decending) {
      return aValue < bValue ? 1 : -1;
    } else {
      return aValue > bValue ? 1 : -1;
    }
  });

  // Paginated results
  const totalPages = Math.ceil(sortedPlayers.length / playersPerPage);
  const startIndex = (currentPage - 1) * playersPerPage;
  const paginatedPlayers = sortedPlayers.slice(
    startIndex,
    startIndex + playersPerPage
  );

  const toggleSort = (field) => {
    if (sortField === field) {
      setDecending(!decending); // Toggle order if the same field is clicked
    } else {
      setSortField(field); // Set new sort field
      setDecending(true); // Default to descending for new field
    }
  };

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
            setDecending(true);
            setCurrentPage(1); // Reset to the first page
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
                { field: "team", label: "Team" },
                { field: "position", label: "Position" },
                { field: "total_points", label: "Total Points" },
                { field: "now_cost", label: "Price" },
                { field: "goals_scored", label: "Goals" },
                { field: "assists", label: "Assists" },
                { field: "clean_sheets", label: "Clean Sheets" },
                { field: "saves_per_90", label: "Saves Per 90" },
                { field: "form", label: "Form" },
                { field: "predicted_points", label: "Projected Points" },
                { field: "expected_goals", label: "Expected Goals" },
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
                className={`border ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                }`}
              >
                <td
                  className="p-3 text-blue-500 cursor-pointer underline"
                  onClick={() => onPlayerClick(player)}
                >
                  {player.name}
                </td>
                <td className="p-3">{player.team}</td>
                <td className="p-3">{player.position}</td>
                <td className="p-3">{player.total_points}</td>
                <td className="p-3">${(player.now_cost / 10).toFixed(1)}M</td>
                <td className="p-3">{player.goals_scored}</td>
                <td className="p-3">{player.assists}</td>
                <td className="p-3">{player.clean_sheets}</td>
                <td className="p-3">{player.saves_per_90}</td>
                <td className="p-3">{player.form}</td>
                <td className="p-3">
                  {player.predicted_points !== undefined &&
                  player.predicted_points !== null
                    ? Math.round(player.predicted_points * 10) / 10
                    : "0.0"}
                </td>

                <td className="p-3">
                  {player.expected_goals !== undefined
                    ? parseFloat(player.expected_goals).toFixed(1)
                    : "0.0"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className={`p-2 rounded ${
            currentPage === 1
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600 text-white"
          }`}
        >
          Previous
        </button>
        <p>
          Page {currentPage} of {totalPages}
        </p>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className={`p-2 rounded ${
            currentPage === totalPages
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600 text-white"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PlayerTable;
