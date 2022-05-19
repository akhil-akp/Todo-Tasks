const User = require('../models/userModel');

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
  } catch (error) {
    console.log(error);
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
    console.log(error);
  }
  next();
};
