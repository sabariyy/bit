const express = require('express');
const path = require('path');
const bodyParser = require("body-parser");
const open = require('open');

const app = express();
const __path = process.cwd();
const PORT = process.env.PORT || 8000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

});
app.get('/', (req, res) => {
    res.sendFile(path.join(__path, '/public/vd.html'));
});

// Start the server and open the browser
app.listen(PORT, () => {
    console.log('Server running on http://localhost:' + PORT);
    open('http://localhost:8000');
});

module.exports = app;
