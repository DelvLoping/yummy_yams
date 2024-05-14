import React, { useEffect, useRef } from "react";
import Dice from "./Dice";
import _ from "lodash";

interface RollGameProps {
  dices: number[];
  isUserAlreadyRolled: boolean;
  isWon: boolean;
  launch: () => void;
  message: string;
  disabled: boolean;
}

const RollGame: React.FC<RollGameProps> = ({
  dices,
  isUserAlreadyRolled,
  isWon,
  launch,
  message,
  disabled,
}) => {
  const oldDicesRef = useRef<number[]>([]);

  useEffect(() => {
    oldDicesRef.current = dices;
  }, [dices]);

  const dontShuffle = _.isEqual(oldDicesRef.current, dices);

  return (
    <>
      <div className="flex flex-row items-center justify-between w-full px-20 pb-8">
        {dices.map((dice, index) => (
          <Dice key={"dice" + index} value={dice} dontShuffle={dontShuffle} />
        ))}
      </div>
      <div className="actions flex flex-row items-center justify-center">
        <button
          className="flex w-full justify-center rounded-md bg-indigo-600 px-6 py-3 text-lg font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
          onClick={launch}
          disabled={disabled}
        >
          Launch
        </button>
      </div>
      <div className="actions flex flex-row items-center justify-center">
        {(message || isUserAlreadyRolled || isWon) && (
          <p className="text-lg font-semibold text-green-500">
            {isWon
              ? " You already won"
              : isUserAlreadyRolled
              ? "You already played 3 times"
              : message}
          </p>
        )}
      </div>
    </>
  );
};

export default RollGame;
