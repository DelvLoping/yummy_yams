// views/HomeView.tsx
import React from "react";
import { Link } from "react-router-dom";
import bananaSplit from "../assets/banana-split.jpeg";

const HomeView: React.FC = () => {
  return (
    <div className="flex px-10 flex-col items-center justify-center min-h-full flex-1 py-12 ">
      <h1 className="text-3xl font-bold mb-10">Welcome on Yummy-Yams</h1>

      <img src={bananaSplit} alt="logo" className=" w-48 mb-20 rounded-lg " />
      <div className="space-x-4">
        <Link
          to="/auth/login"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Sign in
        </Link>
        <Link
          to="/auth/register"
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Sign up
        </Link>
      </div>
    </div>
  );
};

export default HomeView;
