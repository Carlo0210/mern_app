// routes/userRoutes.js

const express = require('express');
const {
  createUser,
  loginUser,
  logoutUser,
  updateUser,
  deleteUser,
} = require('../controllers/userController');

const router = express.Router();

router.post('/signup', createUser);
router.post('/login', loginUser);
router.delete('/logout', logoutUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;
