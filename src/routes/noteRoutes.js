const express = require("express");
const router = express.Router();
const rateLimiter = require("../middlewares/rateLimiter");
const controller = require("../controllers/noteController");

router.post("/", rateLimiter, controller.createNote);
router.get("/", controller.getNotes);
router.put("/:id", controller.updateNote);
router.get("/search", controller.searchNotes);

module.exports = router;
