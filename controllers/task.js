const mongoose = require('mongoose');
const userModel = require('../models/task');

const filterParams = (params, whitelist) => {
    const filtered = {};
    for (const key in params) {
        if (whitelist.indexOf(key) > -1) {
            filtered[key] = params[key];
        }
    }
    return filtered;
}
const  whitelist = [
  'name'
];

const User = mongoose.model('User');
const Task = mongoose.model('Task');
 module.exports = {
 createTask : async (req, res, next) => {
    // filter data from body
    const data = filterParams(req.body, whitelist);
    try {
      const user = await User.findById({ _id: req.user.id });
      if (!user) {
        return res.status(404).json({ msg: Constants.messages.userNotFound });
      }
      data['user'] = req.user.id;
      const task = new Task({
        ...data,
      });
      await task.save();
      const taskObj = {
        id: task._id,
        name: task.name,
      };
      res.status(200).json({ msg: 'success!', task: taskObj });
    } catch (err) {
      next(err);
    }
  },

  listTasks : async (req, res, next) => {
    try {
      const user = await User.findById({ _id: req.user.id });
      if (!user) {
        return res.status(404).json({ msg: Constants.messages.userNotFound });
      }
      const tasks = await Task.find({ user: req.user.id }).select('_id name');
      if (!tasks) {
        return res.status(404).json({ msg: Constants.messages.taskNotFound });
      }
      res.status(200).json({ msg: 'success', tasks });
    } catch (err) {
        next(err);
    }
    } }
