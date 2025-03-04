import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="flex flex-col items-center">
      <h1 className="text-4xl mt-2 font-bold text-center text-blue-600 flex">
        Basic TanStack Learning project
      </h1>
      <div className="flex space-between gap-10 items-center mt-4">
        <Link to="/">
          <div className="flex bg-pink-300 p-2 font-bold rounded-md text-gray-700">
            Home Page
          </div>
        </Link>
        <Link to="/product">
          <div className="flex bg-pink-300 p-2 font-bold rounded-md text-gray-700">
            Paginated Queries
          </div>
        </Link>
        <Link to="/parallel">
          <div className="flex bg-pink-300 p-2 font-bold rounded-md text-gray-700">
            Parallel Query
          </div>
        </Link>
        <Link to="/optimistic">
          <div className="flex bg-pink-300 p-2 font-bold rounded-md text-gray-700">
            Optimistic Update
          </div>
        </Link>
        <Link to="/dependent">
          <div className="flex bg-pink-300 p-2 font-bold rounded-md text-gray-700">
            Dependent Query
          </div>
        </Link>
      </div>
    </div>
  );
}

export default Home;
