var express=require("express");
var app=express();

//default route //
app.use("/",require("./home"));

//aboutus route this route will inclued aboutus page  //
app.use("/aboutus",require("./aboutus"));

//speciality route will tell about our special items//
app.use("/speciality",require("./speciality"));

//contactus route will display the details of our outlet locations n all//
app.use("/contactus",require("./contactus"));

//login route will check login credentials of three, manager admin employee and will redirect them to their profile route//
app.use("/login",require("./login"));

app.listen(3000);