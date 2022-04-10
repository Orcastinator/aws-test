
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const path = require('path');

const app = express();

// SETTINGS
app.set('PORT', 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');

// MIDDLEWARES
app.use(cors());
app.use(express.json());

// ROUTES
app.use(require('./routes/'));

// STATIC FILES
app.use(express.static(path.join(__dirname, 'public')));

app.listen(app.get('PORT'), () => {
    console.log("Server on "+app.get('PORT'));
});