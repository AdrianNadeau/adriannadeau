const express = require('express');
const path = require('path');
const fs = require('fs');
const router = express.Router();

// Route to list available HTML files
router.get('/', (req, res) => {
    const rootDir = path.join(__dirname, '..');
    const publicDir = path.join(__dirname, '..', 'public');
    
    const htmlFiles = [];
    
    // Check root directory
    try {
        const rootFiles = fs.readdirSync(rootDir);
        rootFiles.filter(file => file.endsWith('.html')).forEach(file => {
            htmlFiles.push({
                name: file,
                path: `/html/${file}`,
                location: 'root',
                url: `http://localhost:${process.env.PORT || 3000}/html/${file}`
            });
        });
    } catch (err) {
        console.error('Error reading root directory:', err);
    }
    
    // Check public directory
    if (fs.existsSync(publicDir)) {
        try {
            const publicFiles = fs.readdirSync(publicDir);
            publicFiles.filter(file => file.endsWith('.html')).forEach(file => {
                htmlFiles.push({
                    name: file,
                    path: `/html/${file}`,
                    location: 'public',
                    url: `http://localhost:${process.env.PORT || 3000}/html/${file}`
                });
            });
        } catch (err) {
            console.error('Error reading public directory:', err);
        }
    }
    
    res.json({
        message: 'Available HTML files',
        count: htmlFiles.length,
        files: htmlFiles,
        usage: {
            example: '/html/index.html',
            description: 'Access any HTML file by its filename'
        }
    });
});

// Specific file route with optional extension
router.get('/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = filename.endsWith('.html') ? filename : `${filename}.html`;
    
    serveHtmlFile(filePath, res);
});

// Nested file route (for subdirectories)
router.get('/:folder/:filename', (req, res) => {
    const folder = req.params.folder;
    const filename = req.params.filename;
    const filePath = filename.endsWith('.html') ? `${folder}/${filename}` : `${folder}/${filename}.html`;
    
    serveHtmlFile(filePath, res);
});

// Helper function to serve HTML files
function serveHtmlFile(filePath, res) {
    const possiblePaths = [
        path.join(__dirname, '..', filePath),
        path.join(__dirname, '..', 'public', filePath),
        path.join(__dirname, '..', 'public', 'html', filePath),
        path.join(__dirname, '..', 'views', filePath)
    ];
    
    let foundPath = null;
    
    for (const checkPath of possiblePaths) {
        if (fs.existsSync(checkPath)) {
            foundPath = checkPath;
            break;
        }
    }
    
    if (foundPath) {
        fs.readFile(foundPath, 'utf8', (err, data) => {
            if (err) {
                return res.status(500).json({ 
                    error: 'Failed to load HTML file',
                    filepath: filePath 
                });
            }
            
            // Process HTML content
            let processedHtml = data;
            processedHtml = processedHtml.replace(/src="\.\/assets\//g, 'src="/assets/');
            processedHtml = processedHtml.replace(/href="\.\/assets\//g, 'href="/assets/');
            processedHtml = processedHtml.replace(/src="assets\//g, 'src="/assets/');
            processedHtml = processedHtml.replace(/href="assets\//g, 'href="/assets/');
            
            res.setHeader('Content-Type', 'text/html');
            res.send(processedHtml);
        });
    } else {
        res.status(404).json({ 
            error: 'HTML file not found',
            filepath: filePath,
            searchedPaths: possiblePaths
        });
    }
}

module.exports = router;