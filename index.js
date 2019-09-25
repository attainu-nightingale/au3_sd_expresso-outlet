var express = require('express');
var path = require('path');
var hbs = require('hbs');
var session = require('express-session');
var ObjectId = require('mongodb').ObjectID;
var mongoClient = require('mongodb').MongoClient;
var nodemailer = require('nodemailer');
//var url = 'mongodb://localhost:27017';
//var PATH = path.join(__dirname, "/public/");
var PORT = process.env.PORT || 5500;
var app = express();
var db,menuDB,orderDB;
var url;

// if(process.env.DB_URL)
    url = 'mongodb+srv://asraj:asraj123@expresso-cluster-2gmnz.mongodb.net/?retryWrites=true&w=majority';
// else
//     url = 'mongodb://localhost:27017';  

mongoClient.connect(url, {useNewUrlParser : true, useUnifiedTopology: true}, (err,client) => {
    if(err)
    throw err;
    app.locals.db = client.db('employeeDB');
    console.log("Connected to database : employeeDB");
});

mongoClient.connect(url, {useNewUrlParser : true, useUnifiedTopology: true}, (err,client) => {
    if(err)
    throw err;
    app.locals.menuDB = client.db('menuDB');
    console.log("Connected to database : menuDB");
});

mongoClient.connect(url, {useNewUrlParser : true, useUnifiedTopology: true}, (err,client) => {
    if(err)
    throw err;
    app.locals.orderDB = client.db('orderDB');
    console.log("Connected to database : orderDB");
});

var VIEWS_PATH = path.join(__dirname,"/templates/views");
app.set("views",VIEWS_PATH);
app.set("view engine", "hbs");

app.use(session({
    secret: 'Secret signature for secure session ID',
    resave: false ,
    saveUninitialized: true
})); 

app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.use(express.static(__dirname + '/public'));

var manager = require(__dirname + '/public/js/manager.js');
var employee = require(__dirname + '/public/js/employee.js');

//  <!--  Middleware -->

app.use('/manager' , manager);
app.use('/employee' , employee);

app.get('/', (req,res) => {
    res.render(VIEWS_PATH + '/home.hbs',{
        title : "Steamin' Mugs • Home" ,
        script: "/js/homepagemenu.js",   
        style : '../../css/home.css'
    }); 
});

app.get('/getAllMenus', function (req, res) {
    var db = req.app.locals.menuDB;
    db.collection("menus").find({}).toArray((err,result) => {
      if (err) 
          throw err;
          res.json(result);     
    });
  });

var smtpTransport = nodemailer.createTransport({  
    service: "gmail",  
    host: "smtp.gmail.com",  
    auth: {  
        user: "teamexpressocafe@gmail.com",  
        pass: "expresso@123"  
    }  
});  

app.get('/sendmail', function(req, res) {  
    var mailOptions = {  
        to:"teamexpressocafe@gmail.com",  
        subject:"Email from nodemailer",  
        html:'<div>Name: '+ req.query.name +'</div><div>Email: '+ req.query.email +'</div><div>Message: '+ req.query.message +'</div>'  
    }  
    smtpTransport.sendMail(mailOptions, function(error, response) {  
     if(error) {  
        res.end("error");  
     } else {  
        res.end("sent");  
     }  
   });  
}); 


app.listen(PORT,() => {
    console.log(`Server is listening on port ${PORT}`);
});


