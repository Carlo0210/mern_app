// controllers/userController.js

const User = require('../models/User');

const createUser = async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findByCredentials(email, password);
    res.status(200).json(user);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

const logoutUser = async (req, res) => {
  try {
    const { _id } = req.body;
    const user = await User.findById(_id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    // Perform the necessary operations on user here
    await user.save();
    res.status(200).json({ message: 'Successfully logged out' });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const updatedUser = req.body;

    if (updatedUser.password) {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(updatedUser.password, saltRounds);
      updatedUser.password = hashedPassword;
    }

    const user = await User.findByIdAndUpdate(userId, updatedUser, { new: true });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(user);
  } catch (e) {
    res.status(500).json({ error: 'Failed to update user.' });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    await User.findByIdAndDelete(userId);
    res.status(200).json({ message: 'User deleted successfully.' });
  } catch (e) {
    res.status(400).json({ error: 'Failed to delete user.' });
  }
};

module.exports = {
  createUser,
  loginUser,
  logoutUser,
  updateUser,
  deleteUser,
};
