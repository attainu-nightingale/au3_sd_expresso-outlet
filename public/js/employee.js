var express = require('express');
var router = express.Router();

var session = require('express-session');

// define the /employee home page route
router.get('/', function (req, res) {
  res.send('Employee Home Page' + '<a href="/employee/logout">Logout</a>');
});

// define the /employee/my-profile route
router.get('/my-profile', function (req, res) {
    res.send('Employee Profile Page')
});

// define the /employee/my-timesheet route
router.get('/my-timesheet', function (req, res) {
    res.send('Employee Timesheet Page')
});

module.exports = router ;