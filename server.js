const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs').promises;

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;
const ROOT_DIR = path.join(__dirname);

app.use('/assets', express.static(path.join(ROOT_DIR, 'assets')));

// safe HTML fetch endpoint: ?file=index.html or file=subdir/page.html
app.get('/html', async (req, res) => {
  const file = String(req.query.file || '').trim();
  if (!file) return res.status(400).json({ error: 'query param "file" required' });

  // disallow absolute paths and traversal
  if (file.includes('..') || path.isAbsolute(file)) {
    return res.status(400).json({ error: 'invalid file path' });
  }

  const resolved = path.join(ROOT_DIR, file);
  if (!resolved.startsWith(ROOT_DIR)) {
    return res.status(400).json({ error: 'invalid file path' });
  }

  try {
    const content = await fs.readFile(resolved, 'utf8');
    res.type('text/html').send(content);
  } catch (err) {
    res.status(404).json({ error: 'file not found', details: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Dev server listening on http://localhost:${PORT}`);
});