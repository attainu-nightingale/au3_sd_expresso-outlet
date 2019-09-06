var express = require('express');
var router = express.Router();
var path = require('path');
var session = require('express-session');
var VIEWS_PATH = path.join(__dirname,"../../templates/views");
var mongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
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
          res.redirect("/manager/manager-login");
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
  var db = req.app.locals.orderDB;
  db.collection('orders').find({}).toArray((err,doc) => {
    if (err) 
        throw err;
    console.log(doc);
  res.render(VIEWS_PATH + '/order_management.hbs',{
    title : "Order Management Page" ,
    //style : '../../css/manager_home.css',
    script : '../../js/order_manage.js',
    layout : 'manager-layout.hbs',
    data : doc
  });
  });
}
});


// define the /manager/order/1 route to see details of one employee in JSON format

router.get('/order/:id', (req,res) => {
  if(!req.session.isLoggedIn)
    res.redirect('../manager-login');
    else {
  var db = req.app.locals.orderDB;
  var id = req.params.id
  
  console.log(id);
  db.collection('employees').find({orderID : id, orderedItems : {$elemMatch : {item_name : itemname}}}).toArray((err,doc) => {
      if(err) throw err;
      res.json(doc);
    });
 }
  });


//define the GET for /manager/order-management/order/1 route to see details of one employee

router.get('/order-management/order/:id', (req,res) => {
  console.log(req.session.isLoggedIn);
  if(!req.session.isLoggedIn)
    res.redirect('../../manager-login');
    else {
  var db = req.app.locals.orderDB;
  var id = req.params.id
  var itemname = req.params.itemname;
  
  console.log(id);
  db.collection('orders').find({_id : ObjectId(id)}).toArray((err,doc) => {
  //db.collection('orders').find({orderedItems : {$elemMatch : {_id : ObjectId(id)}}}).toArray((err,doc) => {
      if(err) throw err;
      console.log(doc);
      res.render(VIEWS_PATH + '/manage_order.hbs',{
        title : "Order Details Page" ,
        //style : '/css/manager_home.css',
        script : '/js/order_manage.js',
        layout : 'manager-layout.hbs',
        data : doc
      });
      });
}
});



// DELETE route to delete an order
router.delete('/order-management/order/:id', (req,res) => {
  var db = req.app.locals.orderDB;
  var id = req.params.id
  console.log(id);
  
db.collection('orders').deleteOne({_id : ObjectId(id)} , (err,doc) => {
    if(err) throw err;
    console.log(JSON.stringify(doc));
    res.json({success : "Order deleted successfully!"});
}); 
});

// define the /manager/stock-management route
router.get('/stock-management', function (req, res) {
  console.log(req.session.isLoggedIn);
  if(!req.session.isLoggedIn)
    res.redirect('/manager/manager-login');
    else {
  var db = req.app.locals.menuDB;
  db.collection('menus').find({}).toArray((err,doc) => {
    if (err) 
        throw err;
    console.log(doc);
  res.render(VIEWS_PATH + '/stock_management.hbs',{
    title : "Stock Management Page" ,
    //style : '../../css/manager_home.css',
    script : '../../js/stock_manage.js',
    layout : 'manager-layout.hbs',
    data : doc
  });
  });
}
});

// define the /manager/getAllMenus route
router.get('/getAllMenus', function (req, res) {
  // console.log(req.session.isLoggedIn);
  // if(!req.session.isLoggedIn)
  //   res.redirect('/manager/manager-login');
  //   else {
  var db = req.app.locals.menuDB;
  db.collection('menus').find({}).toArray((err,doc) => {
    if (err) 
        throw err;
        res.json(doc);
    console.log(doc);
  });
//}
});


// define the GET for /manager/getMenuItem route
router.get('/getMenuItem/:menuitem', function (req, res) {
  // console.log(req.session.isLoggedIn);
  // if(!req.session.isLoggedIn)
  //   res.redirect('/manager/manager-login');
  //   else {
  var db = req.app.locals.menuDB;
  var menuitem_name = req.params.menuitem;
  db.collection('menus').find({ menu_items : {$elemMatch : {menu_item_name : menuitem_name}}}).toArray((err,doc) => {
    if (err) 
        throw err;
        res.json(doc);
    console.log(doc);
  });
//}
});


router.put('/getMenuItem/:menuitem', function (req, res) {
  var db = req.app.locals.menuDB;
  var menuitem_name = req.params.menuitem;
  var newInventory = req.body.newQuantity;
  console.log('INVENTORY' + ' ' + newInventory + ' ' + menuitem_name);
   db.collection('menus').updateOne({ menu_item_name : menuitem_name }, {menu_items : {$elemMatch : {menu_item_name : menuitem_name}}} , { $set: {menu_items : {$elemMatch : {$in_inventory : newInventory}}}} , (err,doc) => {
    if (err) 
        throw err;
    res.json({success : "Stock added successfully!"});
    console.log(doc);
    });
  });


router.get('/getMenuItem/:menuname/:menuitem', function (req, res) {
  var db = req.app.locals.menuDB;
  var menu_name = req.params.menuname;
  var menuitem_name = req.params.menuitem;
  db.collection('menus').find({ menu_name : menu_name , menu_items : {$elemMatch : {menu_item_name : menuitem_name}}}).toArray((err,doc) => {
    if (err) 
        throw err;
        res.json(doc);
    console.log(doc);
  });
//}
});


