const express = require('express');

const todoTaskController = require('../controllers/todoTaskController');

const router = express.Router();

router.route('/').get(todoTaskController.getAllTodoTasks).post(todoTaskController.createTodoTask);

router
  .route('/:id')
  .patch(
    todoTaskController.uploadTodoTaskImage,
    todoTaskController.resizeUplodedImage,
    todoTaskController.updateTodoTask
  )
  .delete(todoTaskController.deleteTodoTask);

router.get('/:title', todoTaskController.getAllTodoTasksByTitle);

router.delete('/', todoTaskController.deleteMultipleTasks);

module.exports = router;
