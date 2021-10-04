const authenticate = require('../middleware/authenticate');

const express = require('express');
const { Router } = express;
const userController = require('../controllers/users');
const taskController = require('../controllers/task');
// user route

const router = new Router();

console.info ( '-->', router );

router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/user', authenticate, userController.getUser);

// Task Routes
router.post('/create-task', authenticate, taskController.createTask);
router.get('/list-tasks', authenticate, taskController.listTasks);

module.exports = router;