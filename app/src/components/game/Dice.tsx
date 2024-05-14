import gsap from "gsap";
import React, { useRef, useEffect } from "react";

interface DiceProps {
  value: number;
  dontShuffle?: boolean;
}

const Dice: React.FC<DiceProps> = ({ value, dontShuffle = false }) => {
  const faces: number[] = [
    value,
    ...gsap.utils.shuffle([1, 2, 3, 4, 5, 6].filter((v) => v !== value)),
  ];

  const dice = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!dice.current) return;

    if (dontShuffle) return;
    const ctx = gsap.context(() => {
      gsap.from(dice.current, {
        rotationX: "random(720, 1080)",
        rotationY: "random(720, 1080)",
        rotationZ: 0,
        duration: "random(2, 3)",
      });
    }, dice.current);
    return () => ctx.revert();
  });

  return (
    <div className="dice-container">
      <div className="dice" ref={dice}>
        {faces.map((face, index) => (
          <div key={index} className="face text-black">
            {face}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dice;
