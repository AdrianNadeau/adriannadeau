const express = require('express');
const path = require('path');
const fs = require('fs');
const router = express.Router();

// File manager route to handle any file type
router.get('/serve/:filepath(*)', (req, res) => {
    const filePath = req.params.filepath;
    const fullPath = path.join(__dirname, '..', filePath);
    
    // Security check - prevent directory traversal
    if (filePath.includes('..') || filePath.includes('~')) {
        return res.status(403).json({ error: 'Access denied' });
    }
    
    // Check if file exists
    if (!fs.existsSync(fullPath)) {
        return res.status(404).json({ 
            error: 'File not found',
            filepath: filePath,
            fullPath: fullPath
        });
    }
    
    // Get file stats
    const stats = fs.statSync(fullPath);
    
    if (stats.isDirectory()) {
        // List directory contents
        const files = fs.readdirSync(fullPath);
        return res.json({
            type: 'directory',
            path: filePath,
            contents: files.map(file => {
                const fileStats = fs.statSync(path.join(fullPath, file));
                return {
                    name: file,
                    type: fileStats.isDirectory() ? 'directory' : 'file',
                    size: fileStats.size,
                    modified: fileStats.mtime
                };
            })
        });
    }
    
    // Serve the file
    const ext = path.extname(fullPath).toLowerCase();
    const contentTypes = {
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'application/javascript',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.pdf': 'application/pdf',
        '.txt': 'text/plain'
    };
    
    const contentType = contentTypes[ext] || 'application/octet-stream';
    res.setHeader('Content-Type', contentType);
    
    // For HTML files, process relative paths
    if (ext === '.html') {
        fs.readFile(fullPath, 'utf8', (err, data) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to read file' });
            }
            
            // Fix relative paths
            let processedHtml = data;
            processedHtml = processedHtml.replace(/src="\.\/assets\//g, 'src="/assets/');
            processedHtml = processedHtml.replace(/href="\.\/assets\//g, 'href="/assets/');
            
            res.send(processedHtml);
        });
    } else {
        // For other files, send directly
        res.sendFile(fullPath);
    }
});

module.exports = router;