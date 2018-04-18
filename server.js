const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

const port = process.env.PORT || 3000; //use environment variable PORT or use 3000 if the env var is not set
//heroku will set the env var, that's why we need to generalize this
//see below at app.listen

var app = express();

hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs'); 

app.use((req, res, next) => {
    var now = new Date().toString();
    var log = `${now}: ${req.method} ${req.url}`;
    console.log(log);

    fs.appendFile('server.log', log + '\n', (err) => {
        if (err) {
            console.log('Unable to append to server.log');
        }
    });
    next();
});

// app.use((req, res, next) => {
//     res.render('maintenance.hbs');
// });

app.use(express.static(__dirname + '/public'));

hbs.registerHelper('getCurrentYear', () => {
    return new Date().getFullYear();
});

hbs.registerHelper('screamIt', (text) => {
    return text.toUpperCase();
});

//sets up a handler for an http get request
//first arg is the url. so '/' is root. second function is what gets called when that url is hit
/**
 * req and res are hugely important to how express works
 * req contains info about request coming in. headers used, body information, etc. response has a bunch of methods available
 *  for responding to the request coming in. customize data to send back, set http status codes, etc
 * */
app.get('/', (req, res) => {
    //res.send('<h1>hello express! whooooooa</h1>');
    // res.send({
    //     name: 'alex',
    //     likes: [
    //         'games',
    //         'lifting'
    //     ]
    // });
    res.render('home.hbs', {
        pageTitle: 'Home Page',
        welcomeMessage: 'Welcome to my site'
    });
});

app.get('/about', (req, res) => {
    res.render('about.hbs', {
        pageTitle: 'About Page',
    });
});

app.get('/bad', (req, res) => {
    res.send({
        result: 'error',
        message: 'bad url'
    });
});

//causes the app to start listening on the given port
app.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});