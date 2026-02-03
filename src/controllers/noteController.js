const Note = require("../models/Note");
const { cleanText, isEmpty } = require("../utils/helpers");

exports.createNote = async (req, res) => {
  let { title, content } = req.body;

  title = cleanText(title);
  content = cleanText(content);

  if (isEmpty(title) || isEmpty(content)) {
    return res.status(400).json({ error: "Invalid input" });
  }

  const note = await Note.create({ title, content });
  res.status(201).json(note);
};

exports.getNotes = async (req, res) => {
  const notes = await Note.find().sort({ updatedAt: -1 });
  res.json(notes);
};

exports.updateNote = async (req, res) => {
  const note = await Note.findById(req.params.id);
  if (!note) return res.status(404).json({ error: "Not found" });

  let updated = false;

  if (req.body.title && req.body.title.trim() !== note.title) {
    note.title = cleanText(req.body.title);
    updated = true;
  }

  if (req.body.content && req.body.content.trim() !== note.content) {
    note.content = cleanText(req.body.content);
    updated = true;
  }

  if (!updated) {
    return res.json({ message: "No changes detected" });
  }

  await note.save();
  res.json(note);
};

exports.searchNotes = async (req, res) => {
  let q = req.query.q;
  if (!q || q.trim() === "") {
    return res.status(400).json({ error: "Empty search query" });
  }

  q = q.trim();

  const notes = await Note.find({
    $or: [
      { title: { $regex: q, $options: "i" } },
      { content: { $regex: q, $options: "i" } }
    ]
  });

  res.json(notes);
};
