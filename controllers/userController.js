const User = require('../models/userModel');
const { errCatch } = require('./utils');

exports.getAllUsers = async (req, res, next) => {
  try {
    const user = await User.find();

    res.status(200).json({
      status: 'success',
      results: user.length,
      data: {
        user,
      },
    });
  } catch (err) {
    errCatch(res, 404, err);
  }
  next();
};

exports.createUser = async (req, res, next) => {
  try {
    const newUser = await User.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        user: newUser,
      },
    });
  } catch (error) {
    errCatch(res, 400, err);
  }
  next();
};
