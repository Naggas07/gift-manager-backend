const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");

//midlewares

const upload = require("../config/cloudinary.config");

//routes

router.post("/register", upload.single("avatar"), userController.create);
router.post("/login", userController.login);
router.post("/logout", userController.logout);
router.put("/update/:id", upload.single("avatar"), userController.updateUser);

module.exports = router;
