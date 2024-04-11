import Roll from "../models/Roll.js";
import User from "../models/User.js";
import { carre, double, yams } from "../constants/rollConst.js";
import Pastries from "../models/Pastries.js";
import Event from "../models/Event.js";
import { currentEvent } from "../constants/eventConst.js";

export const launchRoll = async (req, res) => {
    const { userId } = req.user;
    try {
        const event = await Event.findOne({ name: currentEvent })
        if (!event.open) {
            res.json({ message: "Event is closed" });
            return;
        }
        const diceValues = [];
        for (let i = 0; i < 5; i++) {
            diceValues.push(Math.floor(Math.random() * 6) + 1);
        }

        let winCombination = "No combination";

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

        const user = await User.findById(userId);
        if (!user) {
            throw new Error("User not found");
        }

        const roll = new Roll({
            diceValues,
            winCombination,
            createdAt: new Date(),
            event: event._id
        });


        if (winCombination !== "No combination") {
            const pastryAggregation = await Pastries.aggregate([
                {
                    $match: {
                        $expr: { $lt: ["$quantityWon", "$stock"] }
                    }
                },
                { $sample: { size: 1 } }
            ]);

            // Extraire l'ID de la pâtisserie de l'agrégation
            const pastryId = pastryAggregation.length > 0 ? pastryAggregation[0]._id : null;

            // Rechercher la pâtisserie par son ID
            const pastry = await Pastries.findOne({ _id: pastryId });

            if (pastry) {
                const pastryId = pastry._id;
                roll.pastryWon = pastryId;
                await roll.save();

                user.rolls.push(roll);
                await user.save();

                pastry.quantityWon += 1;
                await pastry.save();

                user.pastriesWon.push(pastry);
                await user.save();
            } else {
                event.open = false;
                event.closedAt = new Date();
                await event.save();
                res.json({ message: "Event is closed" });
            }
        }

        res.json(roll);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}