const router = require('express').Router();
const auth = require('../middleware/authMiddleware');
const { getSeats, book, cancel } = require('../controllers/seatController');

router.get('/', auth, getSeats);
router.post('/book', auth, book);
router.post('/cancel', auth, cancel);

module.exports = router;
