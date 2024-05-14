import Roll from "../models/Roll.js";
import User from "../models/User.js";
import { carre, double, noCombination, yams } from "../constants/rollConst.js";
import Pastry from "../models/Pastry.js";
import Event from "../models/Event.js";
import { getRoll as getRollService } from "../services/RollService.js";

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

    const uniqueValues = new Set(diceValues);
    if (uniqueValues.size === 1) {
      winCombination = yams;
    } else {
      const counts = {};
      for (const value of diceValues) {
        counts[value] = counts[value] ? counts[value] + 1 : 1;
      }
      const maxCount = Math.max(...Object.values(counts));

      if (maxCount === 4) {
        winCombination = carre;
      } else if (maxCount === 2 && Object.keys(counts).length === 3) {
        winCombination = double;
      }
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
        { $sample: { size: 1 } },
      ]);

      // Extraire l'ID de la pâtisserie de l'agrégation
      const pastryId =
        pastryAggregation.length > 0 ? pastryAggregation[0]._id : null;

      // Rechercher la pâtisserie par son ID
      const pastry = await Pastry.findOne({ _id: pastryId });

      if (pastry) {
        const pastryId = pastry._id;
        roll.pastryWon = pastryId;
        pastry.quantityWon += 1;
        await pastry.save();
      } else {
        event.open = false;
        event.closedAt = new Date();
        await event.save();
        res.json({ message: "Event is closed" });
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
