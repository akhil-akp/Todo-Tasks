const multer = require('multer');
const sharp = require('sharp');
const TodoTask = require('../models/todoTaskModel');
const { errCatch, arraySanitize } = require('./utils');

exports.getAllTodoTasks = async (req, res, next) => {
  try {
    let query = TodoTask.find(req.query);

    //Sorting todo tasks by target date
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('targetDate');
    }

    //Pagination if the task more than 20
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 20;
    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);

    const todoTask = await query;

    res.status(200).json({
      status: 'success',
      results: todoTask.length,
      data: {
        todoTask,
      },
    });
  } catch (err) {
    errCatch(res, 404, err);
  }
};

exports.createTodoTask = async (req, res, next) => {
  try {
    const newTodoTask = await TodoTask.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        todoTask: newTodoTask,
      },
    });
  } catch (err) {
    errCatch(res, 400, err);
  }
};

//Uploading the image during update the todo task
const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadTodoTaskImage = upload.single('image');

exports.resizeUplodedImage = async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `todoTask-${req.params.id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/images/todoTaskImages/${req.file.filename}`);

  next();
};

exports.updateTodoTask = async (req, res, next) => {
  try {
    if (req.file) req.body.image = req.file.filename;

    const todoTask = await TodoTask.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: 'success',
      data: {
        todoTask,
      },
    });
  } catch (err) {
    errCatch(res, 400, err);
  }
};

exports.deleteTodoTask = async (req, res, next) => {
  try {
    const todoTask = await TodoTask.findByIdAndDelete(req.params?.id);

    if (todoTask) {
      res.status(204).json({
        status: 'success',
        data: {
          todoTask: null,
        },
      });
    } else {
      res.status(404).json({
        status: 'fail',
        message: 'Id is not found!',
      });
    }
  } catch (err) {
    errCatch(res, 400, err);
  }
};

exports.getAllTodoTasksByTitle = async (req, res, next) => {
  try {
    let title = req.params.title;
    const todoTask = await TodoTask.find({ title: new RegExp(title, 'i') });

    res.status(200).json({
      status: 'success',
      data: {
        todoTask,
      },
    });
  } catch (err) {
    errCatch(res, 404, err);
  }
};

exports.deleteMultipleTasks = (req, res, next) => {
  try {
    let taskIds = req.body.id;

    const todoResult = taskIds.map(async (taskId, index) => await TodoTask.findByIdAndDelete({ _id: taskId }));
    Promise.all(todoResult)
      .then((response) => {
        const cleanArr = arraySanitize(response);
        if (cleanArr.length > 0) {
          res.status(200).json({
            status: 'success',
            data: {
              message: `Successfully deleted  ${taskIds.length} tasks`,
            },
          });
        } else {
          res.status(404).json({
            status: 'fail',
            message: 'Ids are not found!',
          });
        }
      })
      .catch((error) => {
        errCatch(res, 400, error);
      });
  } catch (err) {
    errCatch(res, 400, err);
  }
};
