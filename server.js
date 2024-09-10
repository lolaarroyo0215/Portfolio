import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import ejs from 'ejs';

const app = express();
const PORT = 8000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files (pdf) from the 'views' directory
app.use(express.static('public'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'session-secret',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 30} //30mins
}));


// Middleware to inject header and footer
app.use((req, res, next) => {
    ejs.renderFile(path.join(__dirname, 'views', 'partials', 'header.ejs'), { user: req.session.user }, (err, header) => {
        if (err) return res.status(500).send('Error loading header');
        res.locals.header = header;
        next();
    });
});



//Home page
app.get('/', (req, res) => {
    fs.readFile(path.join(__dirname, 'views', 'index.html'), 'utf8', (err, content) => {
        if (err) return res.status(500).send('Error loading home page');
        res.send(res.locals.header + content);
    });
});

app.get('/index', (req, res) => {
    fs.readFile(path.join(__dirname, 'views', 'index.html'), 'utf8', (err, content) => {
        if (err) return res.status(500).send('Error loading home page');
        res.send(res.locals.header + content);
    });
});

app.get('/about', (req, res) => {
    fs.readFile(path.join(__dirname, 'views', 'about.html'), 'utf8', (err, content) => {
        if (err) return res.status(500).send('Error loading about page');
        res.send(res.locals.header + content);
    });
});


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
