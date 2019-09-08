var express = require('express');
var router = express.Router();
var path = require('path');
var session = require('express-session');
var uuidv4 = require("uuid/v4");
var multer = require('multer');
var PATH = path.join(__dirname, "/public/");
var upload = multer({dest:PATH + '/images/'});
var cloudinary = require('cloudinary').v2;
var cloudinaryStorage = require("multer-storage-cloudinary");
var dotenv = require('dotenv');
dotenv.config();
var VIEWS_PATH = path.join(__dirname,"../../templates/views");
var mongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://localhost:27017';

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
  });

  const storage = cloudinaryStorage({
  cloudinary: cloudinary,
  folder: "expresso",
  allowedFormats: ["jpg", "png"],
  transformation: [{ width: 500, height: 500, crop: "limit" }]
  });
  const parser = multer({ storage: storage });

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
    style : '../../css/manager_home.css',
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
    script : '../../js/order_manage.js',
    layout : 'manager-layout.hbs',
    data : doc
  });
  });
}
});



//define the GET for /manager/order-management/order/objid(id) route to see details of an order

router.get('/order-management/order/:id', (req,res) => {
  console.log(req.session.isLoggedIn);
  if(!req.session.isLoggedIn)
    res.redirect('../../manager-login');
    else {
  var db = req.app.locals.orderDB;
  var id = req.params.id
  //var itemname = req.params.itemname;
  
  console.log(id);
  db.collection('orders').find({_id : ObjectId(id)}).toArray((err,doc) => {
      if(err) throw err;
      console.log(doc);
      res.render(VIEWS_PATH + '/manage_order.hbs',{
        title : "Order Details Page" ,
        script : '/js/order_manage.js',
        layout : 'manager-layout.hbs',
        data : doc
      });
      });
}
});

//define the POST for /manager/order-management/order/objid(id) route 
router.post('/order-management/order/:id', (req,res) => {
  console.log(req.session.isLoggedIn);
  if(!req.session.isLoggedIn)
    res.redirect('../../manager-login');
    else {
  var db = req.app.locals.orderDB;
  var id = req.params.id
  //var itemname = req.params.itemname;
  var newOrderItemObj = {
    _id :  uuidv4(),
    item_name : req.body.order_item,
    item_price : req.body.price,
    quantity : req.body.quantity,
    total_price : req.body.total_price
  };
  
  console.log(id);
  console.log(newOrderItemObj);
  db.collection('orders').update({_id : ObjectId(id)}, {$push: {orderedItems : newOrderItemObj}},(err,doc) => {
      if(err) throw err;
      console.log(doc);
  });
  db.collection('orders').update({_id: ObjectId(id)}, {$set: {grand_total: req.body.grand_total}} , (err,doc) => {
    if(err) throw err;
    console.log(doc);
});
    }
});   

//GET route for displaying all orders
router.get('/getAllOrders', (req,res) => {
  // console.log(req.session.isLoggedIn);
  // if(!req.session.isLoggedIn)
  //   res.redirect('/manager/manager-login');
  //   else {
  var db = req.app.locals.orderDB;
  db.collection('orders').find({}).toArray((err,doc) => {
    if(err) throw err;
    res.json(doc);
  });
//}
});


//define the POST route for /manager/getAllOrders to add new order skeleton
router.post('/getAllOrders/', (req,res) => {
  var db = req.app.locals.orderDB;
  var newOrderObj = {
    orderID : req.body.order_id,
    table_no : req.body.table_no,
    orderedItems : []
  };

    console.log(newOrderObj);

  db.collection('orders').insertOne(newOrderObj , (err,doc) => {
      if(err) throw err;
      console.log(JSON.stringify(doc));
      res.json({success : "New order skeleton added"});
    });
  });

//GET route for new order 
router.get('/order-management/new-order/', (req,res) => {
  console.log(req.session.isLoggedIn);
  if(!req.session.isLoggedIn)
    res.redirect('/manager/manager-login');
    else {
  var db = req.app.locals.menuDB;
  db.collection('menus').find({}).toArray((err,doc) => {
    if(err) throw err;
    console.log(doc);
    res.render(VIEWS_PATH + '/new_order.hbs',{
      title : "New Order Page" ,
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
  var menuoid = req.body.menu_oid;
  var menuitemoid = req.body.menuitem_oid;
  console.log('INVENTORY' + ' ' + newInventory + ' ' + menuitem_name + ' ' + menuoid + ' ' +menuitemoid);

    db.collection('menus').update({_id: ObjectId(menuoid), 
      menu_items: { $elemMatch:{ _id: ObjectId(menuitemoid)}}} , {$set: {"menu_items.$.in_inventory": newInventory}}, 
      (err,doc) => {
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


router.get('/getAllEmployees', (req,res) => {
  if(!req.session.isLoggedIn)
    res.redirect('../manager-login');
    else {
  var db = req.app.locals.db;
  var id = req.params.id
  
  console.log(id);
  db.collection('employees').find({}).toArray((err,doc) => {
      if(err) throw err;
      res.json(doc);
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
        //style : '../../css/manager_home.css',
        script : '/js/emp_mgmt.js',
        layout : 'manager-layout.hbs',
        data : doc
      });
      });
}
});

// POST route to add a new employee
router.post('/employee-management/employee/', parser.single('profile_pic'), (req,res) => {
  cloudinary.uploader.upload(req.file.path, (err,result) => {
    console.log("File upload result :" , result);
    var imageUrl = result.secure_url;
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
    profile_pic : imageUrl,
    joining_date : req.body.joiningdate,
    is_employee_of_month : req.body.empofmonth
  };

    console.log(newEmployeeObj);

  db.collection('employees').insertOne(newEmployeeObj , (err,doc) => {
      if(err) throw err;
      console.log(JSON.stringify(doc));
      res.json({success : "New employee added sucessfully"});
      console.log(doc);
    });
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