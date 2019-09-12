var express = require('express');
var path = require('path');
var hbs = require('hbs');
var session = require('express-session');
var ObjectId = require('mongodb').ObjectID;
var mongoClient = require('mongodb').MongoClient;
var nodemailer = require('nodemailer');
//var url = 'mongodb://localhost:27017';
var PATH = path.join(__dirname, "/public/");
var PORT = process.env.PORT || 5500;
var app = express();
var db,menuDB,orderDB;
var url;

if(process.env.DB_URL)
    url = 'mongodb+srv://asraj:asraj@123@expresso-cluster-2gmnz.mongodb.net/?retryWrites=true&w=majority';
else
    url = 'mongodb://localhost:27017';  

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

app.use(express.static(PATH));

var manager = require(PATH + './js/manager.js');
var employee = require(PATH + './js/employee.js');

//  <!--  Middleware -->

app.use('/manager' , manager);
app.use('/employee' , employee);

app.get('/', (req,res) => {
    res.render(VIEWS_PATH + '/home.hbs',{
        title : "Steamin' Mugs • Home" ,
        addNavLink:"active",
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

app.get('/aboutus', (req,res) => {
    res.render(VIEWS_PATH + '/aboutus.hbs',{
        title : "Steamin' Mugs • About Us" ,
        style : '../../css/aboutus.css',
    }); 
});

app.get('/speciality', (req,res) => {
    res.render(VIEWS_PATH + '/contactus.hbs',{
        title : "Our Specialities",
    }); 
});

app.get('/contactus', (req,res) => {
    res.render(VIEWS_PATH + '/contactus.hbs',{
        title : "Steamin' Mugs • Contact Us" ,
        style : '../../css/contactus.css',
    }); 
});


app.get('/whats-new', (req,res) => {
    res.render(VIEWS_PATH + '/whats-new.hbs',{
        title : "Steamin' Mugs • Whats New" ,
        style : '../../css/whats-new.css',
    }); 
});

app.get('/cafe-menu', (req,res) => {
    res.render(VIEWS_PATH + '/cafe-menu.hbs',{
        title : "Steamin' Mugs • Cafe Menu" ,
        style : '../../css/cafe-menu.css',
    }); 
});

app.get('/our-coffees', (req,res) => {
    res.render(VIEWS_PATH + '/our-coffees.hbs',{
        title : "Steamin' Mugs • Our Coffees" ,
        style : '../../css/our-coffees.css',
    }); 
});



app.listen(PORT,() => {
    console.log(`Server is listening on port ${PORT}`);
});


