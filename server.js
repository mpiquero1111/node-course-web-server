const express = require('express');
const fs = require('fs');
//install handlebars (hbs) for template and dyncami pages generation
var hbs = require('hbs');
var app = express();

//we need this for heroku to set port
app.set('port', (process.env.PORT || 5000));

//here we set express to use our html page
app.use(express.static(__dirname + '/public'));
//going to use this app.use to use middleware to log
app.use((request, response, next) => {
  var now = new Date().toString();
  var log = `${now} ${request.method} ${request.url}`;
  //console.log(log);
  fs.appendFile('server.log', log + '\n', (err) => {
    if (err) {
      console.log(err, 'Unable to append to server.log');
    }
  });
  next();
});
//this makdes the maint page constantly show
// app.use((request, response, next) => {
//   response.render('pages/maintenance', {
//     pageTitle: 'Maintenance'
//   })
// });

// views is directory for all template files
app.set('views', __dirname + '/views');
hbs.registerPartials(__dirname + '/views/partials');
//here we tell express to use handlebars
app.set('view engine', 'hbs');
//create a hbs helper to get the year and push it to hbs
hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear();
});

//app.get takes two arguments, first is location(url), and second is function.
//the second function arguement, express wants req and res
app.get('/', (request, response) => {
  //res.send('<h1>Hello Express Response</h1>');
  response.render('pages/index', {
    pageTitle: 'Home Page'
  });
});

//create a route or another page
app.get('/about', function(request, response) {
  response.render('pages/about', {
    pageTitle: 'About Page'
  });//this points to the view\page\name.hbs
});

//create a route or another page
app.get('/proj', function(request, response) {
  response.render('pages/proj', {
    pageTitle: 'Project Page'
  });//this points to the view\page\name.hbs
});

app.get('/bad',(request, response) => {
  //res.send('<h1>Hello Express bad page</h1>');
  response.send({
  error: "Big Problem",
    number:"1"
  });
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
