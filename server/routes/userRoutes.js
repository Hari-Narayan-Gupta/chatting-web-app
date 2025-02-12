const express = require("express");
const { registerUser, getAllUsers, loginUser } = require("../controllers/userController");
const router = express.Router();

router.post("/register", registerUser);
router.get("/all", getAllUsers);
router.post("/login", loginUser);

module.exports = router;
