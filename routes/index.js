const express = require('express');
const router = express.Router();

// Home page
router.get('/', (req, res) => {
    res.render('index', {
        title: 'A.N. Software Services: Your Growth Partner — Not Just Your IT Team',
        description: 'A.N. Software Services delivers personalized IT, AI, and custom software solutions for SMBs. We act as your full-time IT staff — so you can focus on growing your business.',
        keywords: 'custom software development, AI integration, IT support services, SMB IT services, API integration experts, full-time IT team',
        currentPage: 'home'
    });
});

module.exports = router;