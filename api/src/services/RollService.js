import Roll from "../models/Roll.js";
import { getEvent } from "./EventService.js";
import { getPastry } from "./PastryService.js";

export const newRoll = async (payload) => {
  const { diceValues, winCombination, pastryWon, event } = payload;
  const newRoll = new Roll({
    diceValues,
    winCombination,
    pastryWon,
    event,
  });
  await newRoll.save();
  return getRoll(newRoll._id);
};

export const getRoll = async (rollId) => {
  const roll = await Roll.findById(rollId);
  roll.pastryWon = await Promise.all(
    roll.pastryWon.map(async (pastryId) => {
      const pastry = await getPastry(pastryId);
      return pastry;
    })
  );
  roll.event = await getEvent(roll.event);
  return roll;
};

export const updateRoll = async (rollId, payload) => {
  const { diceValues, winCombination, pastryWon, event } = payload;
  const roll = await Roll.findById(rollId);
  if (!roll) {
    return null;
  }
  if (diceValues) {
    roll.diceValues = diceValues;
  }
  if (winCombination) {
    roll.winCombination = winCombination;
  }
  if (pastryWon) {
    roll.pastryWon = pastryWon;
  }
  if (event) {
    roll.event = event;
  }
  await roll.save();
  return getRoll(roll._id);
};

export const deleteRoll = async (rollId) => {
  const roll = await Roll.findById(rollId);
  if (!roll) {
    return null;
  }
  await Roll.deleteOne({ _id: rollId });
  return roll;
};
