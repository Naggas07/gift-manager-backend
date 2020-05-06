const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const SALTFACTOR = 10;

module.exports.create = (req, res, next) => {
  const { name, password, email, userType } = req.body;
  const user = {
    name,
    password,
    email,
    userType,
    avatar: req.file ? req.file.url : null,
  };

  if (user.state === "Unregistered") {
    user.password = user.email;
  }
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
  console.log(req.session.user);
  req.session.destroy();
  res.status(200).json({ message: "session destroyed" });
};

module.exports.updateUser = (req, res, next) => {
  const { id } = req.params;

  const userUpdate = req.body;
  if (req.file) {
    userUpdate.avatar = req.file.url;
  }

  if (req.body.password) {
    bcrypt.genSalt(SALTFACTOR).then((salt) => {
      return bcrypt.hash(req.body.password, salt).then((hash) => {
        userUpdate.password = hash;
        User.findByIdAndUpdate(id, userUpdate, {
          new: true,
          useFindAndModify: false,
        })
          .then((user) => {
            if (!user) {
              res.status(404).json({ message: "User not found" });
            } else {
              user.avatar = req.file ? req.file.url : user.avatar;
              res.status(200).json(user);
            }
          })
          .catch(next);
      });
    });
  } else {
    User.findByIdAndUpdate(id, userUpdate, {
      new: true,
      useFindAndModify: false,
    })
      .then((user) => {
        if (!user) {
          res.status(404).json({ message: "User not found" });
        } else {
          user.avatar = req.file ? req.file.url : user.avatar;
          res.status(200).json(user);
        }
      })
      .catch(next);
  }
};

module.exports.sendValidateToken = (req, res, next) => {
  const { id } = req.params;

  User.findById(id).then((user) => {
    if (!user) {
      res.status(404).json({ message: "User not found" });
    } else {
      if (user.state === "Active") {
        res.status(404).json({ message: "User validated" });
      } else {
        // aqui va como el envio del propio email
        res.status(200).json({ message: "Email send" });
      }
    }
  });
};
