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

// define the /employee/employee-login route
router.get('/employee-login', (req,res) => {
  if(!req.session.isEmpLoggedIn){
  res.render(VIEWS_PATH + '/employee-login.hbs',{
      title : "Employee Login Page" ,
      style : '../../css/login.css',
      layout : 'login-layout.hbs'
  }); 
}
else {
  res.redirect('../employee');
}
});

// define the /employee/employee-auth route
router.post("/employee-auth" , (req,res) => {
  // console.log(req.session.isEmpLoggedIn);
  // if(!req.session.isEmpLoggedIn)
  //   res.redirect('/employee/employee-login');
  //   else {
  console.log(req.body);
  var db = req.app.locals.db;
  db.collection('employees').find({$and : [{username : req.body.username , password : req.body.password , emp_role : req.body.role}]}).toArray((err,doc) => {
      if (err) 
          throw err;
      console.log(doc);

      if (doc.length > 0) {
          req.session.username = req.body.username;
          req.session.password = req.body.password;
          req.session.employee_name = doc[0].emp_name;
          req.session.empid = doc[0].emp_id;
          req.session.is_employee_of_month = doc[0].is_employee_of_month;
          req.session._id = doc[0]._id;
          req.session.profile_pic = doc[0].profile_pic;
          console.log(req.session.empid + " " + req.session.username + ' ' + req.session.password + ' ' + req.session.employee_name + ' ' + req.session.is_employee_of_month + ' ' + req.session._id);    
          req.session.isEmpLoggedIn = true;
          console.log(req.session.isEmpLoggedIn);
          res.redirect("/employee");
      } 
      else {
        req.session.isEmpLoggedIn = false;
        res.render(VIEWS_PATH + '/employee-login.hbs',{
          title : "Employee Login Page" ,
          style : '../../css/login.css',
          layout : 'login-layout.hbs',
          msg: 'Wrong username or password'
        }); 
        console.log("Incorrect credentials");
        //res.redirect("/employee/employee-login");
      }    
  });  
//}
});

// define the /employee home page route
router.get('/', function (req, res) {
  console.log(req.session.isEmpLoggedIn);
  if(!req.session.isEmpLoggedIn)
    res.redirect('/employee/employee-login');
    else {
  var employee_name = req.session.employee_name;
  if(req.session.is_employee_of_month == "true")
    var isEmpOfMonth = "true"
    var db = req.app.locals.db;
    var id = req.session._id;
    db.collection('employees').find({_id : ObjectId(id)}).toArray((err,doc) => {
      if (err) 
          throw err;
      console.log(doc);
  res.render(VIEWS_PATH + '/employee_home.hbs',{
    title : "Employee Home Page" ,
    style : '../../css/manager_home.css',
    layout : 'employee-layout.hbs',
    employeeName : employee_name,
    isEmployeeOfMonth : isEmpOfMonth,
    src : req.session.profile_pic,
    data: doc
  }); 
});
}
});

// define the /employee/my-profile route
router.get('/my-profile', function (req, res) {
  if(!req.session.isEmpLoggedIn)
    res.redirect('/employee/employee-login');
    else {
    var db = req.app.locals.db;
    var id = req.session._id;
    db.collection('employees').find({_id : ObjectId(id)}).toArray((err,doc) => {
      if (err) 
          throw err;
      console.log(doc);
    res.render(VIEWS_PATH + '/employee_profile.hbs',{
    title : "Employee Profile Page" ,
    style : '../../css/manager_home.css',
    script : '../../js/emp_passreset.js',
    layout : 'employee-layout.hbs',
    src : req.session.profile_pic,
    data : doc
  });
  });
  }
});

// define the /employee/getAllEmployees route
router.get('/getAllEmployees', (req,res) => {
  if(!req.session.isEmpLoggedIn)
    res.redirect('/employee/employee-login');
    else {
  var db = req.app.locals.db;
  db.collection('employees').find({}).toArray((err,doc) => {
      if(err) throw err;
      res.send('<pre>' + JSON.stringify(doc,null,6) + '</pre>');
  });
}
});

// define the /employee/my-profile/:name route for unique record
router.get('/my-profile/:name', (req,res) => {
  if(!req.session.isEmpLoggedIn)
    res.redirect('/employee/employee-login');
    else {
  var db = req.app.locals.db;
  var id = req.session._id;
  var name = req.params.name
  console.log(id + ' ' + name);
  db.collection('employees').find({emp_name : name}).toArray((err,doc) => {
      if(err) throw err;
      res.send('<pre>' + JSON.stringify(doc,null,6) + '</pre>');
  });
}
});

// define the /employee/my-profile/:name route for unique record password update
router.put('/my-profile/:empid', function (req, res) {
  if(!req.session.isEmpLoggedIn)
    res.redirect('/employee/employee-login');
    else {
  var db = req.app.locals.db;
  var id = req.session._id;
  var emp_id = req.params.empid;
  var name = req.session.employee_name;
  var newPass = req.body.password;
  console.log(newPass);
  console.log(emp_id);
  db.collection('employees').updateOne({_id : ObjectId(id)} , {$set : {password : newPass}} , (err,doc) => {
    if(err) throw err;
    console.log(JSON.stringify(doc));
    res.json({success : "Password changed"});
  });
}
});

// define the /employee/my-timesheets route
router.get('/my-timesheets', function (req, res) {
  console.log(req.session.isEmpLoggedIn);
  if(!req.session.isEmpLoggedIn)
    res.redirect('/employee/employee-login');
    else {
  var db = req.app.locals.db;
  var employee_name = req.session.employee_name;
  var id = req.session._id;
  db.collection('timesheets').find({emp_name : employee_name}).toArray((err,doc) => {
    if (err) 
        throw err;
    console.log('Image URL is' + JSON.stringify(doc[0]));
  res.render(VIEWS_PATH + '/employee_timesheet.hbs',{
    title : "Employee Timesheet Page" ,
    style : '../../css/manager_home.css',
    layout : 'employee-layout.hbs',
    src : req.session.profile_pic,
    data : doc
  });
  });
}
});

// define the /employee/logout route
router.get('/logout', function (req, res) {
  req.session.destroy();
  res.redirect('/employee/employee-login');
});

module.exports = router ;