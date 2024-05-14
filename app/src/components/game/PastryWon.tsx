import React from "react";
import { IPastry } from "../../redux/types";
import { IMAGE_LISTE } from "../../utils/game";

interface PastryWonProps {
  pastryWon: IPastry[];
}

const PastryWon: React.FC<PastryWonProps> = ({ pastryWon }) => {
  return (
    <>
      <div className="flex flex-row items-center justify-center w-full mb-6">
        <h1 className="text-xl font-bold">Pastry Won</h1>
      </div>
      <div className="flex flex-row  items-start justify-start flex-wrap gap-4">
        {pastryWon.map((pastry: IPastry, index: number) => {
          const { image, name } = pastry;
          const img = IMAGE_LISTE[image];
          return (
            <div
              key={index}
              className="flex flex-col items-center justify-between w-40 p-4 bg-white/10 rounded-lg shadow-lg"
            >
              <img src={img} alt={name} className="w-full mb-4" />
              <p className="text-sm font-semibold">{name}</p>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default PastryWon;
