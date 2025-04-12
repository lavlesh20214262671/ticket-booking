const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');
require('dotenv').config();

exports.signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    await userModel.createUser(username, email, hashed);
    res.json({ message: 'Signup successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Signup failed' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await userModel.findUserByEmail(email);
  console.log(user);
  if (!user) return res.status(401).json({ error: 'User not found' });

  const valid = await bcrypt.compare(password, user.password);
  console.log(valid);
  if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
  res.json({ token });
};
