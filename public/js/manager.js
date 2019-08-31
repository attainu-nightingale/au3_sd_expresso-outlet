var express = require('express');
var router = express.Router();

var session = require('express-session');

// define the /manager home page route
router.get('/', function (req, res) {
  res.send('Manager Home Page' + '<a href="/manager/logout">Logout</a>');
});

// define the /manager/my-profile route
router.get('/my-profile', function (req, res) {
    res.send('Manager Profile Page')
});

// define the /manager/menu-management route
router.get('/menu-management', function (req, res) {
    res.send('Manager Menu Management Page')
  });

  // define the /manager/order-management route
router.get('/order-management', function (req, res) {
    res.send('Manager Order Management Page')
  });

  // define the /manager/stock-management route
router.get('/stock-management', function (req, res) {
    res.send('Manager Stock Management Page')
  });

// define the /manager/employee-management route
router.get('/employee-management', function (req, res) {
  res.send('Manager Employee Management Page')
});


module.exports = router ;