const express = require("express");
const auth = require("../middlewares/auth");
const RealController = require("../controllers/RealController");

const router = express.Router();

router.get("/", auth, RealController.browse);
router.get("/:id", auth, RealController.read);
router.post("/", auth, RealController.add);
router.put("/:id", auth, RealController.modify);
router.delete("/:id", auth, RealController.delete);

module.exports = router;
