const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;
const path = require('path');
require('dotenv').config();

// === Middleware ===
app.use(cors({ origin: 'http://localhost:3001' }));
app.use(express.json());

// === In-memory seat initialization ===
const seats = [];
for (let i = 0; i < 11; i++) seats.push(new Array(7).fill(null));
seats.push(new Array(3).fill(null));

// === Utility Functions ===
function formatSeatLayout(seats) {
  return seats.map(row =>
    row.map(seat => (seat === null ? 'O' : 'X'))
  );
}

function bookSeats(desiredSeats, seats, userId) {
  let rowTrack = seats.map(row => row.filter(seat => seat === null).length);

  // Try to book in a single row
  for (let i = 0; i < rowTrack.length; i++) {
    if (rowTrack[i] >= desiredSeats) {
      let count = 0;
      for (let j = 0; j < seats[i].length && count < desiredSeats; j++) {
        if (seats[i][j] === null) {
          seats[i][j] = { bookedBy: userId };
          count++;
        }
      }
      return { bookedRows: [i], seatsBooked: desiredSeats };
    }
  }

  // Try booking across contiguous rows
  let n = rowTrack.length;
  let bestBlock = null;
  let bestSpan = Infinity;

  for (let start = 0; start < n; start++) {
    let sum = 0;
    for (let end = start; end < n; end++) {
      sum += rowTrack[end];
      if (sum >= desiredSeats) {
        let span = end - start + 1;
        if (span < bestSpan) {
          bestSpan = span;
          bestBlock = { start, end };
        }
        break;
      }
    }
  }

  if (!bestBlock) return null;

  let remaining = desiredSeats;
  let bookedRows = [];
  for (let i = bestBlock.start; i <= bestBlock.end && remaining > 0; i++) {
    let bookedInRow = false;
    for (let j = 0; j < seats[i].length && remaining > 0; j++) {
      if (seats[i][j] === null) {
        seats[i][j] = { bookedBy: userId };
        remaining--;
        bookedInRow = true;
      }
    }
    if (bookedInRow) bookedRows.push(i);
  }

  return { bookedRows, seatsBooked: desiredSeats };
}

// === Routes ===
app.get('/api/seats', (req, res) => {
  res.json({ layout: formatSeatLayout(seats) });
});

app.post('/api/seats/book', (req, res) => {
  const { desiredSeats, userId } = req.body;
  console.log(req);

  if (typeof desiredSeats !== 'number' || desiredSeats <= 0 || !userId) {
    return res.status(400).json({ error: "Invalid seat request or missing userId" });
  }

  const result = bookSeats(desiredSeats, seats, userId);
  if (!result) {
    return res.status(400).json({ error: "Not enough seats available" });
  }

  res.json({
    message: `${desiredSeats} seats booked successfully`,
    ...result,
    layout: formatSeatLayout(seats)
  });
});

app.post('/api/seats/cancel', (req, res) => {
  const { userId, seatIds } = req.body;
  if (!userId || !Array.isArray(seatIds)) {
    return res.status(400).json({ error: "User ID and seat numbers required" });
  }

  let cancelled = 0;
  for (const { row, col } of seatIds) {
    if (seats[row] && seats[row][col] && seats[row][col].bookedBy === userId) {
      seats[row][col] = null;
      cancelled++;
    }
  }

  res.json({
    message: `${cancelled} seat(s) cancelled`,
    layout: formatSeatLayout(seats)
  });
});

app.post('/reset', (req, res) => {
  for (let i = 0; i < 11; i++) {
    seats[i] = new Array(7).fill(null);
  }
  seats[11] = new Array(3).fill(null);
  res.json({ message: 'All seats reset', layout: formatSeatLayout(seats) });
});

// === Auth Routes ===
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);  // Mount auth routes correctly

// === Start Server ===
app.listen(PORT, () => {
  console.log(`✅ Train booking server running on http://localhost:${PORT}`);
});
