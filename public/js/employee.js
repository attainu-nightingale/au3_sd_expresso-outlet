var express = require('express');
var router = express.Router();
var path = require('path');
var ObjectId = require('mongodb').ObjectID;
var session = require('express-session');
var VIEWS_PATH = path.join(__dirname,"../../templates/views");

router.use(express.urlencoded({extended: false}));
router.use(express.json());

router.use(session({
  resave: true ,
  saveUninitialized: true,
  secret: 'Secret signature for secure session ID'
})); 

// define the /employee home page route
router.get('/', function (req, res) {
  var employee_name = req.app.locals.employee_name;
  if(req.app.locals.is_employee_of_month == true)
    var isEmpOfMonth = true
  res.render(VIEWS_PATH + '/employee_home.hbs',{
    title : "Employee Home Page" ,
    style : '../../css/manager_home.css',
    //script : '../../js/manager_home.js',
    layout : 'employee-layout.hbs',
    employeeName : employee_name,
    isEmployeeOfMonth : isEmpOfMonth
});
});

// define the /employee/my-profile route
router.get('/my-profile', function (req, res) {
    var db = req.app.locals.db;
    var username = req.app.locals.username;
    var password = req.app.locals.password;
    
    db.collection('employees').find({$and : [{username : username , password : password }]}).toArray((err,doc) => {
      if (err) 
          throw err;
      console.log(doc);
    res.render(VIEWS_PATH + '/employee_profile.hbs',{
    title : "Employee Profile Page" ,
    style : '../../css/manager_home.css',
    script : '../../js/emp_passreset.js',
    layout : 'employee-layout.hbs',
    data : doc
  });
});
});

// define the /employee/my-profile/:name route for unique record
router.get('/my-profile/:name', (req,res) => {
  var db = req.app.locals.db;
  var id = req.app.locals._id;
  var name = req.params.name
  //var name = req.app.locals.employee_name;
  console.log(id + ' ' + name);
  db.collection('employees').find({emp_name : name}).toArray((err,doc) => {
      if(err) throw err;
      res.send('<pre>' + JSON.stringify(doc,null,6) + '</pre>');
  });
});

// define the /employee/my-profile/:name route for unique record password update
router.put('/my-profile/:name', function (req, res) {
  var db = req.app.locals.db;
  var id = req.app.locals._id;
  var name = req.app.locals.employee_name;
  var password = req.app.locals.password;
  var newPass = req.body.password;
  console.log(newPass);
  db.collection('employees').updateOne({_id : ObjectId(id)} , {$set : {password : newPass}} , (err,doc) => {
    if(err) throw err;
    console.log(JSON.stringify(doc));
    res.json({success : "Password changed"});
  });
});

// define the /employee/my-timesheet route
router.get('/my-timesheets', function (req, res) {
  var db = req.app.locals.db;
  var employee_name = req.app.locals.employee_name;
  
  db.collection('timesheets').find({emp_name : employee_name}).toArray((err,doc) => {
    if (err) 
        throw err;
    console.log(doc);
  res.render(VIEWS_PATH + '/employee_timesheet.hbs',{
    title : "Employee Timesheet Page" ,
    style : '../../css/manager_home.css',
    //script : '../../js/manager_home.js',
    layout : 'employee-layout.hbs',
    data : doc
  });
  });
});

module.exports = router ;