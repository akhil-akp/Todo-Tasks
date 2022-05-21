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
  .delete(todoTaskController.deleteTodoTasks); //This route can delete single and multiple tasks

router.get('/:title', todoTaskController.getTodoTasksByTitle);

//This route for delete mutilple tasks by putting ids in obdy
router.delete('/', todoTaskController.deleteMultipleTasks);

module.exports = router;
