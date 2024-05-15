import Roll from "../models/Roll.js";
import User from "../models/User.js";
import { carre, double, noCombination, yams } from "../constants/rollConst.js";
import Pastry from "../models/Pastry.js";
import Event from "../models/Event.js";
import { getRoll as getRollService } from "../services/RollService.js";
import { getUsers as getUsersService } from "../services/UserService.js";

export const launchRoll = async (req, res) => {
  const { userId } = req.user;
  const { eventId } = req.params;
  try {
    const event = await Event.findById(eventId);
    if (!event) {
      throw new Error("Event not found");
    }
    if (!event.open) {
      res.json({ message: "Event is closed" });
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    const userRolls = await Roll.find({
      _id: { $in: user.rolls },
      event: eventId,
    });
    const userRollsWin = await Roll.find({
      _id: { $in: user.rolls },
      event: eventId,
      pastryWon: { $exists: true, $ne: [] },
    });
    if (userRollsWin.length > 0) {
      res.json({ message: "User already won a pastry on this event" });
      return;
    }
    if (userRolls.length >= 3) {
      res.json({ message: "User has already played 3 times on this event" });
      return;
    }

    const diceValues = [];
    for (let i = 0; i < 5; i++) {
      diceValues.push(Math.floor(Math.random() * 6) + 1);
    }

    let winCombination = noCombination;
    let nbPastryWin = 0;
    if (diceValues.every((val, i, arr) => val === arr[0])) {
      winCombination = yams;
      nbPastryWin = 3;
    } else if (
      diceValues.some((val) => diceValues.filter((v) => v === val).length === 4)
    ) {
      winCombination = carre;
      nbPastryWin = 2;
    } else if (
      diceValues.filter(
        (val) => diceValues.filter((v) => v === val).length === 2
      ).length === 4
    ) {
      winCombination = double;
      nbPastryWin = 1;
    }

    const roll = new Roll({
      diceValues,
      winCombination,
      createdAt: new Date(),
      event: event._id,
    });

    if (winCombination !== "No combination") {
      const pastryAggregation = await Pastry.aggregate([
        {
          $match: {
            $expr: { $lt: ["$quantityWon", "$stock"] },
          },
        },
        { $sample: { size: nbPastryWin } },
      ]);

      if (pastryAggregation.length > 0) {
        await Promise.all(
          pastryAggregation.map(async (pastry) => {
            const { _id } = pastry;
            const pastryObject = await Pastry.findOne({ _id: _id });

            if (pastryObject) {
              roll.pastryWon.push(_id);
              pastryObject.quantityWon += 1;
              await pastryObject.save();
            }
          })
        );
      }
    }
    user.rolls.push(roll);
    await roll.save();
    await user.save();

    const rollEmbedded = await getRollService(roll._id);
    res.json(rollEmbedded);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const checkGame = async (req, res) => {
  const { eventId } = req.params;
  try {
    const event = await Event.findById(eventId);
    if (!event) {
      res.status(404).json({ message: "Event not found" });
      return;
    }
    if (event.open) {
      res.json({ open: true });
      return;
    } else {
      const users = await getUsersService();
      const usersFiltered = users
        .map((user) => {
          const userRolls = user.rolls.filter(
            (roll) => roll.event._id == eventId
          );
          const userRollsWin = userRolls.filter(
            (roll) => roll.pastryWon.length > 0
          );
          if (userRollsWin.length > 0) {
            return {
              _id: user._id,
              username: user.username,
              rolls: userRollsWin,
              role: user.role,
            };
          }

          return null;
        })
        .filter((user) => user !== null);

      res.json(usersFiltered);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
