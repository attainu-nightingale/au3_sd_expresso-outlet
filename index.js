var express = require('express');
var path = require('path');
var hbs = require('hbs');
var session = require('express-session');
var ObjectId = require('mongodb').ObjectID;
var mongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017';
var PATH = path.join(__dirname, "/public/");
var PORT = 5500;
var app = express();
var db;

mongoClient.connect(url, {useNewUrlParser : true, useUnifiedTopology: true}, (err,client) => {
    if(err)
    throw err;
    db = client.db('employeeDB');
    console.log("Connected to database : employeeDB");
});

var VIEWS_PATH = path.join(__dirname,"/templates/views");
app.set("views",VIEWS_PATH);
app.set("view engine", "hbs");

hbs.registerHelper('is',function(parameter,string,options){
    if(parameter == string)
        return options.fn(this);
    else
        return options.inverse(this);    
});

var manager = require(PATH + './js/manager.js');
var employee = require(PATH + './js/employee.js');

//  <!--  Middleware -->

app.use('/manager' , manager);
app.use('/employee' , employee);

app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.use(express.static(PATH));

app.use(session({
    secret: 'Secret signature for secure session ID' ,
    resave: false ,
    saveUninitialized: true
})); 

app.get('/', (req,res) => {
    res.render(VIEWS_PATH + '/home.hbs',{
        title : "Steamin' Mugs • Home" ,
        style : '../../css/home.css',
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

app.get('/manager-login', (req,res) => {
    res.render(VIEWS_PATH + '/manager-login.hbs',{
        title : "Manager Login Page" ,
        style : '../../css/login.css'
    }); 
});

app.get('/employee-login', (req,res) => {
    res.render(VIEWS_PATH + '/employee-login.hbs',{
        title : "Employee Login Page" ,
        style : '../../css/login.css'
    }); 
});

app.post("/manager-auth" , (req,res) => {
    console.log(req.body);
    db.collection('manager').find({$and : [{username : req.body.username , password : req.body.password , emp_role : req.body.role}]}).toArray((err,doc) => {
        if (err) 
            throw err;
        console.log(doc);
        if (doc.length > 0) {
            req.session.isLoggedIn = true;
            res.redirect("/manager");
        } 
        else {
            res.redirect("/manager-login");
        }    
    });  
});

app.post("/employee-auth" , (req,res) => {
    console.log(req.body);
    db.collection('employees').find({$and : [{username : req.body.username , password : req.body.password , emp_role : req.body.role}]}).toArray((err,doc) => {
        if (err) 
            throw err;
        console.log(doc);
        if (doc.length > 0) {
            req.session.isLoggedIn = true;
            res.redirect("/employee");
        } 
        else {
            res.redirect("/employee-login");
        }    
    });  
});

// define the /manager/logout route

app.get('/manager/logout', function (req, res) {
    req.session.destroy();
    res.redirect('/manager-login');
});

// define the /employee/logout route

app.get('/employee/logout', function (req, res) {
    req.session.destroy();
    res.redirect('/employee-login');
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


