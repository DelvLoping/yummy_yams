import Pastry from "../models/Pastry.js";

export const newPastry = async (payload) => {
  const { name, image, stock, quantityWon } = payload;
  const newPastry = new Pastry({
    name,
    image,
    stock,
    quantityWon,
  });
  await newPastry.save();
  return getPastry(newPastry._id);
};

export const getPastry = async (pastryId) => {
  const pastry = await Pastry.findById(pastryId);
  return pastry;
};

export const updatePastry = async (pastryId, payload) => {
  const { name, image, stock, quantityWon } = payload;
  const pastry = await Pastry.findById(pastryId);
  if (!pastry) {
    return null;
  }
  if (name) {
    pastry.name = name;
  }
  if (image) {
    pastry.image = image;
  }
  if (stock) {
    pastry.stock = stock;
  }
  if (quantityWon) {
    pastry.quantityWon = quantityWon;
  }
  await pastry.save();
  return getPastry(pastry._id);
};

export const deletePastry = async (pastryId) => {
  const pastry = await Pastry.findById(pastryId);
  if (!pastry) {
    return null;
  }
  await Pastry.deleteOne({ _id: pastryId });
  return pastry;
};
