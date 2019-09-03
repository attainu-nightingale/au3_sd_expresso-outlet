var express = require('express');
var router = express.Router();
var path = require('path');
var session = require('express-session');
var VIEWS_PATH = path.join(__dirname,"../../templates/views");
var mongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017';

router.use(express.urlencoded({extended: false}));
router.use(express.json());

router.use(session({
  secret: 'Secret signature for secure session ID',
  resave: false ,
  saveUninitialized: true,
})); 

// define the /manager/manager-login route

router.get('/manager-login', (req,res) => {
  if(!req.session.isLoggedIn){
  res.render(VIEWS_PATH + '/manager-login.hbs',{
      title : "Manager Login Page" ,
      style : '../../css/login.css',
      layout : 'login-layout.hbs'
  }); 
  }
  else {
      res.redirect('../manager');
  }
});

// define the /manager/manager-auth route
router.post("/manager-auth" , (req,res) => {
  console.log(req.body);
  var db = req.app.locals.db;
  db.collection('manager').find({$and : [{username : req.body.username , password : req.body.password , emp_role : req.body.role}]}).toArray((err,doc) => {
      if (err) 
          throw err;
      console.log(doc);
      if (doc.length > 0) {
          req.session.username = req.body.username;
          req.session.password = req.body.password;
          console.log(req.session.username + ' ' + req.session.password);
          req.session.isLoggedIn = true;
          console.log(req.session.isLoggedIn);
          res.redirect("/manager");
      } 
      else {
        req.session.isLoggedIn = false;
          console.log("Incorrect credentials");
          res.redirect("../manager-login");
      }    
  });  
});

// define the /manager home page route
router.get('/', function (req, res) {
  console.log(req.session.isLoggedIn);
  if(!req.session.isLoggedIn)
    res.redirect('/manager/manager-login');
    else {
      req.session.isLoggedIn = true;
  res.render(VIEWS_PATH + '/manager_home.hbs',{
    title : "Manager Home Page" ,
    //style : '../../css/manager_home.css',
    script : '../../js/manager_home.js',
    layout : 'manager-layout.hbs'
});
    }
});

// define the /manager/my-profile route
router.get('/my-profile', function (req, res) {
  console.log(req.session.isLoggedIn);
  if(!req.session.isLoggedIn)
    res.redirect('/manager/manager-login');
    else {
    var db = req.app.locals.db;
    var username = req.session.username;
    var password = req.session.password;
    db.collection('manager').find({$and : [{username : username , password : password }]}).toArray((err,doc) => {
      if (err) 
          throw err;
      console.log(doc);
    res.render(VIEWS_PATH + '/manager_profile.hbs',{
    title : "Manager Profile Page" ,
    //style : '../../css/manager_home.css',
    script : '../../js/manager_home.js',
    layout : 'manager-layout.hbs',
    data : doc
  });
});
  }
});

// define the /manager/menu-management route
router.get('/menu-management', function (req, res) {
  console.log(req.session.isLoggedIn);
  if(!req.session.isLoggedIn)
    res.redirect('/manager/manager-login');
    else {
  var db = req.app.locals.db;
  db.collection('employees').find({}).toArray((err,doc) => {
    if (err) 
        throw err;
    console.log(doc);
  res.render(VIEWS_PATH + '/menu_management.hbs',{
    title : "Menu Management Page" ,
    //style : '../../css/manager_home.css',
    script : '../../js/manager_home.js',
    layout : 'manager-layout.hbs',
    data : doc
  });
  });
}
});

  // define the /manager/order-management route
router.get('/order-management', function (req, res) {
  console.log(req.session.isLoggedIn);
  if(!req.session.isLoggedIn)
    res.redirect('/manager/manager-login');
    else {
  var db = req.app.locals.db;
  db.collection('employees').find({}).toArray((err,doc) => {
    if (err) 
        throw err;
    console.log(doc);
  res.render(VIEWS_PATH + '/order_management.hbs',{
    title : "Order Management Page" ,
    //style : '../../css/manager_home.css',
    script : '../../js/manager_home.js',
    layout : 'manager-layout.hbs',
    data : doc
  });
  });
}
});

  // define the /manager/stock-management route
