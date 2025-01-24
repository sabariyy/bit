const express = require('express');
const path = require('path');
const open = require('open');

const app = express();
const PORT = process.env.PORT || 8000;

// Define the path to the directory containing vd.html
const __path = process.cwd();

// Route to serve vd.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__path, 'vd.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    open(`http://localhost:${PORT}`); // Automatically open in default browser
});
