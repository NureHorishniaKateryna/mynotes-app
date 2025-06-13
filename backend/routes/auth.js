const express = require('express');
const { users } = require('../models/users');

const router = express.Router();

router.post('/register', (req, res) => {
    const { email, password, username } = req.body;

    if (users.find(u => u.email === email)) {
        return res.status(400).json({ message: 'User already exists' });
    }

    users.push({ email, password, username });
    res.json({ message: 'Registered successfully' });
});

router.post('/login', (req, res) => {
    const { email, password } = req.body;

    const user = users.find(u => u.email === email && u.password === password);
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    res.json({ message: 'Login successful', user });
});

module.exports = router;
