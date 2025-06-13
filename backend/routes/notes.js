const express = require('express');
const { notesByUser, tagsByUser } = require('../models/notes');

const router = express.Router();

router.get('/:email', (req, res) => {
    const email = req.params.email;
    const notes = notesByUser[email] || [];
    res.json(notes);
});

router.post('/', (req, res) => {
    const { email, title, content, tags } = req.body;

    if (!notesByUser[email]) notesByUser[email] = [];

    const now = new Date().toISOString();
    const newNote = {
        id: Date.now(),
        title,
        content,
        tags,
        createdAt: now,
        updatedAt: now,
    };


    notesByUser[email].push(newNote);
    res.json(newNote);
});

router.put('/:email/:id', (req, res) => {
    const { email, id } = req.params;
    const { title, content, tags } = req.body;

    const notes = notesByUser[email] || [];
    const note = notes.find(n => n.id == id);

    if (!note) return res.status(404).json({ message: 'Note not found' });

    note.title = title;
    note.content = content;
    note.tags = tags;
    note.updatedAt = new Date().toISOString();

    res.json(note);
});

router.delete('/:email/:id', (req, res) => {
    const { email, id } = req.params;

    notesByUser[email] = (notesByUser[email] || []).filter(n => n.id != id);
    res.json({ message: 'Deleted' });
});

// Get all tags for user
router.get('/:email/tags', (req, res) => {
    const email = req.params.email;
    res.json(tagsByUser[email] || []);
});

// Add new tag for user
router.post('/:email/tags', (req, res) => {
    const email = req.params.email;
    const { tag } = req.body;

    if (!tagsByUser[email]) tagsByUser[email] = [];

    if (!tagsByUser[email].includes(tag)) {
        tagsByUser[email].push(tag);
    }

    res.json({ success: true });
});


module.exports = router;