router.get('/stock-management', function (req, res) {
  console.log(req.session.isLoggedIn);
  if(!req.session.isLoggedIn)
    res.redirect('/manager/manager-login');
    else {
  var db = req.app.locals.db;
  db.collection('employees').find({}).toArray((err,doc) => {
    if (err) 
        throw err;
    console.log(doc);
  res.render(VIEWS_PATH + '/stock_management.hbs',{
    title : "Stock Management Page" ,
    //style : '../../css/manager_home.css',
    script : '../../js/manager_home.js',
    layout : 'manager-layout.hbs',
    data : doc
  });
  });
}
});

// define the /manager/employee-management route
router.get('/employee-management', function (req, res) {
  console.log(req.session.isLoggedIn);
  if(!req.session.isLoggedIn)
    res.redirect('/manager/manager-login');
    else {
  var db = req.app.locals.db;
  db.collection('employees').find({}).toArray((err,doc) => {
    if (err) 
        throw err;
    console.log(doc);
  res.render(VIEWS_PATH + '/employee_management.hbs',{
    title : "Employee Management Page" ,
    //style : '../../css/manager_home.css',
    script : '../../js/emp_mgmt.js',
    layout : 'manager-layout.hbs',
    data : doc
  });
});
   }
});

// define the /manager/employee/1 route to see details of one employee in JSON format

router.get('/employee/:id', (req,res) => {
  if(!req.session.isLoggedIn)
    res.redirect('../manager-login');
    else {
  var db = req.app.locals.db;
  var id = req.params.id
  
  console.log(id);
  db.collection('employees').find({emp_id : id}).toArray((err,doc) => {
      if(err) throw err;
      res.json(doc);
    });
 }
  });

  //define the /manager/employee-management/employee/1 route to see details of one employee

router.get('/employee-management/employee/:id', (req,res) => {
  console.log(req.session.isLoggedIn);
  if(!req.session.isLoggedIn)
    res.redirect('../../manager-login');
    else {
  var db = req.app.locals.db;
  var id = req.params.id
  
  console.log(id);
  db.collection('employees').find({emp_id : id}).toArray((err,doc) => {
      if(err) throw err;
      console.log(doc);
      res.render(VIEWS_PATH + '/manage_employee.hbs',{
        title : "Employee Details Page" ,
        //style : '/css/manager_home.css',
        script : '/js/emp_mgmt.js',
        layout : 'manager-layout.hbs',
        data : doc
      });
  });
}
});

router.put('/employee-management/employee/:id', (req,res) => {

  var db = req.app.locals.db;
  var id = req.params.id;
  console.log(id);
  console.log(req.body);
  var objForUpdate = {};
  
    if (req.body.name) objForUpdate.emp_name = req.body.name;
    if (req.body.age) objForUpdate.emp_age = req.body.age;
    if (req.body.email) objForUpdate.email = req.body.email;
    if (req.body.address) objForUpdate.emp_addr = req.body.address;
    if (req.body.job) objForUpdate.job = req.body.job;
    if (req.body.username) objForUpdate.username = req.body.username;
    if (req.body.empofmonth) objForUpdate.is_employee_of_month = req.body.empofmonth;

  db.collection('employees').updateOne({emp_id : id} , {$set : objForUpdate } , (err,doc) => {
      if(err) throw err;
      console.log(JSON.stringify(doc));
    res.json({success : "Employee record changed"});
  });
});

// define the /manager/logout route

router.get('/logout', function (req, res) {
  req.session.destroy();
  res.redirect('/manager/manager-login');
});

module.exports = router;