// define the PUT for /manager/getMenuItem route
router.put('/getMenuItem/:menuname/:menuitem', function (req, res) {
  var db = req.app.locals.menuDB;
  var menu_name = req.params.menuname;
  var menuitem_name = req.params.menuitem;
  var newInventory = req.body.newQuantity;
  console.log('INVENTORY' + ' ' + newInventory + ' ' + menuitem_name);
  
  db.collection('menus').findOne({menu_name: menu_name , "menu_items.menu_item_name" : menuitem_name} , (err,doc) => {

  // var update = { "$set": {} };
  // update.$set["menu_items.in_inventory"] = newInventory;
  // db.collection('menus').updateOne({menu_name: menu_name}, update);
  //   db.collection('menus').updateOne({ menu_item_name : menuitem_name },  {$set: {"menu_items.in_inventory": newInventory}} , (err,doc) => {
  // db.collection('menus').updateOne({ menu_name : menu_name }, {menu_items : {$elemMatch : {menu_item_name : menuitem_name}}} , { $set: {menu_items : {$elemMatch : {$in_inventory : newInventory}}}} , (err,doc) => {
//     if (err) 
//         throw err;
//     res.json({success : "Stock added successfully!"});
//     console.log(doc);
//     });
  });
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

  

//define the GET for /manager/employee-management/employee/1 route to see details of one employee

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

// POST route to add a new employee
router.post('/employee-management/employee/', (req,res) => {
  var db = req.app.locals.db;
  //var id = req.params.id

  console.log(req.body);
  var newEmployeeObj = {
    emp_id : req.body.id,
    emp_name : req.body.name,
    emp_age : req.body.age,
    email : req.body.email,
    emp_gender : req.body.gender,
    emp_addr : req.body.address,
    emp_role : req.body.role,
    job : req.body.job,
    username : req.body.username,
    password : req.body.password,
    //profile_pic : req.body.profile-pic,
    joining_date : req.body.joining_date,
    is_employee_of_month : req.body.is_empofmonth
  };

    console.log(newEmployeeObj);

  db.collection('employees').insertOne(newEmployeeObj , (err,doc) => {
      if(err) throw err;
      console.log(JSON.stringify(doc));
      res.json({success : "New employee added sucessfully"});
      console.log(doc);
    });
});



// PUT route to update an employee
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

// DELETE route to delete an employee
router.delete('/employee-management/employee/:id', (req,res) => {
  var db = req.app.locals.db;
  var id = req.params.id
  console.log(id);
  
db.collection('employees').deleteOne({emp_id : id} , (err,doc) => {
    if(err) throw err;
    console.log(JSON.stringify(doc));
    res.json({success : "Employee deleted successfully!"});
}); 
db.collection('timesheets').deleteOne({emp_id : id} , (err,doc) => {
  if(err) throw err;
  console.log(JSON.stringify(doc));
console.log({success : "Employee timesheets deleted !"});

}); 

});

//define the /manager/employee/timesheets/1 to get timesheets of that employee
router.get('/employee/timesheets/:id', (req,res) => {
  // if(!req.session.isLoggedIn)
  //   res.redirect('../../manager-login');
  //   else {
  var db = req.app.locals.db;
  var id = req.params.id
  
  console.log(id);
  db.collection('timesheets').find({emp_id : id}).toArray((err,doc) => {
      if(err) throw err;
      res.json(doc);
      console.log(doc);
    });
//  }
  });


//define the POST route for /manager/employee/timesheets/ to add new timesheet for an employee
router.post('/employee/timesheets/', (req,res) => {
  var db = req.app.locals.db;
  console.log(req.body);
  var newTimesheetObj = {
    emp_id : req.body.emp_id,
    emp_name : req.body.emp_name,
    date : req.body.date,
    working_hours : req.body.working_hrs,
    wage_per_hr : req.body.wage_per_hr,
    total_wage : req.body.total_wage
  };

    console.log(newTimesheetObj);

  db.collection('timesheets').insertOne(newTimesheetObj , (err,doc) => {
      if(err) throw err;
      console.log(JSON.stringify(doc));
      res.json({success : "New employee timesheet added"});
      console.log(doc);
    });
  });


// define the PUT route for /manager/employee/timesheets/ to edit timesheet for an employee
  router.put('/employee/timesheets/:id', (req,res) => {
    var db = req.app.locals.db;
    var id = req.params.id;
    console.log('req.body', req.body); 

    var updatedTimesheetObj = {

    date : req.body.date,
    working_hours : req.body.workinghours, 
    wage_per_hr : req.body.wageperhr,
    total_wage : req.body.totalwage 

  };
  
    console.log(updatedTimesheetObj);
  
    db.collection('timesheets').updateOne({emp_id : id , date : updatedTimesheetObj.date} , {$set : updatedTimesheetObj} , (err,doc) => {
        if(err) throw err;
        console.log(JSON.stringify(doc));
        res.json({success : "Employee timesheet updated !"});
      });
    });


 // define the DELETE route for /manager/employee/timesheets/ to delete timesheet for an employee   
 router.delete('/employee/timesheets/:id/:date', (req,res) => {
  var db = req.app.locals.db;
  var id = req.params.id;
    console.log(id);
  var date = req.params.date;  
    db.collection('timesheets').deleteOne({emp_id : id, date : date} , (err,doc) => {
        if(err) throw err;
        console.log(JSON.stringify(doc));
        res.json({success : "Employee timesheet deleted !"});
    }); 
});
    
// define the /manager/logout route
router.get('/logout', function (req, res) {
  req.session.destroy();
  res.redirect('/manager/manager-login');
});

module.exports = router;