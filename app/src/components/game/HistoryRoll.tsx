import React from "react";
import { IPastry, IRoll } from "../../redux/types";

interface HistoryRollProps {
  rolls: IRoll[];
}

const HistoryRoll: React.FC<HistoryRollProps> = ({ rolls }) => {
  return (
    <div className="bg-blue-500/10 w-full p-8 rounded-lg ">
      <ol className="relative ">
        {rolls.map((roll: IRoll, index: number) => {
          const { diceValues, pastryWon, winCombination } = roll;
          const pastriesWin: string = pastryWon
            .map((pastry: IPastry) => pastry.name)
            .join(", ");
          return (
            <li
              className={`ms-4 ${index === rolls.length ? "mb-10" : ""}`}
              key={index}
            >
              <div className="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -start-1.5 border border-white dark:border-gray-900 dark:bg-gray-700"></div>
              <time className="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
                {diceValues.join(" - ")}
              </time>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {winCombination}
              </h3>
              <p className="mb-4 text-base font-normal text-gray-500 dark:text-gray-400">
                {pastryWon.length > 0 ? "You won : " + pastriesWin : "You lost"}
              </p>
            </li>
          );
        })}
      </ol>
    </div>
  );
};
export default HistoryRoll;
