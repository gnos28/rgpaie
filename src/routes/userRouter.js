const express = require("express");
const auth = require("../middlewares/auth");
const UserController = require("../controllers/UserController");

const router = express.Router();

router.get("/", auth, UserController.browse);
router.get("/:id", auth, UserController.read);
router.post("/", auth, UserController.add);
router.put("/:id", auth, UserController.modify);
router.delete("/:id", auth, UserController.delete);

module.exports = router;
