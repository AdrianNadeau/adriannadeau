const express = require('express');
const path = require('path');
const fs = require('fs');
const expressLayouts = require('express-ejs-layouts');

const app = express();
const PORT = process.env.PORT || 3000;

// Set EJS as templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Use express-ejs-layouts
app.use(expressLayouts);
app.set('layout', 'layouts/layout'); // Changed from 'layouts/main' to 'layouts/layout'

// Static files middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Body parser middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
app.use('/', require('./routes/index'));
app.use('/html', require('./routes/html'));

// Alternative HTML middleware (for direct .html access)
app.use((req, res, next) => {
    if (req.path.endsWith('.html')) {
        const fileName = req.path;
        const filePath = path.join(__dirname, fileName);
        
        if (fs.existsSync(filePath)) {
            fs.readFile(filePath, 'utf8', (err, data) => {
                if (err) return next();
                
                let processedHtml = data;
                processedHtml = processedHtml.replace(/src="\.\/assets\//g, 'src="/assets/');
                processedHtml = processedHtml.replace(/href="\.\/assets\//g, 'href="/assets/');
                
                res.setHeader('Content-Type', 'text/html');
                res.send(processedHtml);
            });
        } else {
            next();
        }
    } else {
        next();
    }
});

// 404 handler
app.use((req, res) => {
    res.status(404).render('404', {
        title: 'Page Not Found - A.N. Software Services',
        description: 'The page you are looking for was not found.',
        currentPage: '404'
        // Remove the "layout: false" line to use the default layout
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Server Error',
        message: err.message
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📄 EJS pages available at http://localhost:${PORT}/`);
    console.log(`📄 HTML files available at http://localhost:${PORT}/html/`);
});