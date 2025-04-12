const pool = require('./db');

exports.getAllSeats = async () => {
  const result = await pool.query('SELECT * FROM seats ORDER BY id');
  console.log(result);
  return result.rows;
};

exports.bookSeats = async (seatIds, userId) => {
  const query = 'UPDATE seats SET is_booked = TRUE, user_id = $1 WHERE id = ANY($2::int[])';
  console.log(query)
  return pool.query(query, [userId, seatIds]);
};

exports.cancelSeats = async (seatIds, userId) => {
  const query = 'UPDATE seats SET is_booked = FALSE, user_id = NULL WHERE id = ANY($1::int[]) AND user_id = $2';
  console.log(query)
  return pool.query(query, [seatIds, userId]);
};