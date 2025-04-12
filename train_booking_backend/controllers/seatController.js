const seatModel = require('../models/seatModel');

exports.getSeats = async (req, res) => {
  const seats = await seatModel.getAllSeats();
  res.json({ layout: seats });
};

exports.book = async (req, res) => {
  const { seatIds } = req.body;
  const res = await seatModel.bookSeats(seatIds, req.user.id);
  console.log(res)
  res.json({ message: 'Seats booked' });
};

exports.cancel = async (req, res) => {
  const { seatIds } = req.body;
  await seatModel.cancelSeats(seatIds, req.user.id);
  res.json({ message: 'Seats cancelled' });
};
