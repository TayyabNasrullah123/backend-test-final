const mongoose = require('mongoose');
const userModel = require('../models/users');
const bcrypt = require("bcryptjs");
var jwt = require('jsonwebtoken');

const  whitelist = [
    'email',
    'password',
  ];
  const filterParams = (params, whitelist) => {
    const filtered = {};
    for (const key in params) {
        if (whitelist.indexOf(key) > -1) {
            filtered[key] = params[key];
        }
    }
    return filtered;
}
const User = mongoose.model('User');


module.exports = {
  getUser : async (req, res, next) => {
	  try {
	    const user = await User.findById({ _id: req.user.id }).select('_id email');
	    if (!user) {
	      return res.status(404).json({ msg: 'User Not Found!' });
	    }
	    const userObj = {
	      id: user._id,
	      email: user.email,
	    };
	    return res.status(200).json({ msg: 'success!', user: userObj });
	  } catch (err) {
	    err.status = 400;
	    next(err);
	  }
	},
 register : async (req, res, next) => {
    // filter data from body
    console.info ( '-->',  req.body );
    const data = filterParams(req.body, whitelist);

    console.info ( data );

    try {
      // See if user exist
      let user = await User.findOne({ email: data['email'] });

      console.info ( user );
      if (user) {
        return res.status(400).json({ msg: 'User Already Exist!' });
      }
      user = new User({
        ...data,
      });
      // Encrypt password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(data['password'], salt);
      await user.save();
      const userObj = {
        id: user._id,
        email: user.email,
      };
      res.status(200).json({ msg: 'success!', user: userObj });
    } catch (err) {
      err.status = 400;
      next(err);
    }
  },
login : async (req, res, next) => {
    // filter data from body
    const data = filterParams(req.body, whitelist);
    try {
      // See if user exist
      const user = await User.findOne({ email: data['email'] });
      if (!user) {
        return res.status(400).json({ msg: 'Invalid Credentials'});
      }
      // match incoming user password
      const isMatch = await bcrypt.compare(data['password'], user.password);
      if (!isMatch) {
        return res.status(400).json({ msg: 'Invalid Credentials' });
      }
      // Return jsonwebtoken
      const payload = {
        user: {
          id: user.id,
          email: user.email,
        },
      };
      jwt.sign(payload, 'i-am-the-secret-key-of-coding-exercise', { expiresIn: '365d' }, (err, token) => {
        if (err) throw err;
        res.status(200).json({ msg: 'success!', jwt: token });
      });
    } catch (error) {
      error.status = 400;
      next(error);
    }
  }
}
