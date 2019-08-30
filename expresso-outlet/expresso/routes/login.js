var express=require("express");
var router=express.Router();

router.get("/",function(req,res){
    res.render("Login.hbs",{
        title:"Login Page",
        addNavLink:"active"
    })
    
});
module.exports=router;