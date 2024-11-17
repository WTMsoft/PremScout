import React from "react";

const PlayerCard = ({ player, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-8 w-[900px] relative flex">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-black text-2xl"
        >
          &#x2715;
        </button>

        {/* Player Image */}
        <div className="w-1/3 flex items-center justify-center">
          <img
            src={player.image} // Assuming `player.image` contains the scraped URL
            alt={player.name}
            className="w-64 h-64 object-cover rounded-full border-4 border-gray-300"
          />
        </div>

        {/* Player Info */}
        <div className="w-2/3 ml-8">
          {/* Team and Name */}
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-purple-700">
              {player.team}
            </h2>
            <h1 className="text-4xl font-extrabold">{player.name}</h1>
            <p className="text-xl text-gray-500 mt-2">{player.position}</p>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 gap-6 mt-6">
            {/* Points and Price */}
            <div className="text-center">
              <p className="text-gray-500 text-lg">Total Points</p>
              <p className="text-2xl font-bold">{player.total_points}</p>
            </div>
            <div className="text-center">
              <p className="text-gray-500 text-lg">Price</p>
              <p className="text-2xl font-bold">
                ${(player.now_cost / 10).toFixed(1)}M
              </p>
            </div>

            {/* Goals and Assists */}
            <div className="text-center">
              <p className="text-gray-500 text-lg">Goals</p>
              <p className="text-2xl font-bold">{player.goals_scored}</p>
            </div>
            <div className="text-center">
              <p className="text-gray-500 text-lg">Assists</p>
              <p className="text-2xl font-bold">{player.assists}</p>
            </div>

            {/* Yellow Cards and Red Cards */}
            <div className="text-center">
              <p className="text-gray-500 text-lg">Yellow Cards</p>
              <p className="text-2xl font-bold">{player.yellow_cards}</p>
            </div>
            <div className="text-center">
              <p className="text-gray-500 text-lg">Red Cards</p>
              <p className="text-2xl font-bold">{player.red_cards}</p>
            </div>

            {/* Minutes Played and Form */}
            <div className="text-center">
              <p className="text-gray-500 text-lg">Minutes Played</p>
              <p className="text-2xl font-bold">{player.minutes}</p>
            </div>
            <div className="text-center">
              <p className="text-gray-500 text-lg">Form</p>
              <p className="text-2xl font-bold">{player.form}</p>
            </div>
          </div>

          {/* Value Section */}
          <div className="mt-8 text-center">
            <p className="text-gray-500 text-lg">Value</p>
            <div className="text-yellow-500 text-3xl">
              {"★".repeat(player.value)}
              {"☆".repeat(5 - player.value)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerCard;
