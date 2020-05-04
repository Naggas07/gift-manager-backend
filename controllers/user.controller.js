const mongoose = require("mongoose");
const User = require("../models/user.model");

module.exports.create = (req, res, next) => {
  const { name, password, email, userType } = req.body;
  const user = {
    name,
    password,
    email,
    userType,
    avatar: req.file ? req.file.url : null,
  };

  User.create(user)
    .then((user) => {
      res.status(201).json(user);
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "email and password required" });
  }

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        res.status(404).json({ message: "User not found" });
      } else {
        return user.comparePassword(password).then((match) => {
          if (match) {
            req.session.user = user;
            res.status(200).json(user);
          } else {
            res.status(404).json({ message: "User not found" });
          }
        });
      }
    })
    .catch(next);
};

module.exports.logout = (req, res) => {
  req.session.destroy();
  res.status(204).json({ message: "session destroyed" });
};

module.exports.updateUser = (req, res, next) => {
  const { id } = req.params;
  if (id != req.session.user.id && req.session.user.userType != "Admin") {
    res.status(403).json({ message: "Forbidden" });
  }

  const userUpdate = req.body;
  console.log(req.file);
  if (req.file) {
    userUpdate.avatar = req.file.url;
  }

  User.findByIdAndUpdate(id, userUpdate, { new: true })
    .then((user) => {
      if (!user) {
        res.status(404).json({ message: "User not found" });
      } else {
        user.avatar = req.file ? req.file.url : user.avatar;
        res.status(200).json(user);
      }
    })
    .catch(next);
};
