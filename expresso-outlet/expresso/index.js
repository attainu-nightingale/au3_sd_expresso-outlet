var express=require("express");
var app=express();

var exphbs = require('express-handlebars');

// app.engine("hbs", exphbs({defaultLayout: "main", extname: "hbs"}));
// app.set("view engine", "hbs");

var hbs = require('hbs');
app.set('view engine', hbs);

app.use(express.urlencoded({extended:false}));
app.use(express.static("public"));

//default route //
app.use("/",require("./routes/home"));

//aboutus route this route will inclued aboutus page  //
app.use("/aboutus",require("./routes/aboutus"));

//speciality route will tell about our special items//
app.use("/speciality",require("./routes/speciality"));

//contactus route will display the details of our outlet locations n all//
app.use("/contactus",require("./routes/contactus"));

//login route will check login credentials of three, manager admin employee and will redirect them to their profile route//
app.use("/login",require("./routes/login"));

app.listen(3000);