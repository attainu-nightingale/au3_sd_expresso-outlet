var express = require('express');
var router = express.Router();
var path = require('path');
var session = require('express-session');
var VIEWS_PATH = path.join(__dirname,"../../templates/views");


// define the /manager home page route
router.get('/', function (req, res) {
  res.render(VIEWS_PATH + '/manager_home.hbs',{
    title : "Manager Home Page" ,
    style : '../../css/manager_home.css',
    script : '../../js/manager_home.js',
    layout : 'manager-layout.hbs'
});
});

// define the /manager/my-profile route
router.get('/my-profile', function (req, res) {
    var db = req.app.locals.db;
    var username = req.app.locals.username;
    var password = req.app.locals.password;
    db.collection('manager').find({$and : [{username : username , password : password }]}).toArray((err,doc) => {
      if (err) 
          throw err;
      console.log(doc);
    res.render(VIEWS_PATH + '/manager_profile.hbs',{
    title : "Manager Profile Page" ,
    style : '../../css/manager_home.css',
    script : '../../js/manager_home.js',
    layout : 'manager-layout.hbs',
    data : doc
  });
});
});

// define the /manager/menu-management route
router.get('/menu-management', function (req, res) {
  var db = req.app.locals.db;
  db.collection('employees').find({}).toArray((err,doc) => {
    if (err) 
        throw err;
    console.log(doc);
  res.render(VIEWS_PATH + '/menu_management.hbs',{
    title : "Menu Management Page" ,
    style : '../../css/manager_home.css',
    script : '../../js/manager_home.js',
    layout : 'manager-layout.hbs',
    data : doc
  });
  });
});

  // define the /manager/order-management route
router.get('/order-management', function (req, res) {
  var db = req.app.locals.db;
  db.collection('employees').find({}).toArray((err,doc) => {
    if (err) 
        throw err;
    console.log(doc);
  res.render(VIEWS_PATH + '/order_management.hbs',{
    title : "Order Management Page" ,
    style : '../../css/manager_home.css',
    script : '../../js/manager_home.js',
    layout : 'manager-layout.hbs',
    data : doc
  });
  });
});

  // define the /manager/stock-management route
router.get('/stock-management', function (req, res) {
  var db = req.app.locals.db;
  db.collection('employees').find({}).toArray((err,doc) => {
    if (err) 
        throw err;
    console.log(doc);
  res.render(VIEWS_PATH + '/stock_management.hbs',{
    title : "Stock Management Page" ,
    style : '../../css/manager_home.css',
    script : '../../js/manager_home.js',
    layout : 'manager-layout.hbs',
    data : doc
  });
  });
});

// define the /manager/employee-management route
router.get('/employee-management', function (req, res) {
  var db = req.app.locals.db;
  db.collection('employees').find({}).toArray((err,doc) => {
    if (err) 
        throw err;
    console.log(doc);
  res.render(VIEWS_PATH + '/employee_management.hbs',{
    title : "Employee Management Page" ,
    style : '../../css/manager_home.css',
    script : '../../js/emp_mgmt.js',
    layout : 'manager-layout.hbs',
    data : doc
  });
});
});


module.exports = router;