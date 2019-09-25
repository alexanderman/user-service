var express = require('express');
var router = express.Router();
var User = require('../models/__User');

router.post('/register', (req, res) => {
    res.json({ route: 'register' });
});

router.post('/login', (req, res) => {
    res.json({ route: 'login' });
});

router.post('/validate', (req, res) => {
    res.json({ route: 'validate' });
});

module.exports = router;